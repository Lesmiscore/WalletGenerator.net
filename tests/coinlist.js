/* global describe, it */
const assert = require("assert");
const testMisc = require("./misc");
require("./fakedocument");

describe("coin list", function () {
  it("should do the same", function () {
    const regex = testMisc.grabAllCoinNames();
    const tree = testMisc.grabAllCoinNames2();
    assert.deepEqual(regex, tree);
  });
});
