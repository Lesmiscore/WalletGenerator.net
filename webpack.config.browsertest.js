// special webpack configuration for running in-browser tests
const path = require("path");
const base = require("./webpack.config.js");

module.exports = {
  ...base,
  entry: "./tests/browser/init.js",
  mode: "development",
  output: {
    path: path.resolve(__dirname, "test-public"),
    filename: "main.js",
  },
};
