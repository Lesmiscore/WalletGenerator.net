const bitcoin = require("bitcoinjs-lib");
const wif = require("wif");
const bigi = require("bigi");
const elliptic = require("elliptic");

module.exports = class Bitcoin {
  constructor(
    name,
    networkVersion,
    privateKeyPrefix,
    WIF_Start,
    CWIF_Start,
    donate,
    scriptHash,
    b32hrp
  ) {
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
      WIF_Start: WIF_Start,
      CWIF_Start: CWIF_Start,
      donate: donate
    };
  }

  name() {
    return this.network.name;
  }

  networkVersion() {
    return this.network.pubKeyHash;
  }

  privateKeyPrefix() {
    return this.network.wif;
  }

  WIF_RegEx() {
    return new RegExp(
      "^" +
        this.network.WIF_Start +
        "[123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]{50}$"
    );
  }

  CWIF_RegEx() {
    return new RegExp(
      "^" +
        this.network.CWIF_Start +
        "[123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]{51}$"
    );
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
      const n = bigi.fromByteArrayUnsigned(
        elliptic.curves.secp256k1.curve.n.toArray()
      );
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
            const redeemScript = this.world.script.witnessPubKeyHash.output.encode(
              bitcoin.crypto.hash160(pubKeyCompressed)
            );
            return this.world.address.toBech32(
              bitcoin.script.compile(redeemScript).slice(2, 22),
              0,
              btcKey.network.bech32
            );
          }
        case 3: // segwit (p2sh)
          if (btcKey.network.bech32) {
            const pubKeyCompressed = btcKey.Q.getEncoded(true);
            const redeemScript = this.world.script.witnessPubKeyHash.output.encode(
              bitcoin.crypto.hash160(pubKeyCompressed)
            );
            const scriptPubKey = bitcoin.crypto.hash160(redeemScript);
            return this.world.address.toBase58Check(
              scriptPubKey,
              btcKey.network.scriptHash
            );
          }
      }
      return this.getAddressWith(btcKey, 0);
    } finally {
      btcKey.compressed = compressed;
    }
  }
  getWIFWith(btcKey, mode) {
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
};
