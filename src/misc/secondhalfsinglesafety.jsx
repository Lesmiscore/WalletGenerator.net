import React from "react";
import { currencies } from "../janin.currency";
import { get } from "../ninja.translator";
import { getQueryString } from "../ninja.misc";
const query = getQueryString();

export default class SecondHalfSingleSafety extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      envSecurityCheck: false,
      browserSecurityCheck: false,
      currenciesCounter: currencies.length
    };
  }

  envSecurityCheck() {
    switch (window.location.protocol) {
      case "http:":
      case "https:":
        return <span style={{ color: "#990000" }}>{get("securitychecklistofflineNOK")}</span>;
      default:
        return <span style={{ color: "#009900" }}>{get("securitychecklistofflineOK")}</span>;
    }
  }

  browserSecurityCheck() {
    if (window.crypto && window.crypto.getRandomValues) {
      return <span style={{ color: "#009900" }}>{get("securitychecklistrandomOK")}</span>;
    } else {
      return <span style={{ color: "#990000" }}>{get("securitychecklistrandomNOK")}</span>;
    }
  }

  buildCurrenciesList() {
    const components = [];
    for (let curr of currencies) {
      components.push(
        <a key={curr.name} href={"?currency=" + curr.name + (query["culture"] ? "&culture=" + query["culture"] : "")}>
          {curr.name}
        </a>
      );
    }
    return components;
  }

  render() {
    return (
      <div class="secondHalfSingleSafety">
        <img class="frontPageImage" src="images/overview.png" alt="Overview image of 4 paper wallet" />

        <div class="securityChecklist">
          <b id="securitychecktitle" class="i18n">
            Security Checklist :
          </b>

          <ul>
            <li id="envSecurityCheck">{this.envSecurityCheck()}</li>

            <li id="browserSecurityCheck">{this.browserSecurityCheck()}</li>

            <li id="securitychecklivecd" class="i18n">
              Are you using a secure operating system guaranteed to be free of spyware and viruses, for example, an Ubuntu LiveCD?
            </li>
          </ul>
        </div>

        <div class="supportedCurrenciesChecklist">
          <b>
            <span id="supportedcurrenciescounter">{this.state.currenciesCounter}</span>
            <span id="supportedcurrencylbl" class="i18n">
              supported currencies !
            </span>
          </b>
          <div id="supportedcurrencies">{this.buildCurrenciesList()}</div>
        </div>
      </div>
    );
  }
}
