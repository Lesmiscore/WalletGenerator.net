const translator = require("./ninja.translator.js");

const tabSwitch = function (walletTab) {
  if (walletTab.className.indexOf("selected") === -1) {
    // unselect all tabs
    const wallets = {
      brainwallet: require("./ninja.brainwallet.js"),
      bulkwallet: require("./ninja.bulkwallet.js"),
      detailwallet: require("./ninja.detailwallet.js"),
      paperwallet: require("./ninja.paperwallet.js"),
      singlewallet: require("./ninja.singlewallet.js"),
      donate: require("./ninja.donatetab.js"),
    };
    for (const wType in wallets) {
      if ({}.hasOwnProperty.call(wallets, wType)) {
        document.getElementById(wType).className = "tab";
        wallets[wType].close();
      }
    }
    walletTab.className += " selected";
    wallets[walletTab.getAttribute("id")].open();
  }
};

const envSecurityCheck = function () {
  let innerHTML = "";
  switch (window.location.protocol) {
    case "http:":
    case "https:":
      innerHTML = '<span style="color: #990000;">' + translator.get("securitychecklistofflineNOK") + "</span>";
      break;
    case "file:":
      innerHTML = '<span style="color: #009900;">' + translator.get("securitychecklistofflineOK") + "</span>";
      break;
    default:
  }
  document.getElementById("envSecurityCheck").innerHTML = innerHTML;
};

const browserSecurityCheck = function () {
  let innerHTML = "";
  if (window.crypto && window.crypto.getRandomValues) {
    innerHTML = '<span style="color: #009900;">' + translator.get("securitychecklistrandomOK") + "</span>";
  } else {
    innerHTML = '<span style="color: #990000;">' + translator.get("securitychecklistrandomNOK") + "</span>";
  }
  document.getElementById("browserSecurityCheck").innerHTML = innerHTML;
};

const getQueryString = function () {
  const result = {},
    queryString = location.search.substring(1),
    re = /([^&=]+)=([^&]*)/g;
  let m;
  while ((m = re.exec(queryString))) {
    result[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
  }
  return result;
};

const toggleFaqQuestion = function (elementId) {
  const answerDiv = document.getElementById(elementId);
  answerDiv.style.display = answerDiv.style.display === "block" ? "none" : "block";
};

const printMany = function () {
  const paperwallet = require("./ninja.paperwallet.js");
  paperwallet.build(document.getElementById("paperpassphrase").value, 10, function () {
    window.print();
  });
};

const escapeRegExp = function (string) {
  return string.replace(/[.*+?^=!:${}()|[\]/\\]/g, Buffer.from("5c2426", "hex").toString("utf8"));
};

const ev = function (selector, name, func) {
  const list = document.querySelectorAll(selector);
  Array.prototype.forEach.call(list, function (element) {
    element.addEventListener(name, func, false);
  });
};

const onload = function (func) {
  if (window.attachEvent) {
    window.attachEvent("onload", func);
  } else if (window.onload) {
    let curronload = window.onload;
    let newonload = function (evt) {
      curronload(evt);
      func(evt);
    };
    window.onload = newonload;
  } else {
    window.onload = func;
  }
};

module.exports = {
  tabSwitch,
  envSecurityCheck,
  browserSecurityCheck,
  getQueryString,
  toggleFaqQuestion,
  printMany,
  escapeRegExp,
  ev,
  onload,
};
