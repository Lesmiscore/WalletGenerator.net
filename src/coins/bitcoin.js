import bitcoin, { crypto, script } from "bitcoinjs-lib";
import { decode } from "wif";
import { fromByteArrayUnsigned, fromHex } from "bigi";
import { curves } from "elliptic";
import { get } from "../ninja.translator.js";
import Coin from "./coin.jsx";

// "([0-9]|\[[0-9]{2}\])", "([a-zA-Z]|\[[a-zA-Z]{2}\])",
export default class Bitcoin extends Coin {
  constructor(name, networkVersion, privateKeyPrefix, donate, scriptHash, b32hrp) {
    super(name, donate);
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
      wif: privateKeyPrefix
    };
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
      decode(key);
      return true;
    } catch (e) {}
    // Hex/Base64
    const testValue = function(buffer) {
      if (buffer.length !== 32) return false;
      const n = fromByteArrayUnsigned(curves.secp256k1.curve.n.toArray());
      const scalar = fromByteArrayUnsigned(buffer);
      return n.compareTo(scalar) > 0;
    };
    if (testValue(Buffer.from(key, "hex"))) return true;
    if (testValue(Buffer.from(key, "base64"))) return true;
    // Mini key
    if (/^S[1-9A-HJ-NP-Za-km-z]{29}$/.test(key)) {
      const sha256 = crypto.sha256(key + "?");
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
          return this.create(fromHex(hex), null, {
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
      const sha256 = crypto.sha256(key).toString("hex");
      return this.create(fromHex(sha256), null, {
        compressed: true
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
          return this.world.ECPair.prototype.getAddress.call(btcKey);
        case 1: // uncompressed
          btcKey.compressed = false;
          return this.world.ECPair.prototype.getAddress.call(btcKey);
        case 2: // segwit
          if (btcKey.network.bech32) {
            const pubKeyCompressed = btcKey.Q.getEncoded(true);
            const redeemScript = this.world.script.witnessPubKeyHash.output.encode(crypto.hash160(pubKeyCompressed));
            return this.world.address.toBech32(script.compile(redeemScript).slice(2, 22), 0, btcKey.network.bech32);
          }
          return this.getAddressWith(btcKey, 0);
        case 3: // segwit (p2sh)
          if (btcKey.network.bech32) {
            const pubKeyCompressed = btcKey.Q.getEncoded(true);
            const redeemScript = this.world.script.witnessPubKeyHash.output.encode(crypto.hash160(pubKeyCompressed));
            const scriptPubKey = crypto.hash160(redeemScript);
            return this.world.address.toBase58Check(scriptPubKey, btcKey.network.scriptHash);
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
          ${get("paperwalletback")}
        </div>
      </div>
    `;
    return walletHtml;
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
}
