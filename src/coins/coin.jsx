import { get } from "../ninja.translator.js";
import React from "react";
import QRCode from "../misc/qrcode";

export default class Coin {
  constructor(name, donate) {
    this.name = name;
    this.donate = donate;
  }

  templateArtisticHtml(i) {
    const keyelement = "btcprivwif";
    const coinImgUrl = this.getCoinImageUrl();
    const walletBackgroundUrl = this.getWalletBackgroundUrl();
    const self = this;

    return class PaperWallet extends React.Component {
      constructor(props) {
        super(props);
        this.state = { key: props.key, mode: props.mode };
      }
      render() {
        const keyObj = self.decodePrivateKey(this.state.key);
        const bitcoinAddress = self.getAddressWith(keyObj, this.state.mode);
        const privateKeyWif = self.getWIFForAddress(keyObj, this.state.mode);
        return [
          <div class="coinIcon">
            <img id="coinImg" src={coinImgUrl} alt="currency_logo" />
          </div>,
          <div class="artwallet" id={`artwallet${i}`}>
            <img id={`papersvg${i}`} class="papersvg" src={walletBackgroundUrl} />
            <div id={`qrcode_public${i}`} class="qrcode_public">
              <QRCode value={bitcoinAddress} size={3.5} />
            </div>
            <div id={`qrcode_private${i}`} class="qrcode_private">
              <QRCode value={privateKeyWif} size={2.8} />
            </div>
            <div class="btcaddress" id={`btcaddress${i}`}>
              {bitcoinAddress}
            </div>
            <div class={keyelement} id={`${keyelement}${i}`}>
              {privateKeyWif}
            </div>
            <div class="paperWalletText">
              <img class="backLogo" src={coinImgUrl} alt="currency_logo" />
              {get("paperwalletback")}
            </div>
          </div>
        ];
      }
    };
  }

  getWalletBackgroundUrl() {
    return "wallets/" + this.name.toLowerCase() + ".png";
  }
  getCoinImageUrl() {
    return "logos/" + this.name.toLowerCase() + ".png";
  }

  isPrivateKey(key) {
    throw new Error("Not implemented");
  }

  decodePrivateKey(key) {
    throw new Error("Not implemented");
  }

  getAddressWith(key, mode) {
    throw new Error("Not implemented");
  }

  getWIFForAddress(key, mode) {
    throw new Error("Not implemented");
  }
}
