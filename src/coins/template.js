// DO NOT EDIT
const translator = require("../ninja.translator.js");

module.exports = class Bitcoin {
  constructor(name) {
    this.name = name;
  }

  create(d, Q, opts) {}
  makeRandom(opts) {}

  isPrivateKey(key) {}

  decodePrivateKey(key) {}

  // correspond to getAddressFormatNames, getAddressTitleNames
  getAddressWith(key, mode) {}

  // correspond to getAddressFormatNames, getAddressTitleNames
  getWIFForAddress(key, mode) {}

  // correspond to getWIFTitleNames
  getWIFByType(key, mode) {}

  getAddressFormatNames() {
    return [];
  }
  getAddressTitleNames() {
    return [];
  }

  getWIFTitleNames() {
    return [];
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

  getPublicKey(key, compressed) {}
  getPrivateKeyBuffer(key) {}
  havePrivateKey(key) {}
};
