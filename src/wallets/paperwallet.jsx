import React from "react";
import AddressTypeDrop from "../misc/addresstypedrop.jsx";
import { currencies } from "../janin.currency";
import { invoke } from "../misc";

export default class PaperWallet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bip38Passphrease: "",
      bip38Check: false,
      publicMode: 0,
      suppliedPrivateKey: "",
      keys: []
    };
    this.onBip38CheckChange = this.onBip38CheckChange.bind(this);
    this.onBip38PassphraseChange = this.onBip38PassphraseChange.bind(this);
    this.onSuppliedPrivateKey = this.onSuppliedPrivateKey.bind(this);
    this.pubModeChange = this.pubModeChange.bind(this);
    this.randomlyGenerate = this.randomlyGenerate.bind(this);
    this.useSuppliedPrivateKey = this.useSuppliedPrivateKey.bind(this);
  }

  getCoin() {
    return currencies[this.props.coin];
  }

  onBip38CheckChange(event) {
    this.setState({ bip38Check: event.target.checked });
  }
  onBip38PassphraseChange(event) {
    this.setState({ bip38Passphrease: event.target.value });
  }
  onSuppliedPrivateKey(event) {
    this.setState({ suppliedPrivateKey: event.target.value });
  }
  pubModeChange(publicMode) {
    this.setState({ publicMode });
  }
  randomlyGenerate(count, callback) {
    const coin = this.getCoin();
    const keys = [];
    for (let i = 0; i < count; i++) {
      keys.push(coin.getWIFForAddress(coin.makeRandom(), this.state.publicMode));
    }
    this.setState({ keys });
    setImmediate(() => invoke(callback));
  }
  useSuppliedPrivateKey() {
    this.setState({ keys: [this.state.suppliedPrivateKey] });
  }

  render() {
    const coin = this.getCoin();
    const paperWallets = this.state.keys.map((key, index) => React.createElement(coin.templateArtisticHtml(index), { key, mode: this.state.publicMode }));
    return (
      <div id="paperarea">
        <div class="commands">
          <div id="papercommands" class="row">
            <span>
              <label id="paperlabelencrypt" for="paperencrypt" class="i18n">
                BIP38 Encrypt?
              </label>{" "}
              <input type="checkbox" id="paperencrypt" checked={this.state.bip38Check} onChange={this.onBip38CheckChange} />
            </span>
            <span>
              <label id="paperlabelBIPpassphrase" for="paperpassphrase" class="i18n">
                Passphrase:
              </label>{" "}
              <input type="text" id="paperpassphrase" value={this.state.bip38Passphrase} onChange={this.state.onBip38PassphraseChange} />
            </span>
            <AddressTypeDrop coin={this.props.coin} mode={this.state.publicMode} onChange={this.pubModeChange} />
            <br />
            <input type="button" id="papergenerate" value="Randomly generate" onClick={() => this.randomlyGenerate(1)} />
            <span>OR</span>
            <input
              placeholder="Enter your own WIF private key"
              id="suppliedPrivateKey"
              name="suppliedPrivateKey"
              spellcheck="false"
              value={this.state.suppliedPrivateKey}
              onChange={this.onSuppliedPrivateKey}
            />
            &nbsp;
            <input type="button" id="papergenerate" value="Apply &raquo;" onClick={this.useSuppliedPrivateKey} />
            <span class="print">
              <input type="button" name="print" value="Print" id="paperprint" onClick={window.print} />
              <input type="button" name="printmany" value="Print Many" id="singleprint" onClick={() => this.randomlyGenerate(10, window.print)} />
            </span>
          </div>
        </div>
        <div id="paperkeyarea">{paperWallets}</div>
      </div>
    );
  }
}
