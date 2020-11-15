const fs = require("fs");
const path = require("path");

function aliasing(pkg) {
  return `module.exports = require("${pkg}");`;
}

// add mock to void http* modules
try {
  let partialDirectory = require.resolve("node-libs-browser");
  if (partialDirectory.endsWith("/index.js")) {
    partialDirectory = path.normalize(require.resolve("node-libs-browser") + "/../");
  }
  fs.writeFileSync(path.normalize(partialDirectory + "/mock/http.js"), aliasing("@nao20010128nao/void-http"));
  fs.writeFileSync(path.normalize(partialDirectory + "/mock/https.js"), aliasing("@nao20010128nao/void-http"));
} catch (e) {
  // this fails in travis
}

// bury fetches
fs.writeFileSync(require.resolve("node-fetch/browser.js"), aliasing("@nao20010128nao/void-fetch"));

// bury axios
fs.writeFileSync(require.resolve("axios/index.js"), aliasing("@nao20010128nao/void-axios"));

// nullify blake2b-wasm
fs.writeFileSync(
  require.resolve("blake2b-wasm/index.js"),
  `
  module.exports=()=>{};
  module.exports.ready=module.exports;
  `
);

// reduce @iota/core
{
  let script = "";
  const addExport = (name, path) => {
    script += `exports.${name} = require("${path}").${name};\n`;
  };
  addExport("generateAddress", "./generateAddress");
  fs.writeFileSync(require.resolve("@iota/core/out/core/src/index.js"), script);
}

// reduce bitgo-utxo-lib
{
  fs.writeFileSync(
    require.resolve("bitgo-utxo-lib/src/index.js"),
    `
var script = require('./script')

var templates = require('./templates')
for (var key in templates) {
  script[key] = templates[key]
}

module.exports = {
  ECPair: require('./ecpair'),

  address: require('./address'),
  coins: require('./coins'),
  crypto: require('./crypto'),
  networks: require('./networks'),
  script: script
}
`
  );
}
