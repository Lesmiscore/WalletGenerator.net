const path = require("path");

module.exports = {
  entry: "./src/init.js",
  mode: "production",
  output: {
    path: path.resolve(__dirname, "public"),
    filename: "main.js"
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
      },
      { test: /\.css$/, loaders: ["style-loader", "css-loader"], exclude: /node_modules/ },
      {
        test: /\.(jpg|png|gif)$/,
        loaders: ["file-loader"]
      }
    ]
  },
  node: {
    fs: "empty",
    net: "empty",
    tls: "empty",
    http: "mock",
    https: "mock"
  }
};
