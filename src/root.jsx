import React from "react";
import { findCoinIndex } from "./janin.currency.js";
import { getQueryString } from "./ninja.misc.js";

import CultureMenu from "./misc/culturemenu.jsx";
import Banner from "./static/banner.jsx";
import CurrencyDl from "./misc/currencyddl.jsx";

import SingleWallet from "./wallets/singlewallet.jsx";
import PaperWallet from "./wallets/paperwallet.jsx";
import BulkWallet from "./wallets/bulkwallet.jsx";
import BrainWallet from "./wallets/brainwallet.jsx";
import DetailWallet from "./wallets/detailwallet.jsx";
import Donate from "./wallets/donate.jsx";

import Footer from "./static/footer.jsx";

const query = getQueryString();

export default class Root extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      wallet: 0,
      coin: findCoinIndex(query["currency"] || "bitcoin"),
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
        <CultureMenu culture={this.state.culture} onChange={this.changeCulture} />
        <Banner />
        <CurrencyDl />

        <div className="menu" id="menu">
          <div className={`tab i18n ${this.state.wallet === 0 ? "selected" : ""}`} onClick={() => this.selectWallet(0)} id="singlewallet">
            Single Wallet
          </div>
          <div className={`tab i18n ${this.state.wallet === 1 ? "selected" : ""}`} onClick={() => this.selectWallet(1)} id="paperwallet">
            Paper Wallet
          </div>
          <div className={`tab i18n ${this.state.wallet === 2 ? "selected" : ""}`} onClick={() => this.selectWallet(2)} id="bulkwallet">
            Bulk Wallet
          </div>
          <div className={`tab i18n ${this.state.wallet === 3 ? "selected" : ""}`} onClick={() => this.selectWallet(3)} id="brainwallet">
            Brain Wallet
          </div>
          <div className={`tab i18n ${this.state.wallet === 4 ? "selected" : ""}`} onClick={() => this.selectWallet(4)} id="detailwallet">
            Wallet Details
          </div>
          <div className={`tab i18n ${this.state.wallet === 5 ? "selected" : ""}`} onClick={() => this.selectWallet(5)} id="donate">
            Support
          </div>
        </div>

        <div id="wallets">{this.getWallet()}</div>

        <Footer />
      </div>
    );
  }
}
