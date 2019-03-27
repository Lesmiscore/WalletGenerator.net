/* global describe, it */
const assert = require("assert");
const fs = require("fs");
require("./fakedocument");

describe("coin image", function() {
  const janin = require("../src/janin.currency");
  const names = janin.currencies.map(a => `${a.name}`.toLowerCase());
  for (let i of names) {
    it(`${i} has a valid logo`, function() {
      fs.statSync(`logos/${i.toLowerCase()}.png`);
    });
    it(`${i} has a valid wallet background`, function() {
      fs.statSync(`wallets/${i.toLowerCase()}.png`);
    });
  }
});
