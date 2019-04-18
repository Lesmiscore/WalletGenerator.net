import React from "react";
import FirstHalfSingleSafety from "../static/firsthalfsinglesafety";
import SecondHalfSingleSafety from "./secondhalfsinglesafety";
import FAQ from "./faq";

module.exports = class SingleSafety extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div id="singlesafety">
        <FirstHalfSingleSafety />
        <SecondHalfSingleSafety />
        <FAQ />
      </div>
    );
  }
};
