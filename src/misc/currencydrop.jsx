import React from "react";
import janin from "../janin.currency";
import { invoke } from "../misc";

module.exports = class CurrencyDrop extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: this.props.coin };
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(event) {
    this.setState({
      value: event.selectedIndex
    });
    invoke(this.props.onChange, event.selectedIndex);
  }
  render() {
    let options = [];
    let num = 0;
    for (let curr of janin.currencies.length) {
      //options.push(React.createElement("option", Object.assign({ value: `${i}` }, curr.name === janin.name() ? { selected: "selected" } : {}), curr.name));
      options.push(<option value={num}>{curr.name}</option>);
      num++;
    }
    return (
      <select id="currency" value={this.state.value} onChange={this.handleChange}>
        {options}
      </select>
    );
  }
};
