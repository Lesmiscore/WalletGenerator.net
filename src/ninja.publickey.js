const bitcoin = require("bitcoinjs-lib");
const elliptic = require("elliptic");
const janin = require("./lazy/janin.currency.js");

const publicKey = (module.exports = {
  isPublicKeyHexFormat: function(key) {
    key = key.toString();
    return janin().selectedCurrency.isPublicKeyHexFormat(key);
  },
  getBitcoinAddressFromByteArray: function(pubKeyByteArray) {
    const pubKeyHash = bitcoin.crypto.hash160(pubKeyByteArray);
    return bitcoin.address.toBase58Check(pubKeyHash, 0);
  },
  getHexFromByteArray: function(pubKeyByteArray) {
    return Buffer.from(pubKeyByteArray)
      .toString("hex")
      .toUpperCase();
  },
  getByteArrayFromAdding: function(pubKeyHex1, pubKeyHex2) {
    const curve = elliptic.curves.secp256k1;
    const ecPoint1 = curve.decodePoint(Buffer.from(pubKeyHex1, "hex"));
    const ecPoint2 = curve.decodePoint(Buffer.from(pubKeyHex2, "hex"));
    // if both points are the same return null
    if (ecPoint1.eq(ecPoint2)) return null;
    const compressed = ecPoint1.compressed && ecPoint2.compressed;
    const pubKey = ecPoint1.add(ecPoint2).getEncoded(compressed);
    return pubKey;
  },
  getByteArrayFromMultiplying: function(pubKeyHex, ecKey) {
    const ecPoint = elliptic.curves.secp256k1.decodePoint(Buffer.from(pubKeyHex, "hex"));
    const compressed = ecPoint.compressed && ecKey.compressed;
    // if both points are the same return null
    ecKey.compressed = false;
    if (ecPoint.eq(ecKey.Q)) {
      return null;
    }
    const bigInt = ecKey.d;
    const pubKey = ecPoint.mul(bigInt).encoded("buffer", compressed);
    return pubKey;
  }
});
