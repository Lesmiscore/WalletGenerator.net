const fs = require("fs");
const { Parser } = require("acorn");
const walk = require("acorn-walk");
const OPC = require("acorn-optional-chaining");

walk.base.OptionalMemberExpression = (node, st, c) => {
  if (node.object) c(node.object, st);
  if (node.property) c(node.property, st);
};

function grabAllCoinNames() {
  const re = /^\s*new [a-zA-Z]+\("([^"]+)/gm;
  const s = fs.readFileSync("src/janin.currency.js").toString("utf8");
  const coins = [];
  let m;
  while ((m = re.exec(s))) {
    coins.push(m[1]);
  }
  return coins;
}
function grabAllCoinNames2() {
  const s = fs.readFileSync("src/janin.currency.js").toString("utf8");
  const rawTree = Parser.extend(OPC).parse(s, { ecmaVersion: 2021 });
  // example of minimal expected code:
  // let currencies = [
  //   new Bitcoin("Bitcoin")
  // ];
  const result = [];
  walk.simple(rawTree, {
    VariableDeclarator(varNode) {
      if (varNode.id.name === "currencies") {
        walk.simple(rawTree, {
          NewExpression(newExprNode) {
            if (!newExprNode.arguments[0].value) {
              return;
            }
            result.push(newExprNode.arguments[0].value);
          },
        });
      }
    },
  });
  return result;
}

module.exports = {
  grabAllCoinNames,
  grabAllCoinNames2,
};
