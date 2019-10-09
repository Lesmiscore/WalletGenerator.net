const { Modernizr } = require("./../../autogen/modernizr");
const render = function(qrcode, sizeMultiplier) {
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

module.exports = { render, available: Modernizr.canvas };
