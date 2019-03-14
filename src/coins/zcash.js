const zcash = require("bitcoinjs-lib-zcash");
const Bitcoin = require("./bitcoin");

module.exports = class Zcash extends Bitcoin {
  constructor(
    name,
    networkVersion,
    privateKeyPrefix,
    WIF_Start,
    CWIF_Start,
    donate,
    scriptHash,
    b32hrp
  ) {
    super(
      name,
      networkVersion,
      privateKeyPrefix,
      WIF_Start,
      CWIF_Start,
      donate,
      scriptHash,
      b32hrp
    );
    this.world = zcash;
  }
};
