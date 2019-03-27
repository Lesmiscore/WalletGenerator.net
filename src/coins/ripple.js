const translator = require("../ninja.translator.js");
const keypairs = require("ripple-keypairs");

const elliptic = require("elliptic");
const Ed25519 = elliptic.eddsa("ed25519");
const Secp256k1 = elliptic.ec("secp256k1");

module.exports = class Ripple {
  constructor(name, donate) {
    this.name = name;
    this.donate = donate;
  }

  create(d, Q, opts) {
    const seed = keypairs.generateSeed({
      entropy: d.toBuffer()
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
        publicKey: this.privateToPublic(key)
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

  templateArtisticHtml(i) {
    const keyelement = "btcprivwif";
    const coinImgUrl = "logos/" + this.name.toLowerCase() + ".png";
    const walletBackgroundUrl = "wallets/" + this.name.toLowerCase() + ".png";

    const walletHtml = `
      <div class='coinIcoin'>
        <img id='coinImg' src='${coinImgUrl}' alt='currency_logo' />
      </div>
      <div class='artwallet' id='artwallet${i}'>
        <img id='papersvg${i}' class='papersvg' src='${walletBackgroundUrl}' />
        <div id='qrcode_public${i}' class='qrcode_public'></div>
        <div id='qrcode_private${i}' class='qrcode_private'></div>
        <div class='btcaddress' id='btcaddress${i}'></div>
        <div class='${keyelement}' id='${keyelement}${i}'></div>
        <div class='paperWalletText'>
          <img class='backLogo' src='${coinImgUrl}' alt='currency_logo' />
          ${translator.get("paperwalletback")}
        </div>
      </div>
    `;
    return walletHtml;
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
      return Buffer.from(
        Secp256k1.keyFromPrivate(privateKey.slice(2))
          .getPublic()
          .encodeCompressed()
      ).toString("hex");
    } else if (privateKey.startsWith("ed")) {
      return Buffer.from(
        Ed25519.keyFromPrivate(privateKey.slice(2))
          .getPublic()
          .encodeCompressed()
      ).toString("hex");
    }
  }
};
