const {default:ethWallet} = await import("ethereumjs-wallet");
import Coin from "./coin.js";

export default class Ethereum extends Coin {
  constructor(name, donate) {
    super(name, donate);
  }

  create(d, Q, opts) {
    if (d) {
      return ethWallet.fromPrivateKey(d.toBuffer());
    }
    return ethWallet.fromPublicKey(Q, true);
  }
  makeRandom(opts) {
    return ethWallet.generate();
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
    return ethWallet.fromPrivateKey(Buffer.from(key, "hex"));
  }

  // correspond to getAddressFormatNames, getAddressTitleNames
  getAddressWith(key, mode) {
    switch (mode) {
      default:
        return key.getChecksumAddressString();
    }
  }

  // correspond to getAddressFormatNames, getAddressTitleNames
  getWIFForAddress(key, mode) {
    switch (mode) {
      default:
        return "0x" + key.getPrivateKey().toString("hex");
    }
  }

  // correspond to getWIFTitleNames
  getWIFByType(key, mode) {
    switch (mode) {
      default:
        return "0x" + key.getPrivateKey().toString("hex");
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
    return key.getPublicKey();
  }
  getPrivateKeyBuffer(key) {
    return key.getPrivateKey();
  }
  havePrivateKey(key) {
    return !!key.getPrivateKey();
  }

  isVanitygenPossible(pattern, mode) {
    const regex = /^(?:0[Xx])?[0-9a-fA-F]{0,40}$/;
    return regex.test(pattern);
  }

  testVanitygenMatch(pattern, address, mode) {
    pattern = pattern.toLowerCase().replace(/^0[Xx]/, "");
    address = address.toLowerCase().replace(/^0[Xx]/, "");
    return address.startsWith(pattern);
  }
};
