/*require("@babel/register")({
  plugins: [
    "@babel/plugin-syntax-top-level-await",
    "@babel/plugin-proposal-optional-chaining"
  ],
});*/

// Generate necessary require()s for all coins
import "../tests/fakedocument.js";
import { mkdirSync, writeFileSync, readdirSync } from "fs";
import { currencies } from '../src/janin.currency.js';
//const { currencies } = pkg;
import pkg2 from 'modernizr';
const { build } = pkg2;
import modernizrConfig from "../modernizr-config.json";

try {
  mkdirSync("./src/autogen/");
} catch (e) {}
(() => {
  // coindex
  let text = `
    import lazy from "../lazy/var.js";
    export default{
    `;

  for (let i of currencies) {
    const name = i.name.toLowerCase();
    text += `
    "logos/${name}": lazy(() => require("./../../logos/${name}.png")["default"]),
    "wallets/${name}": lazy(() => require("./../../wallets/${name}.png")["default"]),
    `;
  }

  text += "}";

  writeFileSync("./src/autogen/coindex.js", text);
})();
(() => {
  // images
  let text = `
    import lazy from "../lazy/var.js";
    export default{
    `;

  const names = readdirSync("images/");
  for (let name of names) {
    text += `
    "${`${name}`.replace(/\.(png|gif)$/i, "")}": lazy(() => require("./../../images/${name}")["default"]),
    `;
  }

  text += "}";

  writeFileSync("./src/autogen/images.js", text);
})();

build(modernizrConfig, function (output) {
  writeFileSync("src/autogen/modernizr.js", "export const tempM={};"+output+"\nexport const Modernizr = tempM;");
});
