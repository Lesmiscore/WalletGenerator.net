import React from "react";
import janin from "../janin.currency";
import { invoke } from "../misc";

module.exports = class AddressTypeDrop extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: props.mode, coin: props.coin };
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(event) {
    this.setState({
      value: event.selectedIndex
    });
    invoke(this.props.onChange, event.selectedIndex);
  }

  getCoin() {
    return janin.currencies[this.state.coin];
  }

  render() {
    let options = [];
    let num = 0;
    for (let curr of this.getCoin().getAddressFormatNames()) {
      options.push(<option value={num}>{curr.name}</option>);
      num++;
    }
    return (
      <select id={this.props.id || "currency"} value={this.state.value} onChange={this.handleChange}>
        {options}
      </select>
    );
  }
};
