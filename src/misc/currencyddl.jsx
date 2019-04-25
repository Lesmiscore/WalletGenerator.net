import React from "react";
import CurrencyDrop from "./currencydrop.jsx";

export default class CurrencyDdl extends React.Component {
  constructor(props) {
    super(props);
    this.state = { coin: this.props.coin };
  }
  render() {
    return (
      <div id="currencyddl">
        <span id="choosecurrency" class="i18n">
          Choose currency
        </span>{" "}
        :
        <CurrencyDrop coin={this.props.coin} onChange={this.props.onChange} />
      </div>
    );
  }
}
