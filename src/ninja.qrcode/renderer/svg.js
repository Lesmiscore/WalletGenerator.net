const BN = require("bignumber.js");

const { Modernizr } = require("./../../autogen/modernizr");
const render = function(qr, sizeMultiplier) {
  // https://stackoverflow.com/questions/20539196/creating-svg-elements-dynamically-with-javascript-inside-html
  const modCount = qr.getModuleCount();
  const size = +new BN(modCount).times(sizeMultiplier);
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
      width: "100%",
      height: "100%",
      fill: "#fff"
    })
  );
  const rect = "l" + sizeMultiplier + ",0 0," + sizeMultiplier + " -" + sizeMultiplier + ",0 0,-" + sizeMultiplier + "z ";
  let path = "";
  for (let r = 0; r < modCount; r += 1) {
    const mr = +new BN(r).times(sizeMultiplier);
    for (let c = 0; c < modCount; c += 1) {
      if (qr.isDark(r, c)) {
        const mc = +new BN(c).times(sizeMultiplier);
        path += "M" + mc + "," + mr + rect;
      }
    }
  }

  root.appendChild(
    getNode("path", {
      d: path,
      stroke: "transparent",
      fill: "#000"
    })
  );
  return root;
};

module.exports = { render, available: Modernizr.svg };
