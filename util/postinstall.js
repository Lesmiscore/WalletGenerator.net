const fs = require("fs");

function aliasing(pkg) {
  return `module.exports = require("${pkg}");`;
}

// add mock to void http* modules
fs.writeFileSync("./node_modules/node-libs-browser/mock/http.js", aliasing("@nao20010128nao/void-http"));
fs.writeFileSync("./node_modules/node-libs-browser/mock/https.js", aliasing("@nao20010128nao/void-http"));

// bury fetches
fs.writeFileSync("./node_modules/node-fetch/browser.js", aliasing("@nao20010128nao/void-fetch"));
fs.writeFileSync("./node_modules/whatwg-fetch/fetch.js", aliasing("@nao20010128nao/void-fetch"));
fs.writeFileSync("./node_modules/whatwg-fetch/dist/fetch.umd.js", aliasing("@nao20010128nao/void-fetch"));

// bury axios
fs.writeFileSync("./node_modules/axios/index.js", aliasing("@nao20010128nao/void-axios"));

// nullify blake2b-wasm
fs.writeFileSync(
  "./node_modules/blake2b-wasm/index.js",
  `
module.exports=()=>{};
module.exports.ready=module.exports;
`
);
