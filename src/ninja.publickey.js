const publicKey = (module.exports = {
  isPublicKeyHexFormat: function(key) {
    key = key.toString();
    return (
      publicKey.isUncompressedPublicKeyHexFormat(key) ||
      ninja.publicKey.isCompressedPublicKeyHexFormat(key)
    );
  },
  // 130 characters [0-9A-F] starts with 04
  isUncompressedPublicKeyHexFormat: function(key) {
    key = key.toString();
    return /^04[A-Fa-f0-9]{128}$/.test(key);
  },
  // 66 characters [0-9A-F] starts with 02 or 03
  isCompressedPublicKeyHexFormat: function(key) {
    key = key.toString();
    return /^0[23][A-Fa-f0-9]{64}$/.test(key);
  },
  getBitcoinAddressFromByteArray: function(pubKeyByteArray) {
    var pubKeyHash = bitcoin.crypto.hash160(pubKeyByteArray);
    return bitcoin.address.toBase58Check(pubKeyHash, 0);
  },
  getHexFromByteArray: function(pubKeyByteArray) {
    return Buffer.from(pubKeyByteArray)
      .toString("hex")
      .toUpperCase();
  },
  getByteArrayFromAdding: function(pubKeyHex1, pubKeyHex2) {
    var curve = elliptic.curves.secp256k1;
    var ecPoint1 = curve.decodePoint(Buffer.from(pubKeyHex1, "hex"));
    var ecPoint2 = curve.decodePoint(Buffer.from(pubKeyHex2, "hex"));
    // if both points are the same return null
    if (ecPoint1.eq(ecPoint2)) return null;
    var compressed = ecPoint1.compressed && ecPoint2.compressed;
    var pubKey = ecPoint1.add(ecPoint2).getEncoded(compressed);
    return pubKey;
  },
  getByteArrayFromMultiplying: function(pubKeyHex, ecKey) {
    var ecPoint = elliptic.curves.secp256k1.decodePoint(
      Buffer.from(pubKeyHex, "hex")
    );
    var compressed = ecPoint.compressed && ecKey.compressed;
    // if both points are the same return null
    ecKey.compressed = false;
    if (ecPoint.eq(ecKey.Q)) {
      return null;
    }
    var bigInt = ecKey.d;
    var pubKey = ecPoint.mul(bigInt).encoded("buffer", compressed);
    return pubKey;
  },
  // used by unit test
  getDecompressedPubKeyHex: function(pubKeyHexComp) {
    var ecPoint = elliptic.curves.secp256k1.decodePoint(
      Buffer.from(pubKeyHexComp, "hex")
    );
    var pubByteArray = ecPoint.encoded("buffer", 0);
    var pubHexUncompressed = publicKey.getHexFromByteArray(pubByteArray);
    return pubHexUncompressed;
  }
});
