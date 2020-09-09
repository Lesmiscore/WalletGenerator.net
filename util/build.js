const fs = require("fs");
const webpack = require("webpack");
const util = require("util");
const { fork } = require("child_process");

(async () => {
  console.log("building website");
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
  const webpackResult = await util.promisify(webpack)(require("../webpack.config.js"));
  if (webpackResult.hasErrors()) {
    throw webpackResult.toJson().errors.join("\n");
  }

  // equivalent to "cp src/index.html public/"
  await util.promisify(fs.copyFile)("src/index.html", "public/index.html");
})().catch(console.error);
