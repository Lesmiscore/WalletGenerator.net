import React from "react";
import SingleSafety from "../misc/singlesafety";
import AddressTypeDrop from "../misc/addresstypedrop";
import QRCode from "../misc/qrcode";
import janin from "../janin.currency";

module.exports = class SingleWallet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      public: "",
      private: "",
      coin: props.coin || 0,
      publicMode: 0
    };
    this.newAddress = this.newAddress.bind(this);
  }

  getCoin() {
    return janin.currencies[this.state.coin];
  }

  newAddress() {
    const coin = this.getCoin();
    const publicMode = this.state.publicMode;
    const key = coin.makeRandom();
    const _public = coin.getAddressWith(key, publicMode);
    const _private = coin.getWIFForAddress(key, publicMode);
    this.setState({
      public: _public,
      private: _private
    });
  }

  pubModeChange(publicMode) {
    this.setState({ publicMode });
  }

  render() {
    <div id="singlearea" class="walletarea">
      <div id="walletCommands" class="commands">
        <div id="singlecommands" class="row">
          <span>
            <input type="button" id="newaddress" value="Generate New Address" onClick={this.newAddress} />
          </span>
          <span>
            <AddressTypeDrop coin={this.state.coin} onChange={this.pubModeChange} />
          </span>
          <span class="print">
            <input type="button" name="print" value="Print" id="singleprint" onClick={window.print} />
          </span>
        </div>
      </div>
      <div id="keyarea" class="keyarea">
        <div class="public">
          <div class="pubaddress">
            <span class="label i18n" id="singlelabelbitcoinaddress">
              Public Address
            </span>
          </div>
          <div id="qrcode_public" class="qrcode_public">
            {this.state.public && <QRCode value={this.state.public} size={4} />}
          </div>
          <div class="pubaddress">
            <span class="output" id="btcaddress">
              {this.state.public}
            </span>
          </div>
          <div id="singleshare" class="i18n">
            SHARE
          </div>
        </div>
        <div class="private">
          <div class="privwif">
            <span class="label i18n" id="singlelabelprivatekey">
              Private Key (Wallet Import Format)
            </span>
          </div>
          <div id="qrcode_private" class="qrcode_private">
            {this.state.private && <QRCode value={this.state.private} size={4} />}
          </div>
          <div class="privwif">
            <span class="output" id="btcprivwif">
              {this.state.private}
            </span>
          </div>
          <div id="singlesecret" class="i18n">
            SECRET
          </div>
        </div>
      </div>

      <SingleSafety />
    </div>;
  }
};
