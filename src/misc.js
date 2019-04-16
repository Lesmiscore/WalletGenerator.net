function printMany() {
  const paperwallet = require("./ninja.paperwallet.js");
  paperwallet.build(document.getElementById("paperpassphrase").value, 10, function() {
    window.print();
  });
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^=!:${}()|[\]/\\]/g, Buffer.from("5c2426", "hex").toString("utf8"));
}

function ev(selector, name, func) {
  const list = document.querySelectorAll(selector);
  Array.prototype.forEach.call(list, function(element) {
    element.addEventListener(name, func, false);
  });
}

function onload(func) {
  if (window.attachEvent) {
    window.attachEvent("onload", func);
  } else if (window.onload) {
    let curronload = window.onload;
    let newonload = function(evt) {
      curronload(evt);
      func(evt);
    };
    window.onload = newonload;
  } else {
    window.onload = func;
  }
}

function invoke(func) {
  if (typeof func === "function") {
    const args = Array.from(arguments).slice(1);
    return Function.prototype.apply(func, args);
  }
}

function toArray(obj) {
  if (Array.isArray(obj)) {
    return obj;
  } else {
    return [obj];
  }
}

module.exports = {
  printMany,
  escapeRegExp,
  ev,
  onload,
  invoke,
  toArray
};
