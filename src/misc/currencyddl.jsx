import React from "react";
import CurrencyDrop from "./currencydrop";

module.exports = class CurrencyDdl extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hide: props.hide };
  }
  render() {
    return (
      <div id="currencyddl" class={this.state.hide ? "hide" : ""}>
        <span id="choosecurrency" class="i18n">
          Choose currency
        </span>{" "}
        :
        <CurrencyDrop onChange={this.props.onChange} />
      </div>
    );
  }
};
