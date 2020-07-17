// https://github.com/iotaledger/iota.js/blob/081e621599ce36d49f54d458131b9b32ab91ace5/packages/core/src/generateAddress.ts
import Coin from "./coin.js";
const {default:iota} = await import("@iota/core");
import baseX from "base-x";
const baseTrytes = baseX("9ABCDEFGHIJKLMNOPQRSTUVWXYZ");
import randomBytes from "randombytes";
const trytesRegex = /^[9A-Z]+$/;

export default class IOTA extends Coin {
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
  getAddressWith(key, mode) {
    return iota.generateAddress(key, mode);
  }

  // correspond to getAddressFormatNames, getAddressTitleNames
  getWIFForAddress(key, mode) {
    return key;
  }

  // correspond to getWIFTitleNames
  getWIFByType(key, mode) {
    return key;
  }

  getAddressFormatNames() {
    return [
      "Normal (Index 0)",
      "Normal (Index 1)",
      "Normal (Index 2)",
      "Normal (Index 3)",
      "Normal (Index 4)",
      "Normal (Index 5)",
      "Normal (Index 6)",
      "Normal (Index 7)",
      "Normal (Index 8)",
      "Normal (Index 9)",
      "Normal (Index 10)",
      "Normal (Index 11)",
      "Normal (Index 12)",
      "Normal (Index 13)",
      "Normal (Index 14)",
      "Normal (Index 15)",
    ];
  }
  getAddressTitleNames() {
    return [
      "Public Address (Index 0)",
      "Public Address (Index 1)",
      "Public Address (Index 2)",
      "Public Address (Index 3)",
      "Public Address (Index 4)",
      "Public Address (Index 5)",
      "Public Address (Index 6)",
      "Public Address (Index 7)",
      "Public Address (Index 8)",
      "Public Address (Index 9)",
      "Public Address (Index 10)",
      "Public Address (Index 11)",
      "Public Address (Index 12)",
      "Public Address (Index 13)",
      "Public Address (Index 14)",
      "Public Address (Index 15)",
    ];
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

  isUnsure() {
    return true;
  }

  _makeTrytesBytes(bytes) {
    let draft = baseTrytes.encode(bytes);
    while (draft.length % 81 !== 0) {
      draft += "9";
    }
    return draft;
  }
  _makeTrytesRandom(bytes = 47) {
    return this._makeTrytesBytes(randomBytes(bytes));
  }
};
