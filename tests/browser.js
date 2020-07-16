/* global describe, it, before, after */
const puppeteer = require("puppeteer");
const { spawn } = require("child_process");
const { EventEmitter } = require("events");
const browserSync = require("browser-sync");

describe("browser", function () {
  let browser, page, bs;
  const events = new EventEmitter();
  before(function (done) {
    console.log("building debug website");
    const build = spawn("npm", ["run", "test-public"], { stdio: "inherit" });
    build.on("exit", (code) => {
      if (code !== 0) {
        console.log("there was an error on building the website");
        return done(code);
      }
      console.log("starting server");
      bs = browserSync.create("browsertest");
      bs.init(
        Object.assign({}, require("../bs-config.js"), {
          files: undefined,
          server: "./test-public",
          open: false,
        }),
        done
      );
    });
  });
  before(async function () {
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
