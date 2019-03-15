const zcash = require("bitcoinjs-lib-zcash");
const Bitcoin = require("./bitcoin");

module.exports = class Zcash extends Bitcoin {
  constructor(
    name,
    networkVersion,
    privateKeyPrefix,
    WIF_Start,
    CWIF_Start,
    donate
  ) {
    super(
      name,
      networkVersion,
      privateKeyPrefix,
      WIF_Start,
      CWIF_Start,
      donate
    );
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
};
