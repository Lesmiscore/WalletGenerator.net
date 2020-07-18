import * as randomBytes from "randombytes";
import * as Coin from "./coin.js";
const nem = (await import("nem-sdk")).default;

export class NEM extends Coin {
  constructor(name, donate, network) {
    super(name, donate);
    this.network = network || nem.model.network.data.mainnet.id;
  }

  _create(pk) {
    const privBytes = Buffer.from(pk, "hex");
    const kp = nem.crypto.keyPair.create(pk);
    kp.privateKeyBuffer = privBytes;
    return kp;
  }

  create(d, Q, opts) {
    return this._create(d.toBuffer().toString("hex"));
  }
  makeRandom(opts) {
    return this._create(randomBytes(32).toString("hex"));
  }

  isPrivateKey(key) {
    key = `${key}`.toLowerCase();
    if (key.startsWith("0x")) {
      key = key.slice(2);
    }
    return /^[0-9a-f]{64}$/.test(key);
  }

  decodePrivateKey(key) {
    key = `${key}`.toLowerCase();
    if (key.startsWith("0x")) {
      key = key.slice(2);
    }
    return this._create(key);
  }

  // correspond to getAddressFormatNames, getAddressTitleNames
  getAddressWith(key, mode) {
    switch (mode) {
      default:
        return nem.model.address.toAddress(key.publicKey.toString(), this.network);
    }
  }

  // correspond to getAddressFormatNames, getAddressTitleNames
  getWIFForAddress(key, mode) {
    switch (mode) {
      default:
        return key.privateKeyBuffer.toString("hex");
    }
  }

  // correspond to getWIFTitleNames
  getWIFByType(key, mode) {
    switch (mode) {
      default:
        return key.privateKeyBuffer.toString("hex");
    }
  }

  getAddressFormatNames() {
    return ["Normal"];
  }
  getAddressTitleNames() {
    return ["Public Address"];
  }

  getWIFTitleNames() {
    return ["Private Key"];
  }

  getPublicKey(key, compressed) {
    return key.publicKey;
  }
  getPrivateKeyBuffer(key) {
    return Buffer.from(key.privateKeyBuffer);
  }
  havePrivateKey(key) {
    return true;
  }

  isVanitygenPossible(pattern, mode) {
    if (!pattern) return true;
    pattern = pattern.toUpperCase();
    const prefix = nem.model.network.id2Char(this.network);
    const regex = new RegExp(`^${prefix}[ABCDEFGHIJKLMNOPQRSTUVWXYZ234567]{0,39}$`);
    return regex.test(pattern);
  }
  testVanitygenMatch(pattern, address, mode) {
    pattern = pattern.toUpperCase();
    address = address.toUpperCase();
    return address.startsWith(pattern);
  }

  isUnsure() {
    return "nem";
  }
};

export const mainnet = nem.model.network.data.mainnet.id;
export const testnet = nem.model.network.data.testnet.id;
export const mijin = nem.model.network.data.mijin.id;
