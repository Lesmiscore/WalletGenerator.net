require("@babel/register")({
  plugins: ["@babel/plugin-proposal-optional-chaining"],
});

// Generate necessary require()s for all coins
require("../tests/fakedocument");
const fs = require("fs");

try {
  fs.mkdirSync("./src/autogen/");
} catch (e) {}
(() => {
  // coindex
  let text = `
    const lazy=require("../lazy/var");
    module.exports={
    `;

  const misc = require("../tests/misc.js");
  for (const i of misc.grabAllCoinNames()) {
    const name = i.toLowerCase();
    text += `
    "logos/${name}": lazy(() => require("./../../logos/${name}.png")["default"]),
    "wallets/${name}": lazy(() => require("./../../wallets/${name}.png")["default"]),
    `;
  }

  text += "}";

  fs.writeFileSync("./src/autogen/coindex.js", text);
})();
(() => {
  // images
  let text = `
    const lazy=require("../lazy/var");
    module.exports={
    `;

  const names = fs.readdirSync("images/");
  for (let name of names) {
    text += `
    "${`${name}`.replace(/\.(png|gif)$/i, "")}": lazy(() => require("./../../images/${name}")["default"]),
    `;
  }

  text += "}";

  fs.writeFileSync("./src/autogen/images.js", text);
})();

const modernizr = require("modernizr");
modernizr.build(require("../modernizr-config.json"), function (output) {
  fs.writeFileSync("src/autogen/modernizr.js", output);
});
