const { QRCodeScanner } = require("./jsqrcode.js");
const translator = require("./translator.js");
const ecpair = require("./ecpair.js");
const privateKey = require("./privatekey.js");
const brainwallet = require("./brainwallet.js");
const qrCode = require("./qrcode.js");
const janin = require("./janin.currency.js");
const bitcoin = require("bitcoinjs-lib");
const bigi = require("bigi");

const detailwallet = (module.exports = {
  qrscanner: {
    scanner: null,

    start: function() {
      document.getElementById("paperqrscanner").className = "show";
      detailwallet.qrscanner.showError(null);
      const supported = detailwallet.qrscanner.scanner.isSupported();
      if (!supported) {
        document.getElementById("paperqrnotsupported").className = "";
      } else {
        detailwallet.qrscanner.scanner.start();
      }
    },

    stop: function() {
      detailwallet.qrscanner.scanner.stop();
      document.getElementById("paperqrscanner").className = "";
    },

    showError: function(error) {
      if (error) {
        if (
          error === "PERMISSION_DENIED" ||
          error === "PermissionDeniedError"
        ) {
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
    }
  },

  open: function() {
    document.getElementById("detailarea").style.display = "block";
    document.getElementById("detailprivkey").focus();
    if (!detailwallet.qrscanner.scanner) {
      detailwallet.qrscanner.scanner = new QRCodeScanner(
        320,
        240,
        "paperqroutput",
        function(data) {
          document.getElementById("detailprivkey").value = data;
          document.getElementById("paperqrscanner").className = "";
          detailwallet.viewDetails();
        },
        function(error) {
          detailwallet.qrscanner.showError(error);
        }
      );
    }
  },

  close: function() {
    document.getElementById("detailarea").style.display = "none";
  },

  openCloseFaq: function(faqNum) {
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
  },

  viewDetails: function() {
    const bip38 = false;
    const key = document
      .getElementById("detailprivkey")
      .value.toString()
      .replace(/^\s+|\s+$/g, ""); // trim white space
    document.getElementById("detailprivkey").value = key;
    const bip38CommandDisplay = document.getElementById("detailbip38commands")
      .style.display;
    detailwallet.clear();
    if (key === "") {
      return;
    }
    if (privateKey.isBIP38Format(key)) {
      document.getElementById(
        "detailbip38commands"
      ).style.display = bip38CommandDisplay;
      if (bip38CommandDisplay !== "block") {
        document.getElementById("detailbip38commands").style.display = "block";
        document.getElementById("detailprivkeypassphrase").focus();
        return;
      }
      const passphrase = document
        .getElementById("detailprivkeypassphrase")
        .value.toString()
        .replace(/^\s+|\s+$/g, ""); // trim white space
      if (passphrase === "") {
        alert(translator.get("bip38alertpassphraserequired"));
        return;
      }
      document.getElementById("busyblock").className = "busy";
      // show Private Key BIP38 Format
      document.getElementById("detailprivbip38").innerHTML = key;
      document.getElementById("detailbip38").style.display = "block";
      privateKey.BIP38EncryptedKeyToByteArrayAsync(key, passphrase, function(
        btcKeyOrError
      ) {
        document.getElementById("busyblock").className = "";
        if (btcKeyOrError.message) {
          alert(btcKeyOrError.message);
          detailwallet.clear();
        } else {
          detailwallet.populateKeyDetails(ecpair.create(btcKeyOrError));
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
            btcKey = ecpair.create(bigi.fromBuffer(bytes), null);
          } else {
            detailwallet.clear();
          }
        } else {
          alert(translator.get("detailalertnotvalidprivatekey"));
          detailwallet.clear();
        }
      } else {
        detailwallet.populateKeyDetails(btcKey);
      }
    }
  },

  populateKeyDetails: function(btcKey) {
    if (btcKey.d) {
      document.getElementById("detailprivhex").innerHTML = btcKey.d
        .toBuffer()
        .toString("hex")
        .toUpperCase();
      document.getElementById(
        "detailprivb64"
      ).innerHTML = btcKey.d.toBuffer().toString("base64");
      const wif = privateKey.getWIFWith(btcKey, 1);
      const wifComp = privateKey.getWIFWith(btcKey, 0);
      document.getElementById("detailprivwif").innerHTML = wif;
      document.getElementById("detailprivwifcomp").innerHTML = wifComp;
      qrCode.showQrCode(
        {
          detailqrcodeprivate: wif,
          detailqrcodeprivatecomp: wifComp
        },
        4
      );
    }
    const bitcoinAddress = privateKey.getAddressWith(btcKey, 1);
    const bitcoinAddressComp = privateKey.getAddressWith(btcKey, 0);
    const pubKeyCompressed = btcKey.Q.getEncoded(true);

    document.getElementById("detailpubkey").innerHTML = btcKey.Q.getEncoded(
      false
    )
      .toString("hex")
      .toUpperCase();
    document.getElementById("detailaddress").innerHTML = bitcoinAddress;
    document.getElementById(
      "detailpubkeycomp"
    ).innerHTML = pubKeyCompressed.toString("hex").toUpperCase();
    document.getElementById("detailaddresscomp").innerHTML = bitcoinAddressComp;

    if (janin.selectedCurrency.bech32) {
      const bitcoinAddressSegWit = privateKey.getAddressWith(btcKey, 2);
      const bitcoinAddressSegWitP2SH = privateKey.getAddressWith(btcKey, 3);
      document.getElementById(
        "detailaddresssegwit"
      ).innerHTML = bitcoinAddressSegWit;
      document.getElementById(
        "detailaddresssegwitp2sh"
      ).innerHTML = bitcoinAddressSegWitP2SH;
      qrCode.showQrCode(
        {
          detailqrcodesegwit: bitcoinAddressSegWit,
          detailqrcodesegwitp2sh: bitcoinAddressSegWitP2SH
        },
        4
      );
    }

    if (janin.selectedCurrency.bch) {
      const bitcoinAddressBch = privateKey.getAddressWith(btcKey, 5);
      const bitcoinAddressBchComp = privateKey.getAddressWith(btcKey, 4);
      document.getElementById("detailaddressbch").innerHTML = bitcoinAddressBch;
      document.getElementById(
        "detailaddressbchcomp"
      ).innerHTML = bitcoinAddressBchComp;
      qrCode.showQrCode(
        {
          detailqrcodebch: bitcoinAddressBch,
          detailqrcodebchcomp: bitcoinAddressBchComp
        },
        4
      );
    }

    qrCode.showQrCode(
      {
        detailqrcodepublic: bitcoinAddress,
        detailqrcodepubliccomp: bitcoinAddressComp
      },
      4
    );
  },

  clear: function() {
    document.getElementById("detailpubkey").innerHTML = "";
    document.getElementById("detailpubkeycomp").innerHTML = "";
    document.getElementById("detailaddress").innerHTML = "";
    document.getElementById("detailaddresscomp").innerHTML = "";
    document.getElementById("detailaddresssegwit").innerHTML = "";
    document.getElementById("detailaddresssegwitp2sh").innerHTML = "";
    document.getElementById("detailprivwif").innerHTML = "";
    document.getElementById("detailprivwifcomp").innerHTML = "";
    document.getElementById("detailprivhex").innerHTML = "";
    document.getElementById("detailprivb64").innerHTML = "";
    document.getElementById("detailprivb6").innerHTML = "";
    document.getElementById("detailprivmini").innerHTML = "";
    document.getElementById("detailprivbip38").innerHTML = "";
    document.getElementById("detailqrcodepublic").innerHTML = "";
    document.getElementById("detailqrcodepubliccomp").innerHTML = "";
    document.getElementById("detailqrcodeprivate").innerHTML = "";
    document.getElementById("detailqrcodeprivatecomp").innerHTML = "";
    document.getElementById("detailqrcodesegwit").innerHTML = "";
    document.getElementById("detailqrcodesegwitp2sh").innerHTML = "";
    document.getElementById("detailb6").style.display = "none";
    document.getElementById("detailmini").style.display = "none";
    document.getElementById("detailbip38commands").style.display = "none";
    document.getElementById("detailbip38").style.display = "none";
  }
});
