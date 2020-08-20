/* global describe, it */
const assert = require("assert");

describe("coin image on browser", async function () {
  const janin = await import("../../src/janin.currency");
  const coindex = require("../../src/autogen/coindex");
  const currencies = janin.currencies;
  for (let i of currencies) {
    const name = i.name.toLowerCase();
    it(`${name} has a valid logo url`, function () {
      const url = coindex[`logos/${name}`]();
      assert(typeof url === "string", `Logo URL for ${name} is not string`);
      assert(url.endsWith(".png") || url.startsWith("data:"), `Logo URL for ${name} is not either ends with .png or data-scheme URL`);
    });
    it(`${name} has a valid wallet url`, function () {
      const url = coindex[`wallets/${name}`]();
      assert(typeof url === "string", `Wallet URL for ${name} is not string`);
      assert(url.endsWith(".png") || url.startsWith("data:"), `Wallet URL for ${name} is not either ends with .png or data-scheme URL`);
    });
  }
});

describe("image resources on browser", function () {
  const images = require("../../src/autogen/images");
  for (let i in images) {
    if ({}.hasOwnProperty.call(images, i)) {
      it(`${i} has a valid url`, function () {
        const url = images[i]();
        assert(typeof url === "string", `URL for ${i} is not string`);
        assert(url.endsWith(".png") || url.endsWith(".gif") || url.startsWith("data:"), `URL for ${i} does not have valid postfix or is not data-scheme URL`);
      });
    }
  }
});
