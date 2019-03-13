const translator = require("./ninja.translator.js");
const janin = require("./janin.currency.js");
const {
  getQueryString,
  envSecurityCheck,
  browserSecurityCheck
} = require("./ninja.misc.js");

// change language
if (getQueryString()["culture"]) {
  translator.translate(getQueryString()["culture"]);
} else {
  translator.autodetectTranslation();
}
if (
  getQueryString()["showseedpool"] === "true" ||
  getQueryString()["showseedpool"] === "1"
) {
  document.getElementById("seedpoolarea").style.display = "block";
}
// change currency
let currency = getQueryString()["currency"] || "bitcoin";
currency = currency.toLowerCase();
for (i = 0; i < janin.currencies.length; i++) {
  if (janin.currencies[i].name.toLowerCase() === currency) janin.useCurrency(i);
}
// Reset title if no currency is choosen
if (getQueryString()["currency"] === null) {
  document.title = translator.get("defaultTitle");
  document.getElementById("siteTitle").alt = translator.get("defaultTitle");
}
// populate currency dropdown list
const select = document.getElementById("currency");
let options = "";
let i, a, x;
for (i = 0; i < janin.currencies.length; i++) {
  const curr = janin.currencies[i];
  options += "<option value='" + i + "'";
  if (curr.name === janin.currency.name()) options += " selected='selected'";
  options += ">" + curr.name + "</option>";
}
select.innerHTML = options;
// populate supported currency list
const supportedcurrencies = document.getElementById("supportedcurrencies");
let currencieslist = "";
let j = 0;
for (i = 0; i < janin.currencies.length; i++) {
  const curr = janin.currencies[i];
  if (curr.donate === null) continue;
  currencieslist += "<a href='?currency=" + curr.name;
  if (getQueryString()["culture"])
    currencieslist += "&culture=" + getQueryString()["culture"];
  currencieslist += "'>" + curr.name + "</a> ";
  j++;
}
supportedcurrencies.innerHTML = currencieslist;
document.getElementById("supportedcurrenciescounter").innerHTML =
  j.toString() + " ";
// populate donate list
document.getElementById("donateqrcode").style.display = "none";
const donatelist = document.getElementById("donatelist");
let list = "<table>";
for (i = 0; i < janin.currencies.length; i++) {
  if (janin.currencies[i].donate === null) continue;
  list += "<tr onmouseover='donate.displayQrCode(" + i + ", this)'>";
  list +=
    "<td class='currencyNameColumn'>" + janin.currencies[i].name + "</td>";
  list +=
    "<td class='address'><a href='" +
    janin.currencies[i].name.toLowerCase() +
    ":" +
    janin.currencies[i].donate +
    "'>";
  list += janin.currencies[i].donate + "</a></td></tr>";
}
list += "</table>";
donatelist.innerHTML = list;

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
    if (
      translator.translations[culture] &&
      translator.translations[culture][a[x].id]
    )
      i18n += cleani18n(translator.translations[culture][a[x].id]);
    else i18n += "(ENGLISH)" + cleani18n(a[x].innerHTML);
    i18n += '",\n';
  }
  for (x = 0; x < translator.staticID.length; x++) {
    i18n += "\t";
    i18n += '"' + translator.staticID[x] + '": "';
    if (
      translator.translations[culture] &&
      translator.translations[culture][translator.staticID[x]]
    )
      i18n += cleani18n(
        translator.translations[culture][translator.staticID[x]]
      );
    else
      i18n +=
        "(ENGLISH)" +
        cleani18n(translator.translations["en"][translator.staticID[x]]);
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
