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

module.exports = {
  printMany,
  escapeRegExp,
  ev,
  onload
};
