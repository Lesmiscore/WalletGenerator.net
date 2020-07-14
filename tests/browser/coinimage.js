/* global describe, it */
const assert = require("assert");

describe("coin image on browser", function () {
  const janin = require("../../src/janin.currency");
  const coindex = require("../../src/autogen/coindex");
  const currencies = janin.currencies;
  for (let i of currencies) {
    const name = i.name.toLowerCase();
    it(`${name} has a valid logo url`, function () {
      const url = coindex[`logos/${name}`]();
      assert(typeof url === "string", `Logo URL for ${name} is not string`);
      assert(url.endsWith(".png") || url.startsWith("data:"), `Logo URL for ${name} is not either ennds with .png or data-scheme URL`);
    });
    it(`${name} has a valid wallet url`, function () {
      const url = coindex[`wallets/${name}`]();
      assert(typeof url === "string", `Wallet URL for ${name} is not string`);
      assert(url.endsWith(".png") || url.startsWith("data:"), `Wallet URL for ${name} is not either ennds with .png or data-scheme URL`);
    });
  }
});
