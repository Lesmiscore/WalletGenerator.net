import React from "react";
import FirstHalfSingleSafety from "../static/firsthalfsinglesafety.jsx";
import SecondHalfSingleSafety from "./secondhalfsinglesafety.jsx";
import FAQ from "./faq.jsx";

export default class SingleSafety extends React.Component {
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
}
