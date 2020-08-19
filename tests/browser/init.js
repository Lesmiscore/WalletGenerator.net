/* global mocha, before, beforeEach, afterEach, after */
async function load() {
  await import("../../src/init.js");
  const onload = (await import("../../src/ninja.misc.onload")).default;
  const mochaDiv = document.createElement("div");
  mochaDiv.id = "mocha";
  document.body.appendChild(mochaDiv);
  const [_, mocha] = await Promise.all([import("mocha/mocha.css"), import("mocha")]);
  mocha.setup("bdd");
  mocha.checkLeaks();

  if (global.reportTestStatus) {
    // https://stackoverflow.com/questions/27553666/how-to-get-mocha-test-name-in-the-before-hook
    before(function () {
      console.log("full title:", this.test.fullTitle());
      console.log("parent title:", this.test.parent.title);

      inspectSuite(this.test.parent);
      function inspectSuite(suite) {
        global.reportTestStatus("report-describe", suite.title);

        suite.suites.forEach((suite) => inspectSuite(suite));
        suite.tests.forEach((test) => inspectTest(test));
      }

      function inspectTest(test) {
        global.reportTestStatus("report-it", test.fullTitle());
      }
    });

    beforeEach(function () {
      global.reportTestStatus("starting", this.test.fullTitle());
    });

    afterEach(function () {
      global.reportTestStatus("completed", this.currentTest.fullTitle(), this.currentTest.isPassed());
    });

    after(function () {
      global.reportTestStatus("finished");
    });
  }

  await import("./images.js");
  await import("./bitcoin.js");

  onload(() => {
    mocha.run();
  });
}

load().catch(console.error);
