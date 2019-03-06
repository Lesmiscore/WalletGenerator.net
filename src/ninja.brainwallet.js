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

    var key = document
      .getElementById("brainpassphrase")
      .value.toString()
      .replace(/^\s+|\s+$/g, ""); // trim white space
    document.getElementById("brainpassphrase").value = key;
    var keyConfirm = document
      .getElementById("brainpassphraseconfirm")
      .value.toString()
      .replace(/^\s+|\s+$/g, ""); // trim white space
    document.getElementById("brainpassphraseconfirm").value = keyConfirm;

    if (
      key == keyConfirm ||
      document.getElementById("brainpassphraseshow").checked
    ) {
      // enforce a minimum passphrase length
      if (key.length >= brainwallet.minPassphraseLength) {
        var bytes = bitcoin.crypto.sha256(key);
        var btcKey = ecpair.create(bigi.fromBuffer(bytes), null);
        var bitcoinAddress = privateKey.getAddressWith(btcKey);
        var privWif = privateKey.getWIFWith(btcKey);
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
