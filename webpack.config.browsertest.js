const path = require("path");
const base = require("./webpack.config.js");

Object.assign(module.exports, base, {
  entry: "./tests/browser/init.js",
  mode: "development",
  output: {
    path: path.resolve(__dirname, "test-public"),
    filename: "main.js",
  },
});
