const tabSwitch = async function (walletTab) {
  if (walletTab.className.indexOf("selected") === -1) {
    // unselect all tabs
    const wallets = {
      brainwallet: await import("./ninja.brainwallet.js"),
      bulkwallet: await import("./ninja.bulkwallet.js"),
      detailwallet: await import("./ninja.detailwallet.js"),
      paperwallet: await import("./ninja.paperwallet.js"),
      singlewallet: await import("./ninja.singlewallet.js"),
      donate: await import("./ninja.donatetab.js"),
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

const envSecurityCheck = async function () {
  const translator = await import("./ninja.translator.js");
  let innerElement = createElement("div", {});
  switch (window.location.protocol) {
    case "http:":
    case "https:":
      innerElement = createElement(
        "span",
        {
          style: "color: #990000;",
        },
        translator.get("securitychecklistofflineNOK")
      );
      break;
    case "file:":
      innerElement = createElement(
        "span",
        {
          style: "color: #009900;",
        },
        translator.get("securitychecklistofflineOK")
      );
      break;
    default:
  }
  document.getElementById("envSecurityCheck").appendChild(innerElement);
};

const browserSecurityCheck = async function () {
  const translator = await import("./ninja.translator.js");
  let innerElement;
  if (typeof window?.crypto?.getRandomValues === "function") {
    innerElement = createElement(
      "span",
      {
        style: "color: #009900;",
      },
      translator.get("securitychecklistrandomOK")
    );
  } else {
    innerElement = createElement(
      "span",
      {
        style: "color: #990000;",
      },
      translator.get("securitychecklistrandomNOK")
    );
  }
  document.getElementById("browserSecurityCheck").appendChild(innerElement);
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

const printMany = async function () {
  const paperwallet = await import("./ninja.paperwallet.js");
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

const createElement = function (n, v, content) {
  const el = document.createElement(n);
  for (const p in v) {
    if ({}.hasOwnProperty.call(v, p) && v[p] !== undefined) {
      el.setAttribute(p, v[p]);
    }
  }
  if (content !== undefined) {
    if (!Array.isArray(content)) {
      content = [content];
    }
    for (let c of content) {
      if (!c) {
        continue;
      } else if (typeof c === "string") {
        c = document.createTextNode(c);
      }
      el.appendChild(c);
    }
  }
  return el;
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
  createElement,
};
