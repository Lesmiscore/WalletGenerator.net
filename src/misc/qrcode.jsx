import React from "react";
import { getTypeNumber } from "../ninja.qrcode";
import QRCode from "../qrcode.js";

module.exports = class QRCodeComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: props.value, size: props.size || 2, canvasSize: false };
  }
  render() {
    if (!this.state.canvasSize) {
      // we have to measure the size of QR code first
      return null;
    }
    return <canvas ref="canvas" width={this.state.canvasSize} height={this.state.canvasSize} />;
  }
  componentDidMount() {
    const sizeMultiplier = this.state.size; // default 2
    const text = this.state.value;
    // create the qrcode itself
    const typeNumber = getTypeNumber(text);
    const qrcode = new QRCode(typeNumber, QRCode.ErrorCorrectLevel.H);
    qrcode.addData(text);
    qrcode.make();
    const scale = 10.0;
    const canvasSize = qrcode.getModuleCount() * sizeMultiplier * scale;
    if (!this.state.canvasSize) {
      // it's time to notify the size of QR code
      this.setState({ canvasSize });
      return;
    }
    const canvas = this.refs.canvas;
    const ctx = canvas.getContext("2d");
    ctx.scale(scale, scale);
    // compute tile based on width/height
    const tile = canvasSize / qrcode.getModuleCount();
    // draw in the canvas
    for (let row = 0; row < qrcode.getModuleCount(); row++) {
      for (let col = 0; col < qrcode.getModuleCount(); col++) {
        ctx.fillStyle = qrcode.isDark(row, col) ? "#000000" : "#ffffff";
        ctx.fillRect(col * tile, row * tile, tile, tile);
      }
    }
  }
};
