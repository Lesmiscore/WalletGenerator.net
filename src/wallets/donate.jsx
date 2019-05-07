import React from "react";
import ChangeLog from "../static/changelog.jsx";
import QRCode from "../misc/qrcode.jsx";
import { currencies } from "../janin.currency";

export default class Donate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      qrcode: "",
      qrcodeOffsetTop: 0
    };
    this.displayQrCode = this.displayQrCode.bind(this);
  }
  displayQrCode(currencyid, e) {
    this.setState({ qrcode: `${currencies[currencyid].name.toLowerCase()}:${currencies[currencyid].donate}`, qrcodeOffsetTop: e.offsetTop + 15 });
  }
  makeDonateList() {
    const list = [];
    for (let i = 0; i < currencies.length; i++) {
      if (!currencies[i].donate) continue;
      const inner = [];

      inner.push(
        <td class="currencyNameColumn">{currencies[i].name}</td>,
        <td class="address">
          <a href={`${currencies[i].name.toLowerCase()}:${currencies[i].donate}`}>{currencies[i].donate}</a>
        </td>
      );
      list.push(
        <tr id={`currencydonatelink${i}`} onMouseOver={e => this.displayQrCode(i, e)}>
          {inner}
        </tr>
      );
    }
    return <table>{list}</table>;
  }
  render() {
    return (
      <div id="donatearea" class="walletarea">
        <div id="donatetextfooter" class="i18n">
          To support the development of this wallet generator, you can donate to the following addresses. When the support for a currency has been added by an external contributor to the project, he
          receives the donation directly.
        </div>
        <div id="donatelist">{this.makeDonateList()}</div>
        {this.state.qrcode && (
          <div id="donateqrcode" style={{ top: this.state.qrcodeOffsetTop }}>
            <QRCode value={this.state.qrcode} size={4} />
          </div>
        )}
        <div id="donateinfo" />
        <ChangeLog />
      </div>
    );
  }
}
