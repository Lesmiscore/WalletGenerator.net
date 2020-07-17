/* global describe, it */
const assert = require("assert");
require("./fakedocument");
const testMisc = require("./misc");

describe("coin order", function () {
  it("keeps correct order", function () {
    const names = testMisc.grabAllCoinNames();
    const mainnets = names.filter((a) => !a.toLowerCase().startsWith("testnet "));
    const testnets = names.filter((a) => a.toLowerCase().startsWith("testnet "));
    mainnets.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));
    testnets.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));
    const expected = [].concat(mainnets, testnets);
    assert.deepEqual(names, expected);
  });
});
