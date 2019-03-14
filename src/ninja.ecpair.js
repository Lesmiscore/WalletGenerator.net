const janin = require("./janin.currency.js");
const privateKey = require("./ninja.privatekey.js");
const bitcoin = require("bitcoinjs-lib");
const zcash = require("bitcoinjs-lib-zcash");

const ecpair = (module.exports = {
  getAddressWith: privateKey.getAddressWith,
  getWIFWith: privateKey.getWIFWith,
  create: function(d, Q, opts) {
    opts = Object.assign({}, opts || {}, {
      network: janin.selectedCurrency
    });
    if (janin.selectedCurrency.zcash) {
      return new zcash.ECPair(d, Q, opts);
    } else {
      return new bitcoin.ECPair(d, Q, opts);
    }
  },
  makeRandom: function(opts) {
    opts = Object.assign({}, opts || {}, {
      network: janin.selectedCurrency
    });
    if (janin.selectedCurrency.zcash) {
      return zcash.ECPair.makeRandom(opts);
    } else {
      return bitcoin.ECPair.makeRandom(opts);
    }
  }
});
