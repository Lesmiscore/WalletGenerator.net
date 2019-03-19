const translator = require("./ninja.translator.js");
const privateKey = require("./ninja.privatekey.js");
const qrCode = require("./ninja.qrcode.js");
const bitcoin = require("bitcoinjs-lib");
const bigi = require("bigi");

const brainwallet = (module.exports = {
  open: function() {
    document.getElementById("brainarea").style.display = "block";
    document.getElementById("brainpassphrase").focus();
    document.getElementById("brainwarning").innerHTML = translator.get(
      "brainalertpassphrasewarning"
    );
  },

  close: function() {
    document.getElementById("brainarea").style.display = "none";
  },

  minPassphraseLength: 15,

  view: function() {
    document.getElementById("brainerror").innerHTML = "";

    const key = document
      .getElementById("brainpassphrase")
      .value.toString()
      .replace(/^\s+|\s+$/g, ""); // trim white space
    document.getElementById("brainpassphrase").value = key;
    const keyConfirm = document
      .getElementById("brainpassphraseconfirm")
      .value.toString()
      .replace(/^\s+|\s+$/g, ""); // trim white space
    document.getElementById("brainpassphraseconfirm").value = keyConfirm;

    if (
      key === keyConfirm ||
      document.getElementById("brainpassphraseshow").checked
    ) {
      // enforce a minimum passphrase length
      if (key.length >= brainwallet.minPassphraseLength) {
        const bytes = bitcoin.crypto.sha256(key);
        const btcKey = privateKey.create(bigi.fromBuffer(bytes), null);
        const bitcoinAddress = privateKey.getAddressWith(btcKey);
        const privWif = privateKey.getWIFWith(btcKey);
        document.getElementById("brainbtcaddress").innerHTML = bitcoinAddress;
        document.getElementById("brainbtcprivwif").innerHTML = privWif;
        qrCode.showQrCode({
          brainqrcodepublic: bitcoinAddress,
          brainqrcodeprivate: privWif
        });
        document.getElementById("brainkeyarea").style.visibility = "visible";
      } else {
        document.getElementById("brainerror").innerHTML = translator.get(
          "brainalertpassphrasetooshort"
        );
        brainwallet.clear();
      }
    } else {
      document.getElementById("brainerror").innerHTML = translator.get(
        "brainalertpassphrasedoesnotmatch"
      );
      brainwallet.clear();
    }
  },

  clear: function() {
    document.getElementById("brainkeyarea").style.visibility = "hidden";
  },

  showToggle: function(element) {
    if (element.checked) {
      document.getElementById("brainpassphrase").setAttribute("type", "text");
      document.getElementById("brainpassphraseconfirm").style.visibility =
        "hidden";
      document.getElementById("brainlabelconfirm").style.visibility = "hidden";
    } else {
      document
        .getElementById("brainpassphrase")
        .setAttribute("type", "password");
      document.getElementById("brainpassphraseconfirm").style.visibility =
        "visible";
      document.getElementById("brainlabelconfirm").style.visibility = "visible";
    }
  }
});
