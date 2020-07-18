const keypairs = require("ripple-keypairs");
const Coin = require("./coin");

const elliptic = require("elliptic");
const Ed25519 = elliptic.eddsa("ed25519");
const Secp256k1 = elliptic.ec("secp256k1");

module.exports = class Ripple extends Coin {
  constructor(name, donate) {
    super(name, donate);
  }

  create(d, Q, opts) {
    const seed = keypairs.generateSeed({
      entropy: d.toBuffer(),
    });
    const kp = keypairs.deriveKeypair(seed);
    kp.seed = seed;
    return kp;
  }
  makeRandom(opts) {
    const seed = keypairs.generateSeed();
    const kp = keypairs.deriveKeypair(seed);
    kp.seed = seed;
    return kp;
  }

  isPrivateKey(key) {
    try {
      // seed
      keypairs.deriveKeypair(key);
      return true;
    } catch (e) {}
    key = `${key}`.toLowerCase();
    if (/(?:00|ed)[0-9a-f]{64}/.test(key)) {
      return true;
    }
    return false;
  }

  decodePrivateKey(key) {
    try {
      // seed
      const kp = keypairs.deriveKeypair(key);
      kp.seed = key;
      return kp;
    } catch (e) {}
    key = `${key}`.toLowerCase();
    if (/(?:00|ed)[0-9a-f]{64}/.test(key)) {
      return {
        privateKey: key,
        publicKey: this.privateToPublic(key),
      };
    }
    return false;
  }

  // correspond to getAddressFormatNames, getAddressTitleNames
  getAddressWith(key, mode) {
    switch (mode) {
      default:
        return keypairs.deriveAddress(key.publicKey);
    }
  }

  // correspond to getAddressFormatNames, getAddressTitleNames
  getWIFForAddress(key, mode) {
    switch (mode) {
      default:
        return key.seed || key.privateKey;
    }
  }

  // correspond to getWIFTitleNames
  getWIFByType(key, mode) {
    switch (mode) {
      case 0:
        return key.privateKey;
      default:
        return key.seed || key.privateKey;
    }
  }

  getAddressFormatNames(key) {
    return ["Normal", "Hex", "Seed"];
  }
  getAddressTitleNames(key) {
    return ["Public Address"];
  }

  getWIFTitleNames(key) {
    return ["Raw hex", "Seed"];
  }

  getPublicKey(key, compressed) {
    return Buffer.from(key.publicKey, "hex");
  }
  getPrivateKeyBuffer(key) {
    return Buffer.from(key.privateKey, "hex");
  }
  havePrivateKey(key) {
    return !!(key.seed || key.privateKey);
  }

  privateToPublic(privateKey) {
    privateKey = `${privateKey}`.toLowerCase();
    if (privateKey.startsWith("00")) {
      return Buffer.from(Secp256k1.keyFromPrivate(privateKey.slice(2)).getPublic().encodeCompressed()).toString("hex");
    } else if (privateKey.startsWith("ed")) {
      return Buffer.from(Ed25519.keyFromPrivate(privateKey.slice(2)).getPublic().encodeCompressed()).toString("hex");
    }
  }

  isUnsure() {
    return true;
  }
};
