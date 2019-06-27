const zcash = require("bitcoinjs-lib-zcash");
const Bitcoin = require("./bitcoin");
const { upperValue, lowerValue } = require("./constants");

module.exports = class Zcash extends Bitcoin {
  constructor(name, networkVersion, privateKeyPrefix, donate) {
    super(name, networkVersion, privateKeyPrefix, donate);
    this.world = zcash;
  }

  getAddressFormatNames() {
    return [
      "Compressed",
      "Uncompressed"
      // no segwit
      // no cashaddress
    ];
  }
  getAddressTitleNames() {
    return ["Public Address Compressed", "Public Address"];
  }

  isVanitygenPossible(pattern, mode) {
    if (!pattern) return true;
    const btcB58 = "[123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]{0,34}$";
    const self = this;
    function testBase58(pkh) {
      const begin = self.world.address.toBase58Check(upperValue, pkh).slice(0, 2);
      const final = self.world.address.toBase58Check(lowerValue, pkh).slice(0, 2);
      const regex = new RegExp(`^(?:${begin}|${final})${btcB58}`);
      return regex.test(pattern);
    }
    switch (mode || 0) {
      default:
      case 0: // compressed
      case 1: // uncompressed
        return testBase58(this.network.pubKeyHash);
    }
  }
};
