const ethWallet = require("ethereumjs-wallet");
const translator = require("../ninja.translator.js");
const Coin = require("./coin");

module.exports = class Ethereum extends Coin {
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
    return key.getPublicKey();
  }
  getPrivateKeyBuffer(key) {
    return key.getPrivateKey();
  }
  havePrivateKey(key) {
    return !!key.getPrivateKey();
  }
};
