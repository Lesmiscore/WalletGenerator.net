// special webpack configuration for generating only one JS file
const base = require("./webpack.config.singlescript.js");

module.exports = {
  ...base,
  module: {
    rules: [
      ...base.module.rules.slice(0, -1),
      {
        test: /\.(jpg|png|gif)$/,
        use: [
          {
            loader: "url-loader",
            options: {},
          },
        ],
      },
    ],
  },
};
