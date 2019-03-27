const Bitcoin = require("./bitcoin");
const bitcoin = require("bitcoinjs-lib");
const bchaddrjs = require("bchaddrjs");

module.exports = class BitcoinCash extends Bitcoin {
  constructor(name, networkVersion, privateKeyPrefix, donate) {
    super(name, networkVersion, privateKeyPrefix, donate);
  }

  getAddressWith(btcKey, mode) {
    const compressed = btcKey.compressed;
    try {
      let legacy;
      switch (mode || 0) {
        case 0: // compressed
          btcKey.compressed = true;
          // bitcoin
          return bitcoin.ECPair.prototype.getAddress.call(btcKey);
        case 1: // uncompressed
          btcKey.compressed = false;
          // bitcoin
          return bitcoin.ECPair.prototype.getAddress.call(btcKey);
        case 2: // cashaddr (compressed)
          legacy = this.getAddressWith(btcKey, 0);
          return bchaddrjs.toCashAddress(legacy).split(":")[1];
        case 3: // cashaddr (uncompressed)
          legacy = this.getAddressWith(btcKey, 1);
          return bchaddrjs.toCashAddress(legacy).split(":")[1];
      }
      return this.getAddressWith(btcKey, 0);
    } finally {
      btcKey.compressed = compressed;
    }
  }
  getWIFWith(btcKey, mode) {
    const compressed = btcKey.compressed;
    try {
      switch (mode) {
        case 1: // uncompressed
        case 3: // cashaddr (uncompressed)
          btcKey.compressed = false;
          break;
        default:
          // other
          btcKey.compressed = true;
          break;
      }
      return btcKey.toWIF();
    } finally {
      btcKey.compressed = compressed;
    }
  }

  getAddressFormatNames() {
    return [
      "Compressed",
      "Uncompressed",
      // no segwit
      "CashAddress (Compressed)",
      "CashAddress (Uncompressed)"
    ];
  }
  getAddressTitleNames() {
    return [
      "Public Address Compressed",
      "Public Address",
      // no segwit
      "CashAddress (Compressed)",
      "CashAddress (Uncompressed)"
    ];
  }
};
