// https://github.com/iotaledger/iota.js/blob/081e621599ce36d49f54d458131b9b32ab91ace5/packages/core/src/generateAddress.ts
const Coin = require("./coin");
const baseTrytes = require("base-x")("9ABCDEFGHIJKLMNOPQRSTUVWXYZ");
const randomBytes = require("randombytes");
const trytesRegex = /^[9A-Z]+$/;

module.exports = class Bitcoin extends Coin {
  constructor(name, donate) {
    super(name, donate);
  }

  create(d, Q, opts) {
    return this._makeTrytesBytes(d.toBuffer());
  }
  makeRandom(opts) {
    return this._makeTrytesRandom();
  }

  isPrivateKey(key) {
    return trytesRegex.test(key);
  }

  decodePrivateKey(key) {
    if (this.isPrivateKey(key)) {
      return key;
    } else {
      throw new Error("Not a valid trytes");
    }
  }

  // correspond to getAddressFormatNames, getAddressTitleNames
  getAddressWith(key, mode) {}

  // correspond to getAddressFormatNames, getAddressTitleNames
  getWIFForAddress(key, mode) {
    return key;
  }

  // correspond to getWIFTitleNames
  getWIFByType(key, mode) {
    return key;
  }

  getAddressFormatNames() {
    return ["Normal"];
  }
  getAddressTitleNames() {
    return ["Public Address"];
  }

  getWIFTitleNames() {
    return ["Trytes"];
  }

  getPublicKey(key, compressed) {
    return Buffer.allocUnsafe(0);
  }
  getPrivateKeyBuffer(key) {
    return baseTrytes.decode(key);
  }
  havePrivateKey(key) {
    return true;
  }

  _makeTrytesBytes(bytes) {
    let draft = baseTrytes.encode(bytes);
    while (draft.length % 81 !== 0) {
      draft += "9";
    }
    return draft;
  }
  _makeTrytesRandom(bytes = 32) {
    return this._makeTrytesBase(randomBytes(bytes));
  }
};
