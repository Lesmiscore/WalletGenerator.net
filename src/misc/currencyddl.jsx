import React from "react";
import CurrencyDrop from "./currencydrop";

module.exports = class CurrencyDdl extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div id="currencyddl">
        <span id="choosecurrency" class="i18n">
          Choose currency
        </span>{" "}
        :
        <CurrencyDrop onChange={this.props.onChange} />
      </div>
    );
  }
};
