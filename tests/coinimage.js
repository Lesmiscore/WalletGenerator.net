/* global describe, it */
const assert = require("assert");
const fs = require("fs");
const testMisc = require("./misc");
require("./fakedocument");

describe("coin image", function () {
  for (let i of testMisc.grabAllCoinNames()) {
    const name = i.toLowerCase();
    it(`${name} has a valid logo`, function () {
      fs.statSync(`logos/${name}.png`);
    });
    it(`${name} has a valid wallet background`, function () {
      fs.statSync(`wallets/${name}.png`);
    });
  }
});
