const fs = require("fs");
const { versions } = require("process");

function grabAllCoinNames() {
  const re = /^\s+new [a-zA-Z]+\("([^"]+)/g;
  const s = fs.readFileSync("src/janin.currency.js").toString("utf8");
  const coins = [];
  let m;
  while ((m = re.exec(s))) {
    coins.push(m[1]);
  }
  return coins;
}

module.exports = {
  grabAllCoinNames,
};
