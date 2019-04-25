import React from "react";
import QRCode from "../misc/qrcode.jsx";

import privateKey from "../ninja.privatekey";
import _ from "lodash";
import { get } from "../ninja.translator";
import { currencies } from "../janin.currency";
import bitcoin from "bitcoinjs-lib";
import bigi from "bigi";

export default class DetailWallet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      wif: "",
      bip38Passphrease: "",
      pubKeyUncomp: "",
      pubKeyComp: "",
      privKeyHex: "",
      privKeyB64: "",
      privKeyMinikey: "",
      privKeyB6: "",
      privKeyBip38: "",
      faq: false,
      displayBip38: false
    };
    this.onWifChange = this.onWifChange.bind(this);
    this.onBip38PassphraseChange = this.onBip38PassphraseChange.bind(this);
  }

  getCoin() {
    return currencies[this.props.coin];
  }

  onWifChange(event) {
    this.setState({ wif: event.target.value });
  }
  onBip38PassphraseChange(event) {
    this.setState({ bip38Passphrease: event.target.value });
  }

  viewDetails() {
    const coin = this.getCoin();
    const minPassphraseLength = 15;
    const key = this.state.wif.replace(/^\s+|\s+$/g, ""); // trim white space
    document.getElementById("detailprivkey").value = key;
    const bip38CommandDisplay = this.state.displayBip38;
    this.clear();
    if (!key) {
      return;
    }
    if (privateKey.isBIP38Format(key)) {
      if (!bip38CommandDisplay) {
        this.setState({ displayBip38: true });
        return;
      }
      const passphrase = this.state.passphrase.replace(/^\s+|\s+$/g, ""); // trim white space
      if (!passphrase) {
        alert(get("bip38alertpassphraserequired"));
        return;
      }
      // show Private Key BIP38 Format
      privateKey.BIP38EncryptedKeyToByteArrayAsync(key, passphrase, btcKeyOrError => {
        if (btcKeyOrError.message) {
          alert(btcKeyOrError.message);
          this.clear();
        } else {
          this.populateKeyDetails(privateKey.create(btcKeyOrError), key);
        }
      });
    } else {
      let btcKey = coin.decodePrivateKey(key);
      if (!btcKey) {
        // enforce a minimum passphrase length
        if (key.length >= minPassphraseLength) {
          // Deterministic Wallet confirm box to ask if user wants to SHA256 the input to get a private key
          const usePassphrase = confirm(get("detailconfirmsha256"));
          if (usePassphrase) {
            const bytes = bitcoin.crypto.sha256(key);
            btcKey = coin.create(bigi.fromBuffer(bytes), null);
          } else {
            this.clear();
          }
        } else {
          alert(get("detailalertnotvalidprivatekey"));
          this.clear();
        }
      } else {
        this.populateKeyDetails(btcKey);
      }
    }
  }

  populateKeyDetails(btcKey, bip38) {
    const coin = this.getCoin();
    if (coin.havePrivateKey(btcKey)) {
      const privKeyBuffer = coin.getPrivateKeyBuffer(btcKey);

      const privTitles = coin.getWIFTitleNames();
      const privState = {};
      privState.privKeyHex = privKeyBuffer.toString("hex").toUpperCase();
      privState.privKeyB64 = privKeyBuffer.toString("base64");
      privState.privKeyBip38 = bip38 || "";
      for (let i in privTitles) {
        if ({}.hasOwnProperty.call(privTitles, i)) {
          const stripped = privTitles[i].toLowerCase().replace(/[^a-z0-9]/g, "");
          const address = coin.getWIFByType(btcKey, +i);
          privState[`dyn_${stripped}`] = address;
        }
      }

      this.setState(privState);
    }

    const pubKeyCompressed = coin.getPublicKey(btcKey, true);
    const pubKeyUncompressed = coin.getPublicKey(btcKey, false);

    const addrTitles = coin.getAddressTitleNames();
    const addrState = {};
    addrState.pubKeyUncomp = pubKeyUncompressed.toString("hex").toUpperCase();
    addrState.pubKeyComp = pubKeyCompressed.toString("hex").toUpperCase();
    for (let i in addrTitles) {
      if ({}.hasOwnProperty.call(addrTitles, i)) {
        const stripped = addrTitles[i].toLowerCase().replace(/[^a-z0-9]/g, "");
        const address = coin.getAddressWith(btcKey, +i);
        addrState[`dyn_${stripped}`] = address;
      }
    }

    this.setState(addrState);
  }

  openCloseFaq() {
    this.setState(s => ({ faq: !s.faq }));
  }

  makePublicTable() {
    const coin = this.getCoin();
    const publicQrTable = [];
    let chunkId = 0;
    for (let [first, second] of _.chunk(coin.getAddressTitleNames(), 2)) {
      const inner = [];
      const firstStripped = first.toLowerCase().replace(/[^a-z0-9]/g, "");
      inner.push(
        <td class="item">
          <span class="label" id={`label${firstStripped}`}>
            {first}
          </span>
          <div id={`detailqrcode${firstStripped}`} class="qrcode_public left" />
          <span class="output" id={`detailaddress${firstStripped}`} />
        </td>
      );
      if (second) {
        const secondStripped = second.toLowerCase().replace(/[^a-z0-9]/g, "");
        inner.push(
          <td class="item right">
            <span class="label" id={`label${secondStripped}`}>
              {second}
            </span>
            <div id={`detailqrcode${secondStripped}`} class="qrcode_public right" />
            <span class="output" id={`detailaddress${secondStripped}`} />
          </td>
        );
      }
      publicQrTable.push(
        <tr id={`pubqr${chunkId}`} class="pubqr">
          {inner}
        </tr>
      );
      chunkId++;
    }
    return (
      <table id="pubaddress" class="pubaddress">
        {publicQrTable}
      </table>
    );
  }
  makePrivateTable() {
    const coin = this.getCoin();
    const privateQrTable = [];
    let chunkId = 0;
    for (let [first, second] of _.chunk(coin.getWIFTitleNames(), 2)) {
      const inner = [];
      const firstStripped = first.toLowerCase().replace(/[^a-z0-9]/g, "");
      inner.push(
        <td class="item">
          <span class="label" id={`label${firstStripped}`}>
            {first}
          </span>
          <div id={`detailqrcode${firstStripped}`} class="qrcode_private left">
            {this.state[`dyn_${firstStripped}`] && <QRCode value={this.state[`dyn_${firstStripped}`]} size={4} />}
          </div>
          <span class="output" id={`detailaddress${firstStripped}`}>
            {this.state[`dyn_${firstStripped}`]}
          </span>
        </td>
      );
      if (second) {
        const secondStripped = second.toLowerCase().replace(/[^a-z0-9]/g, "");
        inner.push(
          <td class="item right">
            <span class="label" id={`label${secondStripped}`}>
              {second}
            </span>
            <div id={`detailqrcode${secondStripped}`} class="qrcode_private right">
              {this.state[`dyn_${secondStripped}`] && <QRCode value={this.state[`dyn_${secondStripped}`]} size={4} />}
            </div>
            <span class="output" id={`detailaddress${secondStripped}`}>
              {this.state[`dyn_${secondStripped}`]}
            </span>
          </td>
        );
      }
      privateQrTable.push(
        <tr id={`privqr${chunkId}`} class="privqr">
          {inner}
        </tr>
      );
      chunkId++;
    }
    return (
      <table id="privaddress" class="privaddress">
        {privateQrTable}
      </table>
    );
  }

  clear() {
    this.setState({
      pubKeyUncomp: "",
      pubKeyComp: "",
      privKeyHex: "",
      privKeyB64: "",
      privKeyMinikey: "",
      privKeyB6: "",
      privKeyBip38: ""
    });
  }

  render() {
    return (
      <div id="detailarea" class="walletarea">
        <div id="detailcommands" class="commands">
          <div class="row extra qrzone">
            <span class="qrinput">
              <label id="detaillabelenterprivatekey" for="detailprivkey" class="i18n">
                Enter Private Key
              </label>

              <input type="text" id="detailprivkey" value={this.state.wif} placeholder="Enter a private key" autocomplete="off" onChange={this.onWifChange} />

              <input type="button" id="detailview" value="View Details" onClick={this.viewDetails} />
            </span>
            <span class="print">
              <input type="button" name="print" id="detailprint" value="Print" onClick={window.print} />
            </span>
          </div>

          {this.state.displayBip38 && (
            <div id="detailbip38commands">
              <span>
                <label id="detaillabelpassphrase" class="i18n">
                  Enter BIP38 Passphrase
                </label>{" "}
                <input type="text" id="detailprivkeypassphrase" value={this.state.bip38Passphrease} onChange={this.onBip38PassphraseChange} />
              </span>
              <span>
                <input type="button" id="detaildecrypt" value="Decrypt BIP38" onClick={this.viewDetails} />
              </span>
            </div>
          )}
        </div>
        <div id="detailkeyarea">
          <div class="notes">
            <span id="detaillabelnote1" class="i18n">
              Your Private Key is a unique secret number that only you know. It can be encoded in a number of different formats. Below we show the Public Address and Public Key that corresponds to
              your Private Key as well as your Private Key in the most popular encoding formats (WIF, WIFC, HEX, B64).
            </span>
            <br />
            <br />
          </div>
          {this.makePublicTable()}
          <br />
          <br />
          <div class="item clear">
            <span class="label i18n" id="detaillabelpublickey">
              Public Key (130 characters [0-9A-F]):
            </span>
            <span class="output pubkeyhex" id="detailpubkey">
              {this.state.pubKeyUncomp}
            </span>
          </div>
          <div class="item">
            <span class="label i18n" id="detaillabelpublickeycomp">
              Public Key (compressed, 66 characters [0-9A-F]):
            </span>
            <span class="output" id="detailpubkeycomp">
              {this.state.pubKeyComp}
            </span>
          </div>
          <hr />
          {this.makePrivateTable()}
          <br />
          <br />
          <div class="item clear">
            <span class="label i18n" id="detaillabelprivhex">
              Private Key Hexadecimal Format (64 characters [0-9A-F]):
            </span>
            <span class="output" id="detailprivhex">
              {this.state.privKeyHex}
            </span>
          </div>
          <div class="item">
            <span class="label i18n" id="detaillabelprivb64">
              Private Key Base64 (44 characters):
            </span>
            <span class="output" id="detailprivb64">
              {this.state.privKeyB64}
            </span>
          </div>
          {this.state.privKeyMinikey && (
            <div class="item" id="detailmini">
              <span class="label i18n" id="detaillabelprivmini">
                Private Key Mini Format (22, 26 or 30 characters):
              </span>
              <span class="output" id="detailprivmini">
                {this.state.privKeyMinikey}
              </span>
            </div>
          )}
          {this.state.privKeyB6 && (
            <div class="item" id="detailb6">
              <span class="label i18n" id="detaillabelprivb6">
                Private Key Base6 Format (99 characters [0-5]):
              </span>
              <span class="output" id="detailprivb6">
                {this.state.privKeyB6}
              </span>
            </div>
          )}
          {this.state.privKeyBip38 && (
            <div class="item" id="detailbip38">
              <span class="label i18n" id="detaillabelprivbip38">
                Private Key BIP38 Format (58 characters Base58):
              </span>
              <span class="output" id="detailprivbip38">
                {this.state.privKeyBip38}
              </span>
            </div>
          )}
        </div>
        <div class="faqs">
          <div id="detailfaq1" class="faq">
            <div id="detailq1" class="question">
              <span id="detaillabelq1" class="i18n">
                How do I make a wallet using dice? What is B6?
              </span>
              <div id="detaile1" class="more" onClick={this.openCloseFaq} />
            </div>
            {this.state.faq && (
              <div id="detaila1" class="answer i18n">
                An important part of creating a crypto-currency wallet is ensuring the random numbers used to create the wallet are truly random. Physical randomness is better than computer generated
                pseudo-randomness. The easiest way to generate physical randomness is with dice. To create a crypto-currency private key you only need one six sided die which you roll 99 times.
                Stopping each time to record the value of the die. When recording the values follow these rules: 1=1, 2=2, 3=3, 4=4, 5=5, 6=0. By doing this you are recording the big random number,
                your private key, in B6 or base 6 format. You can then enter the 99 character base 6 private key into the text field above and click View Details. You will then see the public address
                associated with your private key. You should also make note of your private key in WIF format since it is more widely used.
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}
