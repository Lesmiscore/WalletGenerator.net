import * as bigi from "bigi";
import * as Coin from "./coin.js";
import * as constants from "./constants.js";
const bitcoin = await import("bitgo-utxo-lib");
const wif = await import("wif");
const elliptic = await import("elliptic");

// "([0-9]|\[[0-9]{2}\])", "([a-zA-Z]|\[[a-zA-Z]{2}\])",
export class Bitcoin extends Coin {
  constructor(name, networkVersion, privateKeyPrefix, donate, scriptHash, b32hrp, coin = bitcoin.coins.BTC) {
    super(name, donate);
    this.network = {
      messagePrefix: "\x18Bitcoin Signed Message:\n",
      bech32: b32hrp,
      bip32: {
        public: 0x0488b21e,
        private: 0x0488ade4,
      },
      pubKeyHash: networkVersion & 0xffff,
      scriptHash: scriptHash || 0x05,
      wif: privateKeyPrefix,
      coin,
    };
  }

  create(d, Q, opts) {
    opts = Object.assign({}, opts || {}, {
      network: this.network,
    });
    return new bitcoin.ECPair(d, Q, opts);
  }
  makeRandom(opts) {
    opts = Object.assign({}, opts || {}, {
      network: this.network,
    });
    return bitcoin.ECPair.makeRandom(opts);
  }

  isPrivateKey(key) {
    try {
      // WIF/CWIF
      wif.decode(key);
      return true;
    } catch (e) {}
    // Hex/Base64
    const testValue = function (buffer) {
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
      return bitcoin.ECPair.fromWIF(key, this.network);
    } catch (error) {}
    // Base64/Hex
    function tryBy(enc) {
      try {
        const hex = Buffer.from(key, enc).toString("hex");
        if (hex.length === 64) {
          return this.create(bigi.fromHex(hex), null, {
            compressed: true,
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
        compressed: true,
      });
    }
  }

  // correspond to getAddressFormatNames, getAddressTitleNames
  getAddressWith(btcKey, mode) {
    const compressed = btcKey.compressed;
    try {
      switch (mode || 0) {
        default:
        case 0: // compressed
          btcKey.compressed = true;
          return bitcoin.ECPair.prototype.getAddress.call(btcKey);
        case 1: // uncompressed
          btcKey.compressed = false;
          return bitcoin.ECPair.prototype.getAddress.call(btcKey);
        case 2: // segwit
          if (btcKey.network.bech32) {
            const pubKeyCompressed = btcKey.Q.getEncoded(true);
            const redeemScript = bitcoin.script.witnessPubKeyHash.output.encode(bitcoin.crypto.hash160(pubKeyCompressed));
            return bitcoin.address.toBech32(bitcoin.script.compile(redeemScript).slice(2, 22), 0, btcKey.network.bech32);
          }
          return this.getAddressWith(btcKey, 0);
        case 3: // segwit (p2sh)
          if (btcKey.network.bech32) {
            const pubKeyCompressed = btcKey.Q.getEncoded(true);
            const redeemScript = bitcoin.script.witnessPubKeyHash.output.encode(bitcoin.crypto.hash160(pubKeyCompressed));
            const scriptPubKey = bitcoin.crypto.hash160(redeemScript);
            return bitcoin.address.toBase58Check(scriptPubKey, btcKey.network.scriptHash);
          }
          return this.getAddressWith(btcKey, 0);
      }
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
        "SegWit (P2SH-wrapped)",
        // no cashaddress
      ];
    } else {
      return [
        "Compressed",
        "Uncompressed",
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
        "SegWit Address (P2SH-wrapped)",
        // no cashaddress
      ];
    } else {
      return [
        "Public Address Compressed",
        "Public Address",
        // no segwit
        // no cashaddress
      ];
    }
  }

  getWIFTitleNames() {
    return ["Private Key WIF Compressed<br />52 characters Base58", "Private Key WIF<br />51 characters Base58"];
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

  isVanitygenPossible(pattern, mode) {
    if (!pattern) return true;
    const btcB58 = "[123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]{0,34}$";
    function testBase58(version) {
      const headRegex = constants.bitcoinB58Leading[version];
      const regex = new RegExp(`^${headRegex}${btcB58}`);
      return regex.test(pattern);
    }
    const self = this;
    function testBech32() {
      const regex = new RegExp(`^${self.network.bech32}(1(q([abcdefghijklmnopqrstuvwxyz234567]{0,38})?)?)?$`);
      return regex.test(pattern);
    }
    switch (mode || 0) {
      default:
      case 0: // compressed
      case 1: // uncompressed
        return testBase58(this.network.pubKeyHash);
      case 2: // segwit
        if (this.network.bech32) {
          pattern = pattern.toLowerCase();
          return testBech32();
        }
        return false;
      case 3: // segwit (p2sh)
        if (this.network.bech32) {
          return testBase58(this.network.scriptHash);
        }
        return false;
    }
  }
};
