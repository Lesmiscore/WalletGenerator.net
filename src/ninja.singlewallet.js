module.exports = (async function () {
  const privateKey = await import("./ninja.privatekey.js");
  const qrCode = await import("./ninja.qrcode");

  const open = function () {
    if (!document.getElementById("btcaddress").innerHTML) {
      generateNewAddressAndKey();
    }
    document.getElementById("walletCommands").style.display = "block";
    document.getElementById("keyarea").style.display = "block";
    document.getElementById("currencyddl").style.display = "block";
    document.getElementById("singlearea").style.display = "block";
    document.getElementById("singlevanitygenstart").style.display = "inline";
    document.getElementById("singlevanitygenstop").style.display = "none";
  };

  const close = function () {
    document.getElementById("singlearea").style.display = "none";
    stopVanitygen();
  };

  // generate bitcoin address and private key and update information in the HTML
  const generateNewAddressAndKey = function () {
    try {
      const key = privateKey.makeRandom();
      const bitcoinAddress = privateKey.getAddressWith(key, publicMode);
      const privateKeyWif = privateKey.getWIFForAddress(key, publicMode);
      document.getElementById("btcaddress").innerHTML = bitcoinAddress;
      document.getElementById("btcprivwif").innerHTML = privateKeyWif;
      const keyValuePair = {
        qrcode_public: bitcoinAddress,
        qrcode_private: privateKeyWif,
      };
      qrCode.showQrCode(keyValuePair, 4);
      return { address: bitcoinAddress, wif: privateKeyWif };
    } catch (e) {
      // browser does not have sufficient JavaScript support to generate a bitcoin address
      alert(e);
      console.error(e);
      document.getElementById("btcaddress").innerHTML = "error";
      document.getElementById("btcprivwif").innerHTML = "error";
      document.getElementById("qrcode_public").innerHTML = "";
      document.getElementById("qrcode_private").innerHTML = "";
      return { address: null, wif: null };
    }
  };

  let vanityJob = null;

  const startVanitygen = function (pattern) {
    if (typeof vanityJob === "string") {
      return;
    }
    if (!privateKey.isVanitygenPossible(pattern, publicMode)) {
      alert("Invalid or impossible pattern!");
      return;
    }
    document.getElementById("singlevanitygenstart").style.display = "none";
    document.getElementById("singlevanitygenstop").style.display = "inline";
    document.getElementById("singlecommands").style.display = "none";
    document.getElementById("singlevanitygenpattern").readOnly = true;
    vanityJob = pattern;
    const refresh = function () {
      const job = vanityJob;
      if (typeof job !== "string") {
        return;
      }
      const { address } = generateNewAddressAndKey();
      if (privateKey.testVanitygenMatch(job, address, publicMode)) {
        stopVanitygen();
      } else {
        setTimeout(refresh, 0);
      }
    };
    refresh();
  };
  const stopVanitygen = function () {
    if (typeof vanityJob !== "string") {
      return;
    }
    document.getElementById("singlevanitygenstart").style.display = "inline";
    document.getElementById("singlevanitygenstop").style.display = "none";
    document.getElementById("singlecommands").style.display = "block";
    document.getElementById("singlevanitygenpattern").readOnly = false;
    vanityJob = null;
  };

  let publicMode = 0;

  const result = {
    open,
    close,
    generateNewAddressAndKey,
    startVanitygen,
    stopVanitygen,
  };

  Object.defineProperty(result, "publicMode", {
    enumerable: true,
    get: () => publicMode,
    set: (pm) => {
      publicMode = pm;
    },
  });

  return result;
})();
module.exports.__esModule = true;
