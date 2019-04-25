import { get } from "../ninja.translator.js";
import nem from "nem-sdk";
import randomBytes from "randombytes";
import Coin from "./coin.jsx";

export default class NEM extends Coin {
  constructor(name, donate, network) {
    super(name, donate);
    this.network = network || nem.model.network.data.mainnet.id;
  }

  _create(pk) {
    const privBytes = Buffer.from(pk, "hex");
    const kp = nem.crypto.keyPair.create(pk);
    kp.privateKeyBuffer = privBytes;
    return kp;
  }

  create(d, Q, opts) {
    return this._create(d.toBuffer().toString("hex"));
  }
  makeRandom(opts) {
    return this._create(randomBytes(32).toString("hex"));
  }

  isPrivateKey(key) {
    key = `${key}`.toLowerCase();
    if (key.startsWith("0x")) {
      key = key.slice(2);
    }
    return /^[0-9a-f]{64}$/.test(key);
  }

  decodePrivateKey(key) {
    key = `${key}`.toLowerCase();
    if (key.startsWith("0x")) {
      key = key.slice(2);
    }
    return this._create(key);
  }

  // correspond to getAddressFormatNames, getAddressTitleNames
  getAddressWith(key, mode) {
    switch (mode) {
      default:
        return nem.model.address.toAddress(key.publicKey.toString(), this.network);
    }
  }

  // correspond to getAddressFormatNames, getAddressTitleNames
  getWIFForAddress(key, mode) {
    switch (mode) {
      default:
        return key.privateKeyBuffer.toString("hex");
    }
  }

  // correspond to getWIFTitleNames
  getWIFByType(key, mode) {
    switch (mode) {
      default:
        return key.privateKeyBuffer.toString("hex");
    }
  }

  getAddressFormatNames() {
    return ["Normal"];
  }
  getAddressTitleNames() {
    return ["Public Address"];
  }

  getWIFTitleNames() {
    return ["Private Key"];
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

  getPublicKey(key, compressed) {
    return key.publicKey;
  }
  getPrivateKeyBuffer(key) {
    return Buffer.from(key.privateKeyBuffer);
  }
  havePrivateKey(key) {
    return true;
  }
}

export const mainnet = nem.model.network.data.mainnet.id;
export const testnet = nem.model.network.data.testnet.id;
export const mijin = nem.model.network.data.mijin.id;
