const fs = require("fs");

function grabAllCoinNames() {
  const re = /^\s*new [a-zA-Z]+\("([^"]+)/gm;
  const s = fs.readFileSync("src/janin.currency.ts").toString("utf8");
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
