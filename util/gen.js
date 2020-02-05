require("@babel/register")({
  plugins: ["@babel/plugin-proposal-optional-chaining"]
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

  const janin = require("../src/janin.currency");
  const currencies = janin.currencies;
  for (let i of currencies) {
    const name = i.name.toLowerCase();
    text += `
    "logos/${name}": lazy(() => require("./../../logos/${name}.png")),
    "wallets/${name}": lazy(() => require("./../../wallets/${name}.png")),
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
    "${`${name}`.replace(/\.(png|gif)$/i, "")}": lazy(() => require("./../../images/${name}")),
    `;
  }

  text += "}";

  fs.writeFileSync("./src/autogen/images.js", text);
})();

const modernizr = require("modernizr");
modernizr.build(require("../modernizr-config.json"), function(output) {
  fs.writeFileSync("src/autogen/modernizr.js", output);
});
