const QRCode = require("./qrcode.js");
const { Modernizr } = require("./autogen/modernizr");

// determine which type number is big enough for the input text length
const getTypeNumber = function(text) {
  const lengthCalculation = text.length * 8 + 12; // length as calculated by the QRCode
  if (lengthCalculation < 72) {
    return 1;
  } else if (lengthCalculation < 128) {
    return 2;
  } else if (lengthCalculation < 208) {
    return 3;
  } else if (lengthCalculation < 288) {
    return 4;
  } else if (lengthCalculation < 368) {
    return 5;
  } else if (lengthCalculation < 480) {
    return 6;
  } else if (lengthCalculation < 528) {
    return 7;
  } else if (lengthCalculation < 688) {
    return 8;
  } else if (lengthCalculation < 800) {
    return 9;
  } else if (lengthCalculation < 976) {
    return 10;
  }
  return null;
};

const createCanvas = function(text, sizeMultiplier) {
  sizeMultiplier = !sizeMultiplier ? 2 : sizeMultiplier; // default 2
  // create the qrcode itself
  const typeNumber = getTypeNumber(text);
  const qrcode = new QRCode(typeNumber, QRCode.ErrorCorrectLevel.H);
  qrcode.addData(text);
  qrcode.make();
  const modCount = qrcode.getModuleCount();
  const size = modCount * sizeMultiplier;
  // create canvas element
  const canvas = document.createElement("canvas");
  const scale = 10.0;
  canvas.width = size * scale;
  canvas.height = size * scale;
  canvas.style.width = size + "px";
  canvas.style.height = size + "px";
  const ctx = canvas.getContext("2d");
  ctx.scale(scale, scale);
  // compute tileW/tileH based on width/height
  const tile = sizeMultiplier;
  // draw in the canvas
  for (let row = 0; row < modCount; row++) {
    for (let col = 0; col < modCount; col++) {
      ctx.fillStyle = qrcode.isDark(row, col) ? "#000000" : "#ffffff";
      ctx.fillRect(col * tile, row * tile, tile, tile);
    }
  }
  // return just built canvas
  return canvas;
};

// generate a QRCode and return it's representation as a table
const createTable = function(text) {
  const typeNumber = getTypeNumber(text);
  const qr = new QRCode(typeNumber, QRCode.ErrorCorrectLevel.H);
  qr.addData(text);
  qr.make();
  const modCount = qr.getModuleCount();

  function getNode(n, v) {
    n = document.createElement(n);
    for (const p in v) {
      if ({}.hasOwnProperty.call(v, p)) {
        n.setAttribute(null, p, v[p]);
      }
    }
    return n;
  }

  const root = getNode("table", { class: "qrcodetable" });
  for (let r = 0; r < modCount; r++) {
    const tr = getNode("tr");
    for (let c = 0; c < modCount; c++) {
      if (qr.isDark(r, c)) {
        tr.appendChild(getNode("td", { class: "qrcodetddark" }));
      } else {
        tr.appendChild(getNode("td", { class: "qrcodetdlight" }));
      }
    }
    root.appendChild(tr);
  }
  return root;
};

// generate a QRCode and return it's representation as a svg
const createSvg = function(text, sizeMultiplier) {
  // https://stackoverflow.com/questions/20539196/creating-svg-elements-dynamically-with-javascript-inside-html
  const typeNumber = getTypeNumber(text);
  const qr = new QRCode(typeNumber, QRCode.ErrorCorrectLevel.H);
  qr.addData(text);
  qr.make();
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

// show QRCodes with canvas OR table (IE8)
// parameter: keyValuePair
// example: { "id1": "string1", "id2": "string2"}
//		"id1" is the id of a div element where you want a QRCode inserted.
//		"string1" is the string you want encoded into the QRCode.
const showQrCode = function(keyValuePair, sizeMultiplier) {
  for (const key in keyValuePair) {
    if ({}.hasOwnProperty.call(keyValuePair, key)) {
      const value = keyValuePair[key];
      document.getElementById(key).innerHTML = "";
      if (Modernizr.svg) {
        // method 1: SVG
        document.getElementById(key).appendChild(createSvg(value, sizeMultiplier));
      } else if (Modernizr.canvas) {
        // method 2: Canvas
        document.getElementById(key).appendChild(createCanvas(value, sizeMultiplier));
      } else {
        // method 3: <table>
        document.getElementById(key).appendChild(createTable(value));
      }
    }
  }
};

module.exports = {
  getTypeNumber,
  createCanvas,
  createTable,
  showQrCode
};
