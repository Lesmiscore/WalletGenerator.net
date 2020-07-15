/* global describe, it, before, after */
const puppeteer = require("puppeteer");
const { spawn } = require("child_process");
const { EventEmitter } = require("events");

describe("browser", function () {
  let browser, page, proc;
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
      proc = spawn("npm", ["run", "test-browser"], { stdio: "inherit" });
      return done();
    });
  });
  before(async function () {
    console.log("launching browser");
    browser = await puppeteer.launch();
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
    await page.goto("http://localhost:3000/");
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
    if (proc) {
      proc.kill();
    }
  });
});
