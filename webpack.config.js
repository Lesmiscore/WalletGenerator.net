const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  entry: "./src/init.js",
  mode: "production",
  output: {
    path: path.resolve(__dirname, "public"),
    filename: "main.js",
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            plugins: ["@babel/plugin-syntax-top-level-await", "@babel/plugin-proposal-optional-chaining"],
          },
        },
      },
      { test: /\.styl$/, use: ["style-loader", "css-loader", "stylus-loader"] },
      { test: /\.css$/, use: ["style-loader", "css-loader"] },
      {
        test: /\.(jpg|png|gif)$/,
        use: ["file-loader"],
      },
    ],
  },
  resolve: {
    alias: {
      http: "@nao20010128nao/void-http",
      https: "@nao20010128nao/void-http",
      "node-fetch": "@nao20010128nao/void-fetch",
      "whatwg-fetch": "@nao20010128nao/void-fetch",
      axios: "@nao20010128nao/void-axios",
      crypto: "crypto-browserify",
      stream: "stream-browserify",
      vm: "vm-browserify",
    },
  },
  experiments: {
    topLevelAwait: true,
  },
  plugins: [new CleanWebpackPlugin()],
};
