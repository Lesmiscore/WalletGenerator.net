const translator = require("./ninja.translator.js");
const janin = require("./janin.currency.js");
const { getQueryString, envSecurityCheck, browserSecurityCheck, ev } = require("./ninja.misc.js");

const query = getQueryString();

let i, a, x;

// change language
if (query["culture"]) {
  translator.translate(query["culture"]);
} else {
  translator.autodetectTranslation();
}
if (query["showseedpool"] === "true" || query["showseedpool"] === "1") {
  document.getElementById("seedpoolarea").style.display = "block";
}
// change currency
const currency = (query["currency"] || "bitcoin").toLowerCase();
let coinFound = false,
  bitcoinIdx = -1;
for (i = 0; i < janin.currencies.length; i++) {
  const curName = janin.currencies[i].name.toLowerCase();
  if (curName === currency) {
    janin.useCurrency(i);
    coinFound = true;
  }
  if (curName === "bitcoin") {
    bitcoinIdx = i;
  }
}
if (!coinFound) {
  janin.useCurrency(bitcoinIdx);
}
// Reset title if no currency is choosen
if (!query["currency"]) {
  document.title = translator.get("defaultTitle");
  document.getElementById("siteTitle").alt = translator.get("defaultTitle");
}
// populate currency dropdown list
const select = document.getElementById("currency");
let options = "";
for (i = 0; i < janin.currencies.length; i++) {
  const curr = janin.currencies[i];
  options += "<option value='" + i + "'";
  if (curr.name === janin.name()) options += " selected='selected'";
  options += ">" + curr.name + "</option>";
}
select.innerHTML = options;
// populate supported currency list
const supportedcurrencies = document.getElementById("supportedcurrencies");
let currencieslist = "";
let j = 0;
for (i = 0; i < janin.currencies.length; i++) {
  const curr = janin.currencies[i];
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
for (i = 0; i < janin.currencies.length; i++) {
  if (!janin.currencies[i].donate) continue;
  list += "<tr id='currencydonatelink" + i + "'>";
  list += "<td class='currencyNameColumn'>" + janin.currencies[i].name + "</td>";
  list += "<td class='address'><a href='" + janin.currencies[i].name.toLowerCase() + ":" + janin.currencies[i].donate + "'>";
  list += janin.currencies[i].donate + "</a></td></tr>";
}
list += "</table>";
donatelist.innerHTML = list;
for (i = 0; i < janin.currencies.length; i++) {
  if (!janin.currencies[i].donate) continue;
  ev("tr#currencydonatelink" + i, "mouseover", function() {
    require("./ninja.donatetab.js").displayQrCode(21, this);
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

envSecurityCheck();
browserSecurityCheck();

setTimeout(() => {
  require("./ninja.singlewallet.js").open();
}, 0);
