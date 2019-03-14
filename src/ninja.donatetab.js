const qrCode = require("./qrcode.js");
const janin = require("./janin.currency.js");

const donate = (module.exports = {
  open: function() {
    document.getElementById("donatearea").style.display = "block";
  },

  close: function() {
    document.getElementById("donatearea").style.display = "none";
  },

  displayQrCode: function(currencyid, e) {
    const keyValuePair = {};
    keyValuePair["donateqrcode"] = janin.currencies[currencyid].donate;
    qrCode.showQrCode(keyValuePair, 4);

    document.getElementById("donateqrcode").style.display = "block";
    document.getElementById("donateqrcode").style.top = e.offsetTop + 15 + "px";
  }
});
