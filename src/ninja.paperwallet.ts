const janin = require("./janin.currency.js");
const privateKey = require("./ninja.privatekey.js");
const translator = require("./ninja.translator.js");
const qrCode = require("./ninja.qrcode");

const open = function () {
  document.getElementById("main").setAttribute("class", "paper"); // add 'paper' class to main div
  const paperArea = document.getElementById("paperarea");
  paperArea.style.display = "block";

  pageBreakAt = pageBreakAtArtisticDefault;

  if (!document.getElementById("paperkeyarea").innerHTML) {
    document.getElementById("paperpassphrase").disabled = true;
    document.getElementById("paperencrypt").checked = false;
    encrypt = false;
    build(document.getElementById("paperpassphrase").value);
  }
};

const close = function () {
  document.getElementById("paperarea").style.display = "none";
  document.getElementById("main").setAttribute("class", ""); // remove 'paper' class from main div
};

let remaining = null; // use to keep track of how many addresses are left to process when building the paper wallet
let count = 0;
let batchComplete = null;
let pageBreakAtDefault = 1;
let pageBreakAtArtisticDefault = 1;
let pageBreakAt = null;
let publicMode = 0; // compressed
let encrypt = false;
let intermediatePoint = null;

const build = function (passphrase, numWallets, _batchComplete) {
  numWallets = numWallets || 1;
  pageBreakAt = 1;
  remaining = numWallets;
  batchComplete = _batchComplete;
  count = 0;
  document.getElementById("paperkeyarea").innerHTML = "";
  if (encrypt) {
    if (!passphrase) {
      alert(translator.get("bip38alertpassphraserequired"));
      return;
    }
    document.getElementById("busyblock").className = "busy";
    privateKey.BIP38GenerateIntermediatePointAsync(passphrase, null, null, function (intermediate) {
      intermediatePoint = intermediate;
      document.getElementById("busyblock").className = "";
      setTimeout(batch, 0);
    });
  } else {
    setTimeout(batch, 0);
  }
};

const batch = function () {
  if (remaining > 0) {
    const paperArea = document.getElementById("paperkeyarea");
    count++;
    const i = count;
    const div = document.createElement("div");
    div.setAttribute("id", "keyarea" + i);

    div.innerHTML = templateArtisticHtml(i);
    div.setAttribute("class", "keyarea art");

    if (paperArea.innerHTML) {
      // page break
      if ((i - 1) % pageBreakAt === 0 && i >= pageBreakAt) {
        const pBreak = document.createElement("div");
        pBreak.setAttribute("class", "pagebreak");
        document.getElementById("paperkeyarea").appendChild(pBreak);
        div.style.pageBreakBefore = "always";
      }
    }
    document.getElementById("paperkeyarea").appendChild(div);
    generateNewWallet(i);
    remaining--;
    setTimeout(batch, 0);
  } else {
    setTimeout(batchComplete, 0);
    batchComplete = null;
  }
};

// generate bitcoin address, private key, QR Code and update information in the HTML
// idPostFix: 1, 2, 3, etc.
const generateNewWallet = function (idPostFix) {
  if (encrypt) {
    privateKey.BIP38GenerateECAddressAsync(intermediatePoint, false, function (address, encryptedKey) {
      showArtisticWallet(idPostFix, address, encryptedKey);
    });
  } else {
    const key = privateKey.makeRandom();
    const bitcoinAddress = privateKey.getAddressWith(key, publicMode);
    const privateKeyWif = privateKey.getWIFForAddress(key, publicMode);

    showArtisticWallet(idPostFix, bitcoinAddress, privateKeyWif);
  }
};

// Verify that a self-entered key is valid, and compute the corresponding
// public address, render the wallet.
const testAndApplyVanityKey = function () {
  let suppliedKey = document.getElementById("suppliedPrivateKey").value;
  suppliedKey = suppliedKey.trim(); // in case any spaces or whitespace got pasted in
  document.getElementById("suppliedPrivateKey").value = suppliedKey;
  if (!privateKey.isPrivateKey(suppliedKey)) {
    alert(translator.get("detailalertnotvalidprivatekey"));
  } else {
    const parsedKey = privateKey.decodePrivateKey(suppliedKey);
    const computedPublicAddress = privateKey.getAddressWith(parsedKey, publicMode);
    suppliedKey = privateKey.getWIFForAddress(parsedKey, publicMode);
    if (encrypt) {
      document.getElementById("busyblock").className = "busy";
      privateKey.BIP38PrivateKeyToEncryptedKeyAsync(suppliedKey, document.getElementById("paperpassphrase").value, false, function (encodedKey) {
        document.getElementById("busyblock").className = "";
        showArtisticWallet(1, computedPublicAddress, encodedKey);
      });
    } else {
      showArtisticWallet(1, computedPublicAddress, suppliedKey);
    }
  }
};

const templateArtisticHtml = function (i) {
  return janin.selectedCurrency.templateArtisticHtml(i, publicMode);
};

const showArtisticWallet = function (idPostFix, bitcoinAddress, privKey) {
  const keyValuePair = {};
  keyValuePair["qrcode_public" + idPostFix] = bitcoinAddress;
  keyValuePair["qrcode_private" + idPostFix] = privKey;
  qrCode.showQrCode(keyValuePair, qrCode.sizeMultiplier.proportional(41, 2.8));

  document.getElementById("btcaddress" + idPostFix).innerHTML = bitcoinAddress;
  document.getElementById("btcprivwif" + idPostFix).innerHTML = privKey;
};

const toggleEncrypt = function (element) {
  // enable/disable passphrase textbox
  document.getElementById("paperpassphrase").disabled = !element.checked;
  encrypt = element.checked;
  resetLimits();
};

const resetLimits = function () {
  const paperEncrypt = document.getElementById("paperencrypt");

  document.getElementById("paperkeyarea").style.fontSize = "100%";
  if (paperEncrypt.checked) {
    // reduce font size
    document.getElementById("paperkeyarea").style.fontSize = "95%";
  }
};

module.exports = {
  open,
  close,
  build,
  batch,
  generateNewWallet,
  testAndApplyVanityKey,
  templateArtisticHtml,
  showArtisticWallet,
  toggleEncrypt,
  resetLimits,
};

Object.defineProperty(module.exports, "publicMode", {
  enumerable: true,
  get: () => publicMode,
  set: (pm) => {
    publicMode = pm;
  },
});
