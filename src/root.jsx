import React from "react";
import janin from "./janin.currency";
import { getQueryString, envSecurityCheck, browserSecurityCheck } from "./ninja.misc.js";

import CultureMenu from "./static/culturemenu";
import Banner from "./static/banner";
import CurrencyDl from "./misc/currencyddl";

import SingleWallet from "./wallets/singlewallet";
import PaperWallet from "./wallets/paperwallet";
import BulkWallet from "./wallets/bulkwallet";
import BrainWallet from "./wallets/brainwallet";
import DetailWallet from "./wallets/detailwallet";
import Donate from "./wallets/donate";

import Footer from "./static/footer";

const query = getQueryString();

module.exports = class Root extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      wallet: 0,
      coin: janin.findCoinIndex(query["currency"] || "bitcoin"),
      culture: query["culture"] || "en"
    };
    this.selectWallet = this.selectWallet.bind(this);
    this.changeCulture = this.changeCulture.bind(this);
  }
  getWallet() {
    switch (this.state.wallet) {
      case 0:
        return <SingleWallet coin={this.state.coin} />;
      case 1:
        return <PaperWallet coin={this.state.coin} />;
      case 2:
        return <BulkWallet coin={this.state.coin} />;
      case 3:
        return <BrainWallet coin={this.state.coin} />;
      case 4:
        return <DetailWallet coin={this.state.coin} />;
      case 5:
        return <Donate />;
    }
  }
  selectWallet(index) {
    this.setState({ wallet: index });
  }
  changeCulture(name) {
    this.setState({ culture: name });
  }
  render() {
    return (
      <div id="main">
        <CultureMenu culture={this.state.currency} onChange={this.changeCulture} />
        <Banner />
        <CurrencyDl />

        <div class="menu" id="menu">
          <div class={`tab i18n ${this.state.wallet === 0 ? "selected" : ""}`} onClick={() => this.selectWallet(0)} id="singlewallet">
            Single Wallet
          </div>
          <div class={`tab i18n ${this.state.wallet === 1 ? "selected" : ""}`} onClick={() => this.selectWallet(1)} id="paperwallet">
            Paper Wallet
          </div>
          <div class={`tab i18n ${this.state.wallet === 2 ? "selected" : ""}`} onClick={() => this.selectWallet(2)} id="bulkwallet">
            Bulk Wallet
          </div>
          <div class={`tab i18n ${this.state.wallet === 3 ? "selected" : ""}`} onClick={() => this.selectWallet(3)} id="brainwallet">
            Brain Wallet
          </div>
          <div class={`tab i18n ${this.state.wallet === 4 ? "selected" : ""}`} onClick={() => this.selectWallet(4)} id="detailwallet">
            Wallet Details
          </div>
          <div class={`tab i18n ${this.state.wallet === 5 ? "selected" : ""}`} onClick={() => this.selectWallet(5)} id="donate">
            Support
          </div>
        </div>

        <div id="wallets">{this.getWallet()}</div>

        <Footer />
      </div>
    );
  }
};
