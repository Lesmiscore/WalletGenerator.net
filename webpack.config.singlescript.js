const base = require("./webpack.config.js");
const webpack = require("webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  ...base,
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.DefinePlugin({
      // required because defer doesn't work on inline <script>
      BEGIN_AFTER_ONLOAD: JSON.stringify(true),
    }),
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1,
    }),
  ],
};
