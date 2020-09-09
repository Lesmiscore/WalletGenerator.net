const fs = require("fs");
const path = require("path");
const webpack = require("webpack");
const util = require("util");
const cheerio = require("cheerio");
const { fork } = require("child_process");
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

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
  const webpackResult = await util.promisify(webpack)(require("../webpack.config.singlescript.js"));
  if (webpackResult.hasErrors()) {
    throw webpackResult.toJson().errors.join("\n");
  }

  const $ = cheerio.load(await readFile("src/index.html"));
  $("script").each((idx, elem) => {
    const $_ = $(elem);
    const src = $_.attr("src");
    console.log(`reading ${src}`);
    $_.removeAttr("src");
    const script = fs.readFileSync(path.resolve("public/", src));
    $_.text(script);
  });
  await writeFile("public/standalone.html", $.html());
  console.log("built at public/standalone.html");
})().catch(console.error);
