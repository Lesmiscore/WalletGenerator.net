/* global describe, it */
const assert = require("assert");
require("./fakedocument");

describe("coin order", function () {
  it("keeps correct order", function () {
    const janin = require("../src/janin.currency");
    const names = janin.currencies.map((a) => a.name);
    const mainnets = names.filter((a) => !a.toLowerCase().startsWith("testnet "));
    const testnets = names.filter((a) => a.toLowerCase().startsWith("testnet "));
    mainnets.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));
    testnets.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));
    const expected = [].concat(mainnets, testnets);
    assert.deepEqual(names, expected);
  });
});
