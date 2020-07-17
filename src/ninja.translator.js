export let currentCulture = "en";

export const autodetectTranslation = function () {
  // window.navigator.language for Firefox / Chrome / Opera Safari
  // window.navigator.userLanguage for IE
  let language = window.navigator.language || window.navigator.userLanguage;
  if (!translate(language)) {
    // Try to remove part after dash, for example cs-CZ -> cs
    language = language.substr(0, language.indexOf("-"));
    translate(language);
  }
};

export const translate = function (culture) {
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

export const get = function (id) {
  return translations[currentCulture][id];
};

export const staticID = [
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
  "paperwalletback",
];

export const translations = {
  en: await import("./l10n/en.json"),
  fr: await import("./l10n/fr.json"),
  de: await import("./l10n/de.json"),
  nl: await import("./l10n/nl.json"),
  pt: await import("./l10n/pt.json"),
  ru: await import("./l10n/ru.json"),
  es: await import("./l10n/es.json"),
  it: await import("./l10n/it.json"),
  ua: await import("./l10n/ua.json"),
  tr: await import("./l10n/tr.json"),
  pl: await import("./l10n/pl.json"),
  zh: await import("./l10n/zh.json"),
};

export default {
  autodetectTranslation,
  translate,
  get,
};
