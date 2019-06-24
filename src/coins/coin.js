const translator = require("../ninja.translator.js");
const coindex = (() => {
  try {
    return require("../autogen/coindex");
  } catch (error) {
    return null;
  }
})();

module.exports = class Coin {
  constructor(name, donate) {
    this.name = name;
    this.donate = donate;
  }

  templateArtisticHtml(i) {
    const keyelement = "btcprivwif";
    const coinImgUrl = this.getCoinImageUrl();
    const walletBackgroundUrl = this.getWalletBackgroundUrl();

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

  getWalletBackgroundUrl() {
    return coindex["wallets/" + this.name.toLowerCase()]();
  }
  getCoinImageUrl() {
    return coindex["logos/" + this.name.toLowerCase()]();
  }

  isVanitygenPossible(pattern, mode) {
    return false;
  }
  testVanitygenMatch(pattern, address, mode) {
    return false;
  }
};
