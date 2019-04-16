const path = require("path");

module.exports = {
  entry: "./src/init.js",
  mode: "development",
  output: {
    path: path.resolve(__dirname),
    filename: "exported.js"
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            plugins: ["transform-react-jsx"]
          }
        }
      }
    ]
  },
  node: {
    fs: "empty",
    net: "empty",
    tls: "empty"
  }
};
