module.exports = (async function () {
  const { QRCodeScanner } = await import("./jsqrcode.js");
  const translator = await import("./ninja.translator.js");
  const privateKey = await import("./ninja.privatekey.js");
  const brainwallet = await import("./ninja.brainwallet.js");
  const qrCode = await import("./ninja.qrcode");
  const janin = await import("./janin.currency.js");
  const bitcoin = await import("bitgo-utxo-lib");
  const bigi = (await import("bigi")).default;

  const qrscanner = {
    scanner: null,

    start: function () {
      document.getElementById("paperqrscanner").className = "show";
      qrscanner.showError(null);
      const supported = qrscanner.scanner.isSupported();
      if (!supported) {
        document.getElementById("paperqrnotsupported").className = "";
      } else {
        qrscanner.scanner.start();
      }
    },

    stop: function () {
      qrscanner.scanner.stop();
      document.getElementById("paperqrscanner").className = "";
    },

    showError: function (error) {
      if (error) {
        if (error === "PERMISSION_DENIED" || error === "PermissionDeniedError") {
          document.getElementById("paperqrerror").innerHTML = "";
          document.getElementById("paperqrpermissiondenied").className = "";
        } else {
          document.getElementById("paperqrerror").innerHTML = error;
          document.getElementById("paperqrpermissiondenied").className = "hide";
        }
      } else {
        document.getElementById("paperqrerror").innerHTML = "";
        document.getElementById("paperqrpermissiondenied").className = "hide";
      }
    },
  };

  const open = function () {
    document.getElementById("detailarea").style.display = "block";
    document.getElementById("detailprivkey").focus();
    if (!qrscanner.scanner) {
      qrscanner.scanner = new QRCodeScanner(
        320,
        240,
        "paperqroutput",
        function (data) {
          document.getElementById("detailprivkey").value = data;
          document.getElementById("paperqrscanner").className = "";
          viewDetails();
        },
        function (error) {
          qrscanner.showError(error);
        }
      );
    }
  };

  const close = function () {
    document.getElementById("detailarea").style.display = "none";
  };

  const openCloseFaq = function (faqNum) {
    // do close
    if (document.getElementById("detaila" + faqNum).style.display === "block") {
      document.getElementById("detaila" + faqNum).style.display = "none";
      document.getElementById("detaile" + faqNum).setAttribute("class", "more");
    }
    // do open
    else {
      document.getElementById("detaila" + faqNum).style.display = "block";
      document.getElementById("detaile" + faqNum).setAttribute("class", "less");
    }
  };

  const viewDetails = function () {
    const key = document
      .getElementById("detailprivkey")
      .value.toString()
      .replace(/^\s+|\s+$/g, ""); // trim white space
    document.getElementById("detailprivkey").value = key;
    const bip38CommandDisplay = document.getElementById("detailbip38commands").style.display;
    clear();
    if (!key) {
      return;
    }
    if (privateKey.isBIP38Format(key)) {
      document.getElementById("detailbip38commands").style.display = bip38CommandDisplay;
      if (bip38CommandDisplay !== "block") {
        document.getElementById("detailbip38commands").style.display = "block";
        document.getElementById("detailprivkeypassphrase").focus();
        return;
      }
      const passphrase = document
        .getElementById("detailprivkeypassphrase")
        .value.toString()
        .replace(/^\s+|\s+$/g, ""); // trim white space
      if (!passphrase) {
        alert(translator.get("bip38alertpassphraserequired"));
        return;
      }
      document.getElementById("busyblock").className = "busy";
      // show Private Key BIP38 Format
      document.getElementById("detailprivbip38").textContent = key;
      document.getElementById("detailbip38").style.display = "block";
      privateKey.BIP38EncryptedKeyToByteArrayAsync(key, passphrase, function (btcKeyOrError) {
        document.getElementById("busyblock").className = "";
        if (btcKeyOrError.message) {
          alert(btcKeyOrError.message);
          clear();
        } else {
          populateKeyDetails(privateKey.create(btcKeyOrError));
        }
      });
    } else {
      let btcKey = privateKey.decodePrivateKey(key);
      if (!btcKey) {
        // enforce a minimum passphrase length
        if (key.length >= brainwallet.minPassphraseLength) {
          // Deterministic Wallet confirm box to ask if user wants to SHA256 the input to get a private key
          const usePassphrase = confirm(translator.get("detailconfirmsha256"));
          if (usePassphrase) {
            const bytes = bitcoin.crypto.sha256(key);
            btcKey = privateKey.create(bigi.fromBuffer(bytes), null);
          } else {
            clear();
          }
        } else {
          alert(translator.get("detailalertnotvalidprivatekey"));
          clear();
        }
      } else {
        populateKeyDetails(btcKey);
      }
    }
  };

  const populateKeyDetails = function (btcKey) {
    if (janin.selectedCurrency.havePrivateKey(btcKey)) {
      const privKeyBuffer = janin.selectedCurrency.getPrivateKeyBuffer(btcKey);
      document.getElementById("detailprivhex").innerHTML = privKeyBuffer.toString("hex").toUpperCase();
      document.getElementById("detailprivb64").innerHTML = privKeyBuffer.toString("base64");

      const privTitles = janin.selectedCurrency.getWIFTitleNames();
      const privQrParams = {};
      for (let i in privTitles) {
        if ({}.hasOwnProperty.call(privTitles, i)) {
          const stripped = privTitles[i].toLowerCase().replace(/[^a-z0-9]/g, "");
          const address = janin.selectedCurrency.getWIFByType(btcKey, +i);
          privQrParams[`detailqrcode${stripped}`] = address;
          document.getElementById(`detailaddress${stripped}`).innerHTML = address;
        }
      }

      qrCode.showQrCode(privQrParams, 4);
    }
    const pubKeyCompressed = janin.selectedCurrency.getPublicKey(btcKey, true);
    const pubKeyUncompressed = janin.selectedCurrency.getPublicKey(btcKey, false);

    document.getElementById("detailpubkey").innerHTML = pubKeyUncompressed.toString("hex").toUpperCase();
    document.getElementById("detailpubkeycomp").innerHTML = pubKeyCompressed.toString("hex").toUpperCase();

    const addrTitles = janin.selectedCurrency.getAddressTitleNames();
    const addrQrParams = {};
    for (let i in addrTitles) {
      if ({}.hasOwnProperty.call(addrTitles, i)) {
        const stripped = addrTitles[i].toLowerCase().replace(/[^a-z0-9]/g, "");
        const address = janin.selectedCurrency.getAddressWith(btcKey, +i);
        addrQrParams[`detailqrcode${stripped}`] = address;
        document.getElementById(`detailaddress${stripped}`).innerHTML = address;
      }
    }

    qrCode.showQrCode(addrQrParams, 4);
  };

  const clear = function () {
    document.getElementById("detailpubkey").innerHTML = "";
    document.getElementById("detailpubkeycomp").innerHTML = "";
    document.getElementById("detailprivhex").innerHTML = "";
    document.getElementById("detailprivb64").innerHTML = "";
    document.getElementById("detailprivb6").innerHTML = "";
    document.getElementById("detailprivmini").innerHTML = "";
    document.getElementById("detailprivbip38").innerHTML = "";
    document.getElementById("detailb6").style.display = "none";
    document.getElementById("detailmini").style.display = "none";
    document.getElementById("detailbip38commands").style.display = "none";
    document.getElementById("detailbip38").style.display = "none";

    const titles = Array.prototype.concat.call(janin.selectedCurrency.getAddressTitleNames(), janin.selectedCurrency.getWIFTitleNames());
    for (let i in titles) {
      if ({}.hasOwnProperty.call(titles, i)) {
        const stripped = titles[i].toLowerCase().replace(/[^a-z0-9]/g, "");
        document.getElementById(`detailqrcode${stripped}`).innerHTML = "";
        document.getElementById(`detailaddress${stripped}`).innerHTML = "";
      }
    }
  };

  return {
    qrscanner,
    open,
    close,
    openCloseFaq,
    viewDetails,
    populateKeyDetails,
    clear,
  };
})();
module.exports.__esModule = true;
