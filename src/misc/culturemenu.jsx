import React from "react";
import { invoke } from "../misc";

module.exports = class CultureMenu extends React.Component {
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
          <a href="?culture=en" hreflang="en" onClick={this.changeCulture} id="cultureen" class={this.isSelected("en")}>
            English
          </a>
        </span>{" "}
        |
        <span>
          <a href="?culture=fr" hreflang="fr" onClick={this.changeCulture} id="culturefr" class={this.isSelected("en")}>
            Français
          </a>
        </span>{" "}
        |
        <span>
          <a href="?culture=de" hreflang="de" onClick={this.changeCulture} id="culturede" class={this.isSelected("en")}>
            German
          </a>
        </span>{" "}
        |
        <span>
          <a href="?culture=nl" hreflang="nl" onClick={this.changeCulture} id="culturenl" class={this.isSelected("en")}>
            Dutch
          </a>
        </span>{" "}
        |
        <span>
          <a href="?culture=pt" hreflang="pt" onClick={this.changeCulture} id="culturept" class={this.isSelected("en")}>
            Português
          </a>
        </span>{" "}
        |
        <span>
          <a href="?culture=ru" hreflang="ru" onClick={this.changeCulture} id="cultureru" class={this.isSelected("en")}>
            Русский
          </a>
        </span>{" "}
        |
        <span>
          <a href="?culture=es" hreflang="es" onClick={this.changeCulture} id="culturees" class={this.isSelected("en")}>
            Spanish
          </a>
        </span>{" "}
        |
        <span>
          <a href="?culture=it" hreflang="it" onClick={this.changeCulture} id="cultureit" class={this.isSelected("en")}>
            Italiano
          </a>
        </span>{" "}
        |
        <span>
          <a href="?culture=ua" hreflang="ua" onClick={this.changeCulture} id="cultureua" class={this.isSelected("en")}>
            Українська
          </a>
        </span>{" "}
        |
        <span>
          <a href="?culture=tr" hreflang="tr" onClick={this.changeCulture} id="culturetr" class={this.isSelected("en")}>
            Türk
          </a>
        </span>{" "}
        |
        <span>
          <a href="?culture=pl" hreflang="pl" onClick={this.changeCulture} id="culturepl" class={this.isSelected("en")}>
            Polski
          </a>
        </span>{" "}
        |
        <span>
          <a href="?culture=zh" hreflang="zh" onClick={this.changeCulture} id="culturezh" class={this.isSelected("en")}>
            中文
          </a>
        </span>
      </div>
    );
  }
};
