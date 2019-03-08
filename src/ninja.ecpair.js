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
