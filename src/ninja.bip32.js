const translator = require("./ninja.translator.js");
const privateKey = require("./ninja.privatekey.js");
const bitcoin = require("bitcoinjs-lib");
const bip32 = require("bip32");
const bip39 = require("bip39");
const bigi = require("bigi");
const janin = require("./janin.currency.js");

const open = function() {
  document.getElementById("bip32area").style.display = "block";
  if (janin.selectedCurrency.supportsBIP32()) {
    // supported
    document.getElementById("bip32data").focus();
    document.getElementById("bip32commands").style.display = "block";
    document.getElementById("bip32commandsunsup").style.display = "none";
  } else {
    // unsupported
    document.getElementById("bip32commands").style.display = "none";
    document.getElementById("bip32commandsunsup").style.display = "block";
  }
};

const close = function() {
  document.getElementById("bip32area").style.display = "none";
};

const view = function() {
  const data = document.getElementById("bip32data").innerHTML;
  const password = document.getElementById("bip32password").innerHTML;
  const path = document.getElementById("bip32path").innerHTML;
  let node;
  try {
    // bip39 mnemonic
    node = bip32.fromSeed(bip39.mnemonicToSeedSync(data, password));
  } catch (e) {
    // xpub or xpriv
    node = bip32.fromBase58(data);
  }
};

module.exports = {
  open,
  close,
  view
};
