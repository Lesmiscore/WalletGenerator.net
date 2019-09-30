const translator = require("./ninja.translator.js");

const tabSwitch = function(walletTab) {
  if (walletTab.className.indexOf("selected") === -1) {
    // unselect all tabs
    const wallets = {
      brainwallet: require("./ninja.brainwallet.js"),
      bulkwallet: require("./ninja.bulkwallet.js"),
      detailwallet: require("./ninja.detailwallet.js"),
      paperwallet: require("./ninja.paperwallet.js"),
      singlewallet: require("./ninja.singlewallet.js"),
      donate: require("./ninja.donatetab.js")
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

const envSecurityCheck = function() {
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

const browserSecurityCheck = function() {
  let innerHTML = "";
  if (window.crypto && window.crypto.getRandomValues) {
    innerHTML = '<span style="color: #009900;">' + translator.get("securitychecklistrandomOK") + "</span>";
  } else {
    innerHTML = '<span style="color: #990000;">' + translator.get("securitychecklistrandomNOK") + "</span>";
  }
  document.getElementById("browserSecurityCheck").innerHTML = innerHTML;
};

const getQueryString = function() {
  const result = {},
    queryString = location.search.substring(1),
    re = /([^&=]+)=([^&]*)/g;
  let m;
  while ((m = re.exec(queryString))) {
    result[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
  }
  return result;
};

const toggleFaqQuestion = function(elementId) {
  const answerDiv = document.getElementById(elementId);
  answerDiv.style.display = answerDiv.style.display === "block" ? "none" : "block";
};

module.exports = {
  tabSwitch,
  envSecurityCheck,
  browserSecurityCheck,
  getQueryString,
  toggleFaqQuestion
};
