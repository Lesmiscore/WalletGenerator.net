const Bitcoin = require("./bitcoin");
const bitcoin = require("bitgo-utxo-lib");
const bchaddrjs = require("bchaddrjs");
const constants = require("./constants");

module.exports = class BitcoinCash extends Bitcoin {
  constructor(name, networkVersion, privateKeyPrefix, donate) {
    super(name, networkVersion, privateKeyPrefix, donate, undefined, undefined, bitcoin.coins.BCH);
  }

  getAddressWith(btcKey, mode) {
    const compressed = btcKey.compressed;
    try {
      let legacy;
      switch (mode || 0) {
        case 0: // compressed
          btcKey.compressed = true;
          return bitcoin.ECPair.prototype.getAddress.call(btcKey);
        case 1: // uncompressed
          btcKey.compressed = false;
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

  isVanitygenPossible(pattern, mode) {
    const btcB58 = "[123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]+$";
    function testBase58(version) {
      const headRegex = constants.bitcoinB58Leading[version];
      const regex = new RegExp(`^${headRegex}${btcB58}`);
      return regex.test(pattern);
    }
    function testBase32() {
      const regex = /^(?:bitcoincash:)?q[abcdefghijklmnopqrstuvwxyz234567]{0,41}$/;
      return regex.test(pattern);
    }
    switch (mode || 0) {
      default:
      case 0: // compressed
      case 1: // uncompressed
        return testBase58(this.network.pubKeyHash);
      case 2: // cashaddr (compressed)
      case 3: // cashaddr (uncompressed)
        return testBase32();
    }
  }

  testVanitygenMatch(pattern, address, mode) {
    pattern = pattern.replace(/^bitcoincash:/, "");
    address = address.replace(/^bitcoincash:/, "");
    return address.startsWith(pattern);
  }
};
