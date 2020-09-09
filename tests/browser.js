/* global describe, it, before, after */
const puppeteer = require("puppeteer");
const { EventEmitter } = require("events");
const browserSync = require("browser-sync");
const webpack = require("webpack");
const fs = require("fs");
const util = require("util");
const { fork } = require("child_process");

describe("browser", function () {
  let browser, page, bs;
  const events = new EventEmitter();
  // this replaces old "npm run" based scripts
  before(async function () {
    console.log("building debug website");
    // equivalent to "node ./util/gen.js"
    await new Promise((resolve, reject) => {
      fork("./util/gen.js")
        .on("error", reject)
        .on("exit", (code) => (code === 0 ? resolve() : reject(code)));
    });

    // equivalent to "webpack --config webpack.config.browsertest.js"
    // https://webpack.js.org/api/node/
    /**
     * @type {webpack.Stats}
     */
    const webpackResult = await util.promisify(webpack)(require("../webpack.config.browsertest.js"));
    if (webpackResult.hasErrors()) {
      throw webpackResult.toJson().errors.join("\n");
    }

    // equivalent to "cp src/index.html test-public/"
    await util.promisify(fs.copyFile)("src/index.html", "test-public/index.html");

    // equivalent to "browser-sync start --config ../bs-config.js" with some changes to config
    console.log("starting server");
    bs = browserSync.create("browsertest");
    await util.promisify(bs.init)(
      Object.assign({}, require("../bs-config.js"), {
        server: "./test-public",
        open: false,
      })
    );

    console.log("launching browser");
    browser = await puppeteer.launch({ args: ["--no-sandbox"] });
    page = await browser.newPage();

    await page.exposeFunction("reportTestStatus", (status, name, additional) => {
      events.emit(status, name, additional);
    });
  });
  it("tests should pass", async function () {
    const failures = [];
    events.on("completed", (name, additional) => {
      const subject = additional ? "OK" : "ERR";
      console.log(`${name}: ${subject}`);
      if (!additional) {
        failures.push(name);
      }
    });
    const port = bs.getOption("port");
    await page.goto(`http://localhost:${port}/`);
    await new Promise((resolve, reject) => {
      function realEnd() {
        if (!failures.length) {
          resolve("okay");
        } else {
          reject(failures);
        }
      }
      events.once("finished", realEnd);
      // wait up to 5 seconds
      setTimeout(() => {
        failures.push("timed out");
        realEnd();
      }, 5000);
    });
  });
  after(async function () {
    console.log("closing browser and server");
    if (browser) {
      await browser.close();
    }
    if (bs) {
      bs.exit();
    }
  });
});
