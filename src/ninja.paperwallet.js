const paperwallet = (module.exports = {
  open: function() {
    document.getElementById("main").setAttribute("class", "paper"); // add 'paper' class to main div
    var paperArea = document.getElementById("paperarea");
    paperArea.style.display = "block";

    var pageBreakAt = paperwallet.pageBreakAtArtisticDefault;

    if (document.getElementById("paperkeyarea").innerHTML == "") {
      document.getElementById("paperpassphrase").disabled = true;
      document.getElementById("paperencrypt").checked = false;
      paperwallet.encrypt = false;
      paperwallet.build(document.getElementById("paperpassphrase").value);
    }
  },

  close: function() {
    document.getElementById("paperarea").style.display = "none";
    document.getElementById("main").setAttribute("class", ""); // remove 'paper' class from main div
  },

  remaining: null, // use to keep track of how many addresses are left to process when building the paper wallet
  count: 0,
  batchComplete: null,
  pageBreakAtDefault: 1,
  pageBreakAtArtisticDefault: 1,
  pageBreakAt: null,
  publicMode: 0, // compressed

  build: function(passphrase, numWallets, batchComplete) {
    numWallets = numWallets || 1;
    var pageBreakAt = 1;
    paperwallet.remaining = numWallets;
    paperwallet.count = 0;
    paperwallet.batchComplete = batchComplete;
    paperwallet.pageBreakAt = pageBreakAt;
    document.getElementById("paperkeyarea").innerHTML = "";
    if (paperwallet.encrypt) {
      if (passphrase == "") {
        alert(translator.get("bip38alertpassphraserequired"));
        return;
      }
      document.getElementById("busyblock").className = "busy";
      privateKey.BIP38GenerateIntermediatePointAsync(
        passphrase,
        null,
        null,
        function(intermediate) {
          paperwallet.intermediatePoint = intermediate;
          document.getElementById("busyblock").className = "";
          setTimeout(paperwallet.batch, 0);
        }
      );
    } else {
      setTimeout(paperwallet.batch, 0);
    }
  },

  batch: function() {
    if (paperwallet.remaining > 0) {
      var paperArea = document.getElementById("paperkeyarea");
      paperwallet.count++;
      var i = paperwallet.count;
      var pageBreakAt = paperwallet.pageBreakAt;
      var div = document.createElement("div");
      div.setAttribute("id", "keyarea" + i);

      div.innerHTML = paperwallet.templateArtisticHtml(i);
      div.setAttribute("class", "keyarea art");

      if (paperArea.innerHTML != "") {
        // page break
        if ((i - 1) % pageBreakAt == 0 && i >= pageBreakAt) {
          var pBreak = document.createElement("div");
          pBreak.setAttribute("class", "pagebreak");
          document.getElementById("paperkeyarea").appendChild(pBreak);
          div.style.pageBreakBefore = "always";
        }
      }
      document.getElementById("paperkeyarea").appendChild(div);
      paperwallet.generateNewWallet(i);
      paperwallet.remaining--;
      setTimeout(paperwallet.batch, 0);
    } else {
      setTimeout(paperwallet.batchComplete, 0);
      paperwallet.batchComplete = null;
    }
  },

  // generate bitcoin address, private key, QR Code and update information in the HTML
  // idPostFix: 1, 2, 3, etc.
  generateNewWallet: function(idPostFix) {
    if (paperwallet.encrypt) {
      privateKey.BIP38GenerateECAddressAsync(
        ninja.paperwallet.intermediatePoint,
        false,
        function(address, encryptedKey) {
          paperwallet.showArtisticWallet(idPostFix, address, encryptedKey);
        }
      );
    } else {
      var key = ecpair.makeRandom();
      var bitcoinAddress = privateKey.getAddressWith(
        key,
        paperwallet.publicMode
      );
      var privateKeyWif = privateKey.getWIFWith(key, paperwallet.publicMode);

      paperwallet.showArtisticWallet(idPostFix, bitcoinAddress, privateKeyWif);
    }
  },

  // Verify that a self-entered key is valid, and compute the corresponding
  // public address, render the wallet.
  testAndApplyVanityKey: function() {
    var suppliedKey = document.getElementById("suppliedPrivateKey").value;
    suppliedKey = suppliedKey.trim(); // in case any spaces or whitespace got pasted in
    document.getElementById("suppliedPrivateKey").value = suppliedKey;
    if (!privateKey.isPrivateKey(suppliedKey)) {
      alert(translator.get("detailalertnotvalidprivatekey"));
    } else {
      var parsedKey = privateKey.decodePrivateKey(suppliedKey);
      var computedPublicAddress = privateKey.getAddressWith(
        parsedKey,
        paperwallet.publicMode
      );
      suppliedKey = privateKey.getWIFWith(parsedKey, paperwallet.publicMode);
      if (paperwallet.encrypt) {
        document.getElementById("busyblock").className = "busy";
        privateKey.BIP38PrivateKeyToEncryptedKeyAsync(
          suppliedKey,
          document.getElementById("paperpassphrase").value,
          false,
          function(encodedKey) {
            document.getElementById("busyblock").className = "";
            paperwallet.showArtisticWallet(
              1,
              computedPublicAddress,
              encodedKey
            );
          }
        );
      } else {
        paperwallet.showArtisticWallet(1, computedPublicAddress, suppliedKey);
      }
    }
  },

  templateArtisticHtml: function(i) {
    var keyelement = "btcprivwif";
    var coinImgUrl =
      "logos/" + janin.selectedCurrency.name.toLowerCase() + ".png";
    var walletBackgroundUrl =
      "" + janin.selectedCurrency.name.toLowerCase() + ".png";

    var walletHtml =
      "<div class='coinIcoin'> <img id='coinImg' src='" +
      coinImgUrl +
      "' alt='currency_logo' /></div><div class='artwallet' id='artwallet" +
      i +
      "'>" +
      "<img id='papersvg" +
      i +
      "' class='papersvg' src='" +
      walletBackgroundUrl +
      "' />" +
      "<div id='qrcode_public" +
      i +
      "' class='qrcode_public'></div>" +
      "<div id='qrcode_private" +
      i +
      "' class='qrcode_private'></div>" +
      "<div class='btcaddress' id='btcaddress" +
      i +
      "'></div>" +
      "<div class='" +
      keyelement +
      "' id='" +
      keyelement +
      i +
      "'></div>" +
      "<div class='paperWalletText'><img class='backLogo' src='" +
      coinImgUrl +
      "' alt='currency_logo' />" +
      translator.get("paperwalletback") +
      "</div>" +
      "</div>";
    return walletHtml;
  },

  showArtisticWallet: function(idPostFix, bitcoinAddress, privateKey) {
    var keyValuePair = {};
    keyValuePair["qrcode_public" + idPostFix] = bitcoinAddress;
    qrCode.showQrCode(keyValuePair, 3.5);

    var keyValuePair = {};
    keyValuePair["qrcode_private" + idPostFix] = privateKey;
    qrCode.showQrCode(keyValuePair, 2.8);

    document.getElementById(
      "btcaddress" + idPostFix
    ).innerHTML = bitcoinAddress;
    document.getElementById("btcprivwif" + idPostFix).innerHTML = privateKey;
  },

  toggleEncrypt: function(element) {
    // enable/disable passphrase textbox
    document.getElementById("paperpassphrase").disabled = !element.checked;
    paperwallet.encrypt = element.checked;
    paperwallet.resetLimits();
  },

  resetLimits: function() {
    var paperEncrypt = document.getElementById("paperencrypt");

    document.getElementById("paperkeyarea").style.fontSize = "100%";
    if (paperEncrypt.checked) {
      // reduce font size
      document.getElementById("paperkeyarea").style.fontSize = "95%";
    }
  }
});
