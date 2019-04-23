import React from "react";
import ChangeLog from "../static/changelog";

module.exports = class Donate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div id="donatearea" class="walletarea">
        <div id="donatetextfooter" class="i18n">
          To support the development of this wallet generator, you can donate to the following addresses. When the support for a currency has been added by an external contributor to the project, he
          receives the donation directly.
        </div>
        <div id="donatelist" />
        <div id="donateqrcode" />
        <div id="donateinfo" />
        <ChangeLog />
      </div>
    );
  }
};
