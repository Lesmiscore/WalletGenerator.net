const janin = require("./lazy/janin.currency.js");

const isPublicKeyHexFormat = function(key) {
  key = key.toString();
  return janin().selectedCurrency.isPublicKeyHexFormat(key);
};
const getHexFromByteArray = function(pubKeyByteArray) {
  return Buffer.from(pubKeyByteArray)
    .toString("hex")
    .toUpperCase();
};

module.exports = {
  isPublicKeyHexFormat,
  getHexFromByteArray
};
