const base = require("./webpack.config.js");
const webpack = require("webpack");

module.exports = {
  ...base,
  plugins: [
    ...base.plugins,
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1,
    }),
  ],
};
