const fs = require("fs");

function aliasing(pkg) {
  return `module.exports = require("${pkg}");`;
}

// add mock to void http* modules
fs.writeFileSync("./node_modules/node-libs-browser/mock/http.js", aliasing("@nao20010128nao/void-http"));
fs.writeFileSync("./node_modules/node-libs-browser/mock/https.js", aliasing("@nao20010128nao/void-http"));
