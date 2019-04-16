import React from "react";

module.exports = class Root extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      wallet: "singlewallet"
    };
  }
};
