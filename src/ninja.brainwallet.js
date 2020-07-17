import { get as _get } from "./ninja.translator.js";
import { create, getAddressWith, getWIFForAddress } from "./ninja.privatekey.js";
import qrCode from "./ninja.qrcode/index.js";
import { sha256 } from "./hashing.js";
import * as bigi from "bigi";

const open = function () {
  document.getElementById("brainarea").style.display = "block";
  document.getElementById("brainpassphrase").focus();
  document.getElementById("brainwarning").innerHTML = _get("brainalertpassphrasewarning");
};

const close = function () {
  document.getElementById("brainarea").style.display = "none";
};

let publicMode = 0;
const minPassphraseLength = 15;

const view = function () {
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

  if (key === keyConfirm || document.getElementById("brainpassphraseshow").checked) {
    // enforce a minimum passphrase length
    if (key.length >= minPassphraseLength) {
      const bytes = sha256(key);
      const btcKey = create(bigi.fromBuffer(bytes), null);
      const bitcoinAddress = getAddressWith(btcKey, publicMode);
      const privWif = getWIFForAddress(btcKey, publicMode);
      document.getElementById("brainbtcaddress").innerHTML = bitcoinAddress;
      document.getElementById("brainbtcprivwif").innerHTML = privWif;
      qrCode.showQrCode({
        brainqrcodepublic: bitcoinAddress,
        brainqrcodeprivate: privWif,
      });
      document.getElementById("brainkeyarea").style.visibility = "visible";
    } else {
      document.getElementById("brainerror").innerHTML = _get("brainalertpassphrasetooshort");
      clear();
    }
  } else {
    document.getElementById("brainerror").innerHTML = _get("brainalertpassphrasedoesnotmatch");
    clear();
  }
};

const clear = function () {
  document.getElementById("brainkeyarea").style.visibility = "hidden";
};

const showToggle = function (element) {
  if (element.checked) {
    document.getElementById("brainpassphrase").setAttribute("type", "text");
    document.getElementById("brainpassphraseconfirm").style.visibility = "hidden";
    document.getElementById("brainlabelconfirm").style.visibility = "hidden";
  } else {
    document.getElementById("brainpassphrase").setAttribute("type", "password");
    document.getElementById("brainpassphraseconfirm").style.visibility = "visible";
    document.getElementById("brainlabelconfirm").style.visibility = "visible";
  }
};

export default {
  open,
  close,
  view,
  clear,
  showToggle,
};

Object.defineProperty(module.exports, "publicMode", {
  enumerable: true,
  get: () => publicMode,
  set: (pm) => {
    publicMode = pm;
  },
});
