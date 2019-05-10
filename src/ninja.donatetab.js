const qrCode = require("./ninja.qrcode.js");
const janin = require("./lazy/janin.currency.js");

const open = function() {
  document.getElementById("donatearea").style.display = "block";
};

const close = function() {
  document.getElementById("donatearea").style.display = "none";
};

const displayQrCode = function(currencyid, e) {
  const keyValuePair = {};
  keyValuePair["donateqrcode"] = janin().currencies[currencyid].donate;
  qrCode.showQrCode(keyValuePair, 4);

  document.getElementById("donateqrcode").style.display = "block";
  document.getElementById("donateqrcode").style.top = e.offsetTop + 15 + "px";
};

module.exports = { open, close, displayQrCode };
