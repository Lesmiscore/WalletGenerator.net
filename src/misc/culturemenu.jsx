import React from "react";
import { invoke } from "../misc";

export default class CultureMenu extends React.Component {
  constructor(props) {
    super(props);
  }
  isSelected(cult) {
    if (this.props.culture === cult) {
      return "selected";
    } else {
      return "";
    }
  }
  changeCulture(event) {
    const target = event.target.getAttribute("hreflang");
    invoke(this.props.onChange, target);
  }
  render() {
    return (
      <div id="culturemenu">
        <span>
          <a href="?culture=en" hrefLang="en" onClick={this.changeCulture} id="cultureen" className={this.isSelected("en")}>
            English
          </a>
        </span>{" "}
        |
        <span>
          <a href="?culture=fr" hrefLang="fr" onClick={this.changeCulture} id="culturefr" className={this.isSelected("en")}>
            Français
          </a>
        </span>{" "}
        |
        <span>
          <a href="?culture=de" hrefLang="de" onClick={this.changeCulture} id="culturede" className={this.isSelected("en")}>
            German
          </a>
        </span>{" "}
        |
        <span>
          <a href="?culture=nl" hrefLang="nl" onClick={this.changeCulture} id="culturenl" className={this.isSelected("en")}>
            Dutch
          </a>
        </span>{" "}
        |
        <span>
          <a href="?culture=pt" hrefLang="pt" onClick={this.changeCulture} id="culturept" className={this.isSelected("en")}>
            Português
          </a>
        </span>{" "}
        |
        <span>
          <a href="?culture=ru" hrefLang="ru" onClick={this.changeCulture} id="cultureru" className={this.isSelected("en")}>
            Русский
          </a>
        </span>{" "}
        |
        <span>
          <a href="?culture=es" hrefLang="es" onClick={this.changeCulture} id="culturees" className={this.isSelected("en")}>
            Spanish
          </a>
        </span>{" "}
        |
        <span>
          <a href="?culture=it" hrefLang="it" onClick={this.changeCulture} id="cultureit" className={this.isSelected("en")}>
            Italiano
          </a>
        </span>{" "}
        |
        <span>
          <a href="?culture=ua" hrefLang="ua" onClick={this.changeCulture} id="cultureua" className={this.isSelected("en")}>
            Українська
          </a>
        </span>{" "}
        |
        <span>
          <a href="?culture=tr" hrefLang="tr" onClick={this.changeCulture} id="culturetr" className={this.isSelected("en")}>
            Türk
          </a>
        </span>{" "}
        |
        <span>
          <a href="?culture=pl" hrefLang="pl" onClick={this.changeCulture} id="culturepl" className={this.isSelected("en")}>
            Polski
          </a>
        </span>{" "}
        |
        <span>
          <a href="?culture=zh" hrefLang="zh" onClick={this.changeCulture} id="culturezh" className={this.isSelected("en")}>
            中文
          </a>
        </span>
      </div>
    );
  }
}
