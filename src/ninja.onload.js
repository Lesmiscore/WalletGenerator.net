import { translations, staticID } from "./ninja.translator.js";
import { getQueryString } from "./ninja.misc.js";

let a, x;

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
    if (translations[culture] && translations[culture][a[x].id]) i18n += cleani18n(translations[culture][a[x].id]);
    else i18n += "(ENGLISH)" + cleani18n(a[x].innerHTML);
    i18n += '",\n';
  }
  for (x = 0; x < staticID.length; x++) {
    i18n += "\t";
    i18n += '"' + staticID[x] + '": "';
    if (translations[culture] && translations[culture][staticID[x]]) i18n += cleani18n(translations[culture][staticID[x]]);
    else i18n += "(ENGLISH)" + cleani18n(translations["en"][staticID[x]]);
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
