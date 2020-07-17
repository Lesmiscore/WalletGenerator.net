import { translate, autodetectTranslation, get, translations, staticID } from "./ninja.translator.js";
import { currencies, useCurrency, name } from "./janin.currency.js";
import { getQueryString, envSecurityCheck, browserSecurityCheck, ev } from "./ninja.misc.js";

const query = getQueryString();

let i, a, x;

// change language
if (query["culture"]) {
  translate(query["culture"]);
} else {
  autodetectTranslation();
}
if (query["showseedpool"] === "true" || query["showseedpool"] === "1") {
  document.getElementById("seedpoolarea").style.display = "block";
}
// change currency
const currency = (query["currency"] || "bitcoin").toLowerCase();
let coinFound = false,
  bitcoinIdx = -1;
for (i = 0; i < currencies.length; i++) {
  const curName = currencies[i].name.toLowerCase();
  if (curName === currency) {
    useCurrency(i);
    coinFound = true;
  }
  if (curName === "bitcoin") {
    bitcoinIdx = i;
  }
}
if (!coinFound) {
  useCurrency(bitcoinIdx);
}
// Reset title if no currency is choosen
if (!query["currency"]) {
  document.title = get("defaultTitle");
  document.getElementById("siteTitle").alt = get("defaultTitle");
}
// populate currency dropdown list
const select = document.getElementById("currency");
let options = "";
for (i = 0; i < currencies.length; i++) {
  const curr = currencies[i];
  options += "<option value='" + i + "'";
  if (curr.name === name()) options += " selected='selected'";
  options += ">" + curr.name + "</option>";
}
select.innerHTML = options;
// populate supported currency list
const supportedcurrencies = document.getElementById("supportedcurrencies");
let currencieslist = "";
let j = 0;
for (i = 0; i < currencies.length; i++) {
  const curr = currencies[i];
  //if (!curr.donate) continue;
  currencieslist += "<a href='?currency=" + curr.name;
  if (query["culture"]) currencieslist += "&culture=" + query["culture"];
  currencieslist += "'>" + curr.name + "</a> ";
  j++;
}
supportedcurrencies.innerHTML = currencieslist;
document.getElementById("supportedcurrenciescounter").innerHTML = j.toString() + " ";
// populate donate list
document.getElementById("donateqrcode").style.display = "none";
const donatelist = document.getElementById("donatelist");
let list = "<table>";
for (i = 0; i < currencies.length; i++) {
  if (!currencies[i].donate) continue;
  list += "<tr id='currencydonatelink" + i + "'>";
  list += "<td class='currencyNameColumn'>" + currencies[i].name + "</td>";
  list += "<td class='address'><a href='" + currencies[i].name.toLowerCase() + ":" + currencies[i].donate + "'>";
  list += currencies[i].donate + "</a></td></tr>";
}
list += "</table>";
donatelist.innerHTML = list;
for (i = 0; i < currencies.length; i++) {
  if (!currencies[i].donate) continue;
  ev("tr#currencydonatelink" + i, "mouseover", function () {
    require("./ninja.donatetab.js").default.displayQrCode(21, this);
  });
}

// Extract i18n
if (query["i18nextract"]) {
  const culture = query["i18nextract"];
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

envSecurityCheck();
browserSecurityCheck();

setTimeout(() => {
  require("./ninja.singlewallet.js").default.open();
}, 0);
