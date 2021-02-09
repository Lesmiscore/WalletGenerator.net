/* global describe, it, before, after */
const puppeteer = require("puppeteer");
const { EventEmitter } = require("events");
const browserSync = require("browser-sync");
const webpack = require("webpack");
const fs = require("fs");
const util = require("util");
const { fork, spawn } = require("child_process");

describe("browser", function () {
  let browser, page, bs, recorder;
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

    console.log("starting encoder");
    try {
      await util.promisify(fs.unlink)("record.mp4");
    } catch (e) {}
    try {
      recorder = spawn(
        "ffmpeg",
        ["-f", "image2pipe", "-framerate", "1", "-vcodec", "png", "-i", "-", "-vcodec", "libx264", "-vf", "format=yuv420p", "-r", "30", "-movflags", "+faststart", "record.mp4"],
        {
          stdio: ["pipe", "inherit", "inherit"],
        }
      );
    } catch (e) {}

    console.log("launching browser");
    browser = await puppeteer.launch({ args: ["--no-sandbox"] });
    page = await browser.newPage();

    if (recorder) {
      const client = page._client;
      await client.send("Page.startScreencast", {
        format: "png",
      });
      client.on("Page.screencastFrame", ({ data, sessionId }) => {
        data = Buffer.from(data, "base64");
        recorder.stdin.write(data);
        client.send("Page.screencastFrameAck", { sessionId }).catch(() => {});
      });
    }

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
    console.log("closing browser and server and recorder");
    if (browser) {
      await browser.close();
    }
    if (bs) {
      bs.exit();
    }
    if (recorder) {
      recorder.stdin.end();
      recorder.stdin.once("finish", () => {
        setTimeout(() => recorder.kill("SIGINT"), 100);
      });
    }
  });
});
