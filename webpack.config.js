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
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            plugins: ["@babel/plugin-proposal-optional-chaining"],
          },
        },
      },
      { test: /\.styl$/, loaders: ["style-loader", "css-loader", "stylus-loader"], exclude: /node_modules/ },
      { test: /\.css$/, loaders: ["style-loader", "css-loader"] },
      {
        test: /\.(jpg|png|gif)$/,
        loaders: ["file-loader"],
      },
    ],
  },
  node: {
    fs: "empty",
    net: "empty",
    tls: "empty",
    http: "mock",
    https: "mock",
  },
  resolve: {
    alias: {
      http: "@nao20010128nao/void-http",
      https: "@nao20010128nao/void-http",
      "node-fetch": "@nao20010128nao/void-fetch",
      "whatwg-fetch": "@nao20010128nao/void-fetch",
      axios: "@nao20010128nao/void-axios",
    },
  },
  plugins: [new CleanWebpackPlugin()],
};
