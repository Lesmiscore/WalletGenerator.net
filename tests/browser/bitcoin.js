/* global describe, it */
const assert = require("assert");

const bitcoinCurrency = require("../../src/janin.currency").currencies.find((curr) => curr.name === "Bitcoin");
describe("bitcoin", function () {
  ["L5JywexZwWuN9rM2Hs9zwudmwLBHNqqjcAh1xFhv6g413mufdXFG", "5KFBSucisZhx7mY3ocLLkaysWFZPirEF3N3yD5G7MRdqp5EGa93"].forEach((item, index) => {
    it(`can load ordinary WIF ${index}`, function () {
      bitcoinCurrency.decodePrivateKey(item);
    });
  });
  [
    // wrong checksum
    "L5JywexZwWuN9rM2Hs9zwudmwLBHNqqjcAh1xFhv6g413mufdFFG",
    // corrupt character
    "LJywexZwWuN9rM2Hs9zwudmwLBHNqqjcAh1xFhv6g413mufdFFG",
    // extra character
    "L5JywexZwWuN9rM2Hs9zwudmwLBHNqqjcAh1xFhv6g413mufdXFGG",
  ].forEach((item, index) => {
    it(`can not load extra-ordinary WIF ${index}`, function () {
      let returned = null;
      try {
        returned = bitcoinCurrency.decodePrivateKey(item);
      } catch (error) {}
      if (returned) {
        throw new Error(`${item} must be invalid`);
      }
    });
  });
  ["S6c56bnXQiBjk9mqSYE7ykVQ7NzrRy", "ShSaPngdjWM1kiN4CzVwr81myEiTux"].forEach((item, index) => {
    it(`can load Mini key ${index}`, function () {
      bitcoinCurrency.decodePrivateKey(item);
    });
  });
});
