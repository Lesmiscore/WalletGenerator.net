import React from "react";
import bitcoin from "bitcoinjs-lib";
import { currencies } from "../janin.currency";
import QRCode from "../misc/qrcode.jsx";
import bigi from "bigi";
import { get } from "../ninja.translator";

export default class BrainWallet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      brainPassphrase: "",
      brainPassphraseConfirm: "",
      showCheck: false,
      error: "",
      warn: "",
      address: "",
      wif: ""
    };
    this.onBrainPassphraseChange = this.onBrainPassphraseChange.bind(this);
    this.onBrainPassphraseConfirmChange = this.onBrainPassphraseConfirmChange.bind(this);
    this.onShowChange = this.onShowChange.bind(this);
  }

  getCoin() {
    return currencies[this.props.coin];
  }

  onBrainPassphraseChange(event) {
    this.setState({ brainPassphrase: event.target.value });
  }
  onBrainPassphraseConfirmChange(event) {
    this.setState({ brainPassphraseConfirm: event.target.value });
  }
  onShowChange(event) {
    this.setState({ showCheck: event.target.checked });
  }
  view() {
    const coin = this.getCoin();
    const minPassphraseLength = 15;

    const key = this.state.brainPassphrase.replace(/^\s+|\s+$/g, ""); // trim white space
    const keyConfirm = this.state.brainPassphraseConfirm.replace(/^\s+|\s+$/g, ""); // trim white space
    this.setState({ brainPassphrase: key, brainPassphraseConfirm: keyConfirm, error: "" });

    if (key === keyConfirm || this.state.showCheck) {
      // enforce a minimum passphrase length
      if (key.length >= minPassphraseLength) {
        const bytes = bitcoin.crypto.sha256(key);
        const btcKey = coin.create(bigi.fromBuffer(bytes), null);
        const bitcoinAddress = coin.getAddressWith(btcKey);
        const privWif = coin.getWIFForAddress(btcKey);
        this.setState({ address: bitcoinAddress, wif: privWif });
      } else {
        this.setState({ error: get("brainalertpassphrasetooshort") });
        this.clear();
      }
    } else {
      this.setState({ error: get("brainalertpassphrasedoesnotmatch") });
      this.clear();
    }
  }
  clear() {
    this.setState({ address: "", wif: "" });
  }

  render() {
    return (
      <div id="brainarea" class="walletarea">
        <div id="braincommands" class="commands">
          <div class="row">
            <span id="brainlabelenterpassphrase" class="label">
              <label id="brainlabelenterpassphraselbl" class="i18n" for="brainpassphrase">
                Enter Passphrase:{" "}
              </label>
            </span>
            <input tabindex="1" type={this.state.show ? "text" : "password"} id="brainpassphrase" value={this.state.brainPassphrase} onChange={this.onBrainPassphraseChange} />
            <span>
              <label id="brainlabelshow" for="brainpassphraseshow">
                Show?
              </label>{" "}
              <input type="checkbox" id="brainpassphraseshow" value={this.state.showCheck} onChange={this.onShowChange} />
            </span>
            <span class="print">
              <input type="button" name="print" id="brainprint" value="Print" onClick={window.print} />
            </span>
          </div>
          <div class="row extra">
            {this.state.show && (
              <span class="label" id="brainlabelconfirm">
                <label id="brainlabelconfirmlbl" class="i18n" for="brainpassphraseconfirm">
                  Confirm Passphrase:{" "}
                </label>
              </span>
            )}
            {this.state.show && <input tabindex="2" type="password" id="brainpassphraseconfirm" value={this.state.brainPassphraseConfirm} onChange={this.onBrainPassphraseConfirmChange} />}
            <span>
              <input tabindex="3" type="button" id="brainview" value="View" onClick={this.view} />
            </span>
            <span id="brainalgorithm" class="notes right i18n">
              Algorithm: SHA256(passphrase)
            </span>
          </div>
          {this.state.warn && (
            <div class="row extra">
              <span id="brainwarning">{this.state.warn}</span>
            </div>
          )}
          {this.state.error && (
            <div class="row extra errorMsg">
              <span id="brainerror">{this.state.error}</span>
            </div>
          )}
        </div>
        {(this.state.address || this.state.wif) && (
          <div id="brainkeyarea" class="keyarea">
            <div class="public">
              <div id="brainqrcodepublic" class="qrcode_public">
                {this.state.address && <QRCode value={this.state.address} />}
              </div>
              <div class="pubaddress">
                <span class="label i18n" id="brainlabelbitcoinaddress">
                  Public Address:
                </span>
                <span class="output" id="brainbtcaddress">
                  {this.state.address}
                </span>
              </div>
            </div>
            <div class="private">
              <div id="brainqrcodeprivate" class="qrcode_private">
                {this.state.wif && <QRCode value={this.state.wif} />}
              </div>
              <div class="privwif">
                <span class="label i18n" id="brainlabelprivatekey">
                  Private Key (Wallet Import Format):
                </span>
                <span class="output" id="brainbtcprivwif">
                  {this.state.wif}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}
