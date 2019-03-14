const translator = require("./ninja.translator.js");

const tabSwitch = function(walletTab) {
  if (walletTab.className.indexOf("selected") === -1) {
    // unselect all tabs
    const wallets = {
      brainwallet: require("./ninja.brainwallet.js"),
      bulkwallet: require("./ninja.bulkwallet.js"),
      detailwallet: require("./ninja.detailwallet.js"),
      paperwallet: require("./ninja.paperwallet.js"),
      singlewallet: require("./ninja.singlewallet.js")
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
      innerHTML =
        '<span style="color: #990000;">' +
        translator.get("securitychecklistofflineNOK") +
        "</span>";
      break;
    case "file:":
      innerHTML =
        '<span style="color: #009900;">' +
        translator.get("securitychecklistofflineOK") +
        "</span>";
      break;
    default:
  }
  document.getElementById("envSecurityCheck").innerHTML = innerHTML;
};

const browserSecurityCheck = function() {
  let innerHTML = "";
  if (window.crypto && window.crypto.getRandomValues) {
    innerHTML =
      '<span style="color: #009900;">' +
      translator.get("securitychecklistrandomOK") +
      "</span>";
  } else {
    innerHTML =
      '<span style="color: #990000;">' +
      translator.get("securitychecklistrandomNOK") +
      "</span>";
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

// use when passing an Array of Functions
const runSerialized = function(functions, onComplete) {
  onComplete = onComplete || function() {};

  if (functions.length === 0) onComplete();
  else {
    // run the first function, and make it call this
    // function when finished with the rest of the list
    const f = functions.shift();
    f(function() {
      runSerialized(functions, onComplete);
    });
  }
};

const forSerialized = function(initial, max, whatToDo, onComplete) {
  onComplete = onComplete || function() {};

  if (initial === max) {
    onComplete();
  } else {
    // same idea as runSerialized
    whatToDo(initial, function() {
      forSerialized(++initial, max, whatToDo, onComplete);
    });
  }
};

// use when passing an Object (dictionary) of Functions
const foreachSerialized = function(collection, whatToDo, onComplete) {
  const keys = [];
  for (const name in collection) {
    if ({}.hasOwnProperty.call(collection, name)) {
      keys.push(name);
    }
  }
  forSerialized(
    0,
    keys.length,
    function(i, callback) {
      whatToDo(keys[i], callback);
    },
    onComplete
  );
};

const toggleFaqQuestion = function(elementId) {
  const answerDiv = document.getElementById(elementId);
  answerDiv.style.display =
    answerDiv.style.display === "block" ? "none" : "block";
};

module.exports = {
  tabSwitch,
  envSecurityCheck,
  browserSecurityCheck,
  getQueryString,
  runSerialized,
  forSerialized,
  foreachSerialized,
  toggleFaqQuestion
};
