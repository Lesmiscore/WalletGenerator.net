const translator = require("./ninja.translator.js");
const janin = require("./lazy/janin.currency.js");
const { getQueryString } = require("./ninja.misc.js");
const { ev } = require("./misc.js");

let i, a, x;

// Extract i18n
if (getQueryString()["i18nextract"]) {
  const culture = getQueryString()["i18nextract"];
  const div = document.createElement("div");
  div.innerHTML = "<h3>i18n</h3>";
  div.setAttribute("style", "text-align: center");
  const elem = document.createElement("textarea");
  elem.setAttribute("rows", "30");
  elem.setAttribute("style", "width: 99%");
  elem.setAttribute("wrap", "off");

  a = document.getElementsByClassName("i18n");

  let i18n = '"' + culture + '": {\n';
  for (x = 0; x < a.length; x++) {
    i18n += "\t";
    i18n += '"' + a[x].id + '": "';
    if (translator.translations[culture] && translator.translations[culture][a[x].id]) i18n += cleani18n(translator.translations[culture][a[x].id]);
    else i18n += "(ENGLISH)" + cleani18n(a[x].innerHTML);
    i18n += '",\n';
  }
  for (x = 0; x < translator.staticID.length; x++) {
    i18n += "\t";
    i18n += '"' + translator.staticID[x] + '": "';
    if (translator.translations[culture] && translator.translations[culture][translator.staticID[x]]) i18n += cleani18n(translator.translations[culture][translator.staticID[x]]);
    else i18n += "(ENGLISH)" + cleani18n(translator.translations["en"][translator.staticID[x]]);
    i18n += '",\n';
  }

  i18n += "},";

  elem.innerHTML = i18n;
  div.appendChild(elem);
  document.body.appendChild(div);
}
function cleani18n(string) {
  return string
    .replace(/^\s\s*/, "")
    .replace(/\s\s*$/, "") // remove leading and trailing space
    .replace(/\s*\n+\s*/g, "\\n") // replace new line
    .replace(/"/g, '\\"');
}
