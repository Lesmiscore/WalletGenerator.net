let currentCulture = "en";

const autodetectTranslation = function() {
  // window.navigator.language for Firefox / Chrome / Opera Safari
  // window.navigator.userLanguage for IE
  let language = window.navigator.language || window.navigator.userLanguage;
  if (!translate(language)) {
    // Try to remove part after dash, for example cs-CZ -> cs
    language = language.substr(0, language.indexOf("-"));
    translate(language);
  }
};

const translate = function(culture) {
  const dict = translations[culture];
  if (dict) {
    // set current culture
    currentCulture = culture;
    // update menu UI
    for (const cult in translations) {
      if ({}.hasOwnProperty.call(translations, cult)) {
        document.getElementById("culture" + cult).setAttribute("class", "");
      }
    }
    document.getElementById("culture" + culture).setAttribute("class", "selected");
    // apply translations for each know id
    for (const id in dict) {
      if (document.getElementById(id) && document.getElementById(id).value) {
        document.getElementById(id).value = dict[id];
      } else if (document.getElementById(id)) {
        document.getElementById(id).innerHTML = dict[id];
      }
    }
    return true;
  }
  return false;
};

const get = function(id) {
  return translations[currentCulture][id];
};

const staticID = [
  "defaultTitle",
  "title",
  "brainalertpassphrasewarning",
  "brainalertpassphrasetooshort",
  "brainalertpassphrasedoesnotmatch",
  "bulkgeneratingaddresses",
  "bip38alertincorrectpassphrase",
  "bip38alertpassphraserequired",
  "detailconfirmsha256",
  "detailalertnotvalidprivatekey",
  "securitychecklistrandomOK",
  "securitychecklistrandomNOK",
  "securitychecklistofflineNOK",
  "securitychecklistofflineOK",
  "paperwalletback"
];

const translations = {
  en: require("../l10n/en.js"),
  fr: require("../l10n/fr.js"),
  de: require("../l10n/de.js"),
  nl: require("../l10n/nl.js"),
  pt: require("../l10n/pt.js"),
  ru: require("../l10n/ru.js"),
  es: require("../l10n/es.js"),
  it: require("../l10n/it.js"),
  ua: require("../l10n/ua.js"),
  tr: require("../l10n/tr.js"),
  pl: require("../l10n/pl.js"),
  zh: require("../l10n/zh.js")
};

module.exports = {
  autodetectTranslation,
  translate,
  get
};
