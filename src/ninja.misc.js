module.exports = {
  tabSwitch: function(walletTab) {
    if (walletTab.className.indexOf("selected") == -1) {
      // unselect all tabs
      for (var wType in ninja.wallets) {
        document.getElementById(wType).className = "tab";
        wallets[wType].close();
      }
      walletTab.className += " selected";
      wallets[walletTab.getAttribute("id")].open();
    }
  },

  envSecurityCheck: function() {
    var innerHTML = "";
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
  },

  browserSecurityCheck: function() {
    var innerHTML = "";
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
  },

  getQueryString: function() {
    var result = {},
      queryString = location.search.substring(1),
      re = /([^&=]+)=([^&]*)/g,
      m;
    while ((m = re.exec(queryString))) {
      result[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
    }
    return result;
  },

  // use when passing an Array of Functions
  runSerialized: function(functions, onComplete) {
    onComplete = onComplete || function() {};

    if (functions.length === 0) onComplete();
    else {
      // run the first function, and make it call this
      // function when finished with the rest of the list
      var f = functions.shift();
      f(function() {
        runSerialized(functions, onComplete);
      });
    }
  },

  forSerialized: function(initial, max, whatToDo, onComplete) {
    onComplete = onComplete || function() {};

    if (initial === max) {
      onComplete();
    } else {
      // same idea as runSerialized
      whatToDo(initial, function() {
        forSerialized(++initial, max, whatToDo, onComplete);
      });
    }
  },

  // use when passing an Object (dictionary) of Functions
  foreachSerialized: function(collection, whatToDo, onComplete) {
    var keys = [];
    for (var name in collection) {
      keys.push(name);
    }
    forSerialized(
      0,
      keys.length,
      function(i, callback) {
        whatToDo(keys[i], callback);
      },
      onComplete
    );
  },

  toggleFaqQuestion: function(elementId) {
    var answerDiv = document.getElementById(elementId);
    answerDiv.style.display =
      answerDiv.style.display == "block" ? "none" : "block";
  }
};
