const { Modernizr } = require("./../../autogen/modernizr");
const render = function(qr, sizeMultiplier) {
  // https://stackoverflow.com/questions/20539196/creating-svg-elements-dynamically-with-javascript-inside-html
  const modCount = qr.getModuleCount();
  const size = modCount * sizeMultiplier;
  const ns = "http://www.w3.org/2000/svg";
  function getNode(n, v) {
    n = document.createElementNS(ns, n);
    for (const p in v) {
      if ({}.hasOwnProperty.call(v, p)) {
        n.setAttributeNS(null, p, v[p]);
      }
    }
    return n;
  }
  let root = getNode("svg");
  root.style.width = size + "px";
  root.style.height = size + "px";
  root.appendChild(
    getNode("rect", {
      x: 0,
      y: 0,
      width: size,
      height: size,
      fill: "#fff"
    })
  );
  for (let c = 0; c < modCount; c++) {
    for (let r = 0; r < modCount; r++) {
      if (qr.isDark(r, c)) {
        root.appendChild(
          getNode("rect", {
            x: c * sizeMultiplier,
            y: r * sizeMultiplier,
            width: sizeMultiplier,
            height: sizeMultiplier,
            fill: "#000"
          })
        );
      }
    }
  }
  return root;
};

module.exports = { render, available: Modernizr.svg };
