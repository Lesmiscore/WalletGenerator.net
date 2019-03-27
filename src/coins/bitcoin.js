const bitcoin = require("bitcoinjs-lib");
const wif = require("wif");
const bigi = require("bigi");
const elliptic = require("elliptic");
const translator = require("../ninja.translator.js");

// "([0-9]|\[[0-9]{2}\])", "([a-zA-Z]|\[[a-zA-Z]{2}\])",
module.exports = class Bitcoin {
  constructor(name, networkVersion, privateKeyPrefix, donate, scriptHash, b32hrp) {
    this.world = bitcoin;
    this.network = {
      messagePrefix: "\x18Bitcoin Signed Message:\n",
      bech32: b32hrp,
      bip32: {
        public: 0x0488b21e,
        private: 0x0488ade4
      },
      pubKeyHash: networkVersion & 0xffff,
      scriptHash: scriptHash || 0x05,
      wif: privateKeyPrefix,

      name: name,
      donate: donate
    };
    this.name = name;
    this.donate = donate;
  }

  create(d, Q, opts) {
    opts = Object.assign({}, opts || {}, {
      network: this.network
    });
    return new this.world.ECPair(d, Q, opts);
  }
  makeRandom(opts) {
    opts = Object.assign({}, opts || {}, {
      network: this.network
    });
    return this.world.ECPair.makeRandom(opts);
  }

  isPrivateKey(key) {
    try {
      // WIF/CWIF
      wif.decode(key);
      return true;
    } catch (e) {}
    // Hex/Base64
    const testValue = function(buffer) {
      if (buffer.length !== 32) return false;
      const n = bigi.fromByteArrayUnsigned(elliptic.curves.secp256k1.curve.n.toArray());
      const scalar = bigi.fromByteArrayUnsigned(buffer);
      return n.compareTo(scalar) > 0;
    };
    if (testValue(Buffer.from(key, "hex"))) return true;
    if (testValue(Buffer.from(key, "base64"))) return true;
    // Mini key
    if (/^S[1-9A-HJ-NP-Za-km-z]{29}$/.test(key)) {
      const sha256 = bitcoin.crypto.sha256(key + "?");
      if (sha256[0] === 0x00) {
        return true;
      }
    }
    return false;
  }

  decodePrivateKey(key) {
    if (!this.isPrivateKey(key)) {
      return null;
    }
    // WIF/CWIF
    try {
      return this.world.ECPair.fromWIF(key, this.network);
    } catch (error) {}
    // Base64/Hex
    function tryBy(enc) {
      try {
        const hex = Buffer.from(key, enc).toString("hex");
        if (hex.length === 64) {
          return this.create(bigi.fromHex(hex), null, {
            compressed: true
          });
        }
      } catch (error) {}
    }
    const hex = tryBy("hex");
    if (hex) return hex;
    const base64 = tryBy("base64");
    if (base64) return base64;
    if (/^S[1-9A-HJ-NP-Za-km-z]{29}$/.test(key)) {
      const sha256 = bitcoin.crypto.sha256(key).toString("hex");
      return this.create(bigi.fromHex(sha256), null, {
        compressed: true
      });
    }
  }

  // correspond to getAddressFormatNames, getAddressTitleNames
  getAddressWith(btcKey, mode) {
    const compressed = btcKey.compressed;
    try {
      switch (mode || 0) {
        case 0: // compressed
          btcKey.compressed = true;
          // bitcoin
          return this.world.ECPair.prototype.getAddress.call(btcKey);
        case 1: // uncompressed
          btcKey.compressed = false;
          // bitcoin
          return this.world.ECPair.prototype.getAddress.call(btcKey);
        case 2: // segwit
          if (btcKey.network.bech32) {
            const pubKeyCompressed = btcKey.Q.getEncoded(true);
            const redeemScript = this.world.script.witnessPubKeyHash.output.encode(bitcoin.crypto.hash160(pubKeyCompressed));
            return this.world.address.toBech32(bitcoin.script.compile(redeemScript).slice(2, 22), 0, btcKey.network.bech32);
          }
        case 3: // segwit (p2sh)
          if (btcKey.network.bech32) {
            const pubKeyCompressed = btcKey.Q.getEncoded(true);
            const redeemScript = this.world.script.witnessPubKeyHash.output.encode(bitcoin.crypto.hash160(pubKeyCompressed));
            const scriptPubKey = bitcoin.crypto.hash160(redeemScript);
            return this.world.address.toBase58Check(scriptPubKey, btcKey.network.scriptHash);
          }
      }
      return this.getAddressWith(btcKey, 0);
    } finally {
      btcKey.compressed = compressed;
    }
  }

  // correspond to getAddressFormatNames, getAddressTitleNames
  getWIFForAddress(btcKey, mode) {
    const compressed = btcKey.compressed;
    try {
      switch (mode) {
        case 1: // uncompressed
          btcKey.compressed = false;
          break;
        default:
          // other
          btcKey.compressed = true;
          break;
      }
      return btcKey.toWIF();
    } finally {
      btcKey.compressed = compressed;
    }
  }

  // correspond to getWIFTitleNames
  getWIFByType(btcKey, mode) {
    const compressed = btcKey.compressed;
    try {
      switch (mode) {
        case 0: // compressed
          btcKey.compressed = true;
          break;
        case 1: // uncompressed
          btcKey.compressed = false;
          break;
      }
      return btcKey.toWIF();
    } finally {
      btcKey.compressed = compressed;
    }
  }

  getAddressFormatNames() {
    if (this.network.bech32) {
      return [
        "Compressed",
        "Uncompressed",
        "SegWit",
        "SegWit (P2SH-wrapped)"
        // no cashaddress
      ];
    } else {
      return [
        "Compressed",
        "Uncompressed"
        // no segwit
        // no cashaddress
      ];
    }
  }
  getAddressTitleNames() {
    if (this.network.bech32) {
      return [
        "Public Address Compressed",
        "Public Address",
        "SegWit Address",
        "SegWit Address (P2SH-wrapped)"
        // no cashaddress
      ];
    } else {
      return [
        "Public Address Compressed",
        "Public Address"
        // no segwit
        // no cashaddress
      ];
    }
  }

  getWIFTitleNames() {
    return ["Private Key WIF Compressed<br />52 characters Base58", "Private Key WIF<br />51 characters Base58"];
  }

  templateArtisticHtml(i) {
    const keyelement = "btcprivwif";
    const coinImgUrl = "logos/" + this.name.toLowerCase() + ".png";
    const walletBackgroundUrl = "wallets/" + this.name.toLowerCase() + ".png";

    const walletHtml = `
      <div class='coinIcoin'>
        <img id='coinImg' src='${coinImgUrl}' alt='currency_logo' />
      </div>
      <div class='artwallet' id='artwallet${i}'>
        <img id='papersvg${i}' class='papersvg' src='${walletBackgroundUrl}' />
        <div id='qrcode_public${i}' class='qrcode_public'></div>
        <div id='qrcode_private${i}' class='qrcode_private'></div>
        <div class='btcaddress' id='btcaddress${i}'></div>
        <div class='${keyelement}' id='${keyelement}${i}'></div>
        <div class='paperWalletText'>
          <img class='backLogo' src='${coinImgUrl}' alt='currency_logo' />
          ${translator.get("paperwalletback")}
        </div>
      </div>
    `;
    return walletHtml;
  }

  isPublicKeyHexFormat(key) {
    key = key.toString();
    return this.isUncompressedPublicKeyHexFormat(key) || this.isCompressedPublicKeyHexFormat(key);
  }
  // 130 characters [0-9A-F] starts with 04
  isUncompressedPublicKeyHexFormat(key) {
    key = key.toString();
    return /^04[A-Fa-f0-9]{128}$/.test(key);
  }
  // 66 characters [0-9A-F] starts with 02 or 03
  isCompressedPublicKeyHexFormat(key) {
    key = key.toString();
    return /^0[23][A-Fa-f0-9]{64}$/.test(key);
  }

  getPublicKey(btcKey, compressed) {
    return btcKey.Q.getEncoded(compressed);
  }
  getPrivateKeyBuffer(btcKey) {
    return btcKey.d.toBuffer();
  }
  havePrivateKey(btcKey) {
    return !!btcKey.d;
  }
};
