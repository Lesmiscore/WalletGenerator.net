const privateKey = require("./ninja.privatekey.js");
const qrCode = require("./ninja.qrcode.js");

const open = function() {
  if (!document.getElementById("btcaddress").innerHTML) {
    generateNewAddressAndKey();
  }
  document.getElementById("walletCommands").style.display = "block";
  document.getElementById("keyarea").style.display = "block";
  document.getElementById("currencyddl").style.display = "block";
  document.getElementById("singlearea").style.display = "block";
  document.getElementById("initBanner").style.display = "none";
};

const close = function() {
  document.getElementById("singlearea").style.display = "none";
};

// generate bitcoin address and private key and update information in the HTML
const generateNewAddressAndKey = function() {
  try {
    const key = privateKey.makeRandom();
    const bitcoinAddress = privateKey.getAddressWith(key, publicMode);
    const privateKeyWif = privateKey.getWIFForAddress(key, publicMode);
    document.getElementById("btcaddress").innerHTML = bitcoinAddress;
    document.getElementById("btcprivwif").innerHTML = privateKeyWif;
    const keyValuePair = {
      qrcode_public: bitcoinAddress,
      qrcode_private: privateKeyWif
    };
    qrCode.showQrCode(keyValuePair, 4);
  } catch (e) {
    // browser does not have sufficient JavaScript support to generate a bitcoin address
    alert(e);
    console.error(e);
    document.getElementById("btcaddress").innerHTML = "error";
    document.getElementById("btcprivwif").innerHTML = "error";
    document.getElementById("qrcode_public").innerHTML = "";
    document.getElementById("qrcode_private").innerHTML = "";
  }
};

let publicMode = 0;

module.exports = { open, close, generateNewAddressAndKey };

Object.defineProperty(module.exports, "publicMode", {
  enumerable: true,
  get: () => publicMode,
  set: pm => (publicMode = pm)
});
