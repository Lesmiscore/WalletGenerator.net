import React from "react";

module.exports = class BrainWallet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
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
            <input tabindex="1" type="password" id="brainpassphrase" value="" />
            <span>
              <label id="brainlabelshow" for="brainpassphraseshow">
                Show?
              </label>{" "}
              <input type="checkbox" id="brainpassphraseshow" />
            </span>
            <span class="print">
              <input type="button" name="print" id="brainprint" value="Print" />
            </span>
          </div>
          <div class="row extra">
            <span class="label" id="brainlabelconfirm">
              <label id="brainlabelconfirmlbl" class="i18n" for="brainpassphraseconfirm">
                Confirm Passphrase:{" "}
              </label>
            </span>
            <input tabindex="2" type="password" id="brainpassphraseconfirm" value="" />
            <span>
              <input tabindex="3" type="button" id="brainview" value="View" />
            </span>
            <span id="brainalgorithm" class="notes right i18n">
              Algorithm: SHA256(passphrase)
            </span>
          </div>
          <div class="row extra">
            <span id="brainwarning" />
          </div>
          <div class="row extra errorMsg">
            <span id="brainerror" />
          </div>
        </div>
        <div id="brainkeyarea" class="keyarea">
          <div class="public">
            <div id="brainqrcodepublic" class="qrcode_public" />
            <div class="pubaddress">
              <span class="label i18n" id="brainlabelbitcoinaddress">
                Public Address:
              </span>
              <span class="output" id="brainbtcaddress" />
            </div>
          </div>
          <div class="private">
            <div id="brainqrcodeprivate" class="qrcode_private" />
            <div class="privwif">
              <span class="label i18n" id="brainlabelprivatekey">
                Private Key (Wallet Import Format):
              </span>
              <span class="output" id="brainbtcprivwif" />
            </div>
          </div>
        </div>
      </div>
    );
  }
};
