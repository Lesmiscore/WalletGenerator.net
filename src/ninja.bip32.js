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
  const data = document.getElementById("bip32data").value.trim();
  const password = document.getElementById("bip32password").value.trim();
  const path = document.getElementById("bip32path").value.trim();
  if (!data) {
    err("Key area is blank");
    clear();
    return;
  }
  if (!path) {
    err("Specify path");
    clear();
    return;
  }
  try {
    let node;
    try {
      // xpub or xpriv
      node = bip32.fromBase58(data);
    } catch (e_) {
      // bip39 mnemonic
      node = bip32.fromSeed(bip39.mnemonicToSeedSync(data, password));
    }
    // sanitize path to derive w/ it
    // input exmaple: m/7'///9H/8h/10/11/
    const sanitizedPath = path
      // convert H-notation to dash-notation in the middle
      // m/7'///9'/8'/10/11/
      .replace(/[Hh]\//g, "'/")
      // same too for the last
      // m/7'///9'/8'/10/11/ (unchanged in this example)
      .replace(/[Hh]$/g, "'")
      // strip leading m/
      // 7'///9'/8'/10/11/
      .replace(/^m\//g, "")
      // strip trailing slashes
      // 7'///9'/8'/10/11
      .replace(/\/+$/g, "")
      // remove duplicated slashes
      // 7'/9'/8'/10/11
      .replace(/\/+/g, "/");
    // pass it
    const derived = node.derivePath(sanitizedPath);

    document.getElementById("bip32display").style.visibility = "block";
    noerr();
  } catch (e) {
    err(e);
    clear();
  }
};

const switchLang = function(str) {
  if (str instanceof Element) {
    // language links
    str = str.getAttribute("title");
  }
  // clean up
  str = str
    .toLowerCase()
    .replace(/[^a-z]+/g, "_")
    .replace(/_+$/, "");
  bip39.setDefaultWordlist(str);
};

const clear = function() {
  document.getElementById("bip32display").style.visibility = "none";
};

const err = function(e) {
  document.getElementById("bip32error").style.visibility = "block";
  document.getElementById("bip32error").innerHTML = e;
};

const noerr = function() {
  document.getElementById("bip32error").style.visibility = "none";
};

module.exports = {
  open,
  close,
  view,
  switchLang,
  clear
};
