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
    const ecPoint = elliptic.curves.secp256k1.decodePoint(
      Buffer.from(pubKeyHex, "hex")
    );
    const compressed = ecPoint.compressed && ecKey.compressed;
    // if both points are the same return null
    ecKey.compressed = false;
    if (ecPoint.eq(ecKey.Q)) {
      return null;
    }
    const bigInt = ecKey.d;
    const pubKey = ecPoint.mul(bigInt).encoded("buffer", compressed);
    return pubKey;
  },
  // used by unit test
  getDecompressedPubKeyHex: function(pubKeyHexComp) {
    const ecPoint = elliptic.curves.secp256k1.decodePoint(
      Buffer.from(pubKeyHexComp, "hex")
    );
    const pubByteArray = ecPoint.encoded("buffer", 0);
    const pubHexUncompressed = publicKey.getHexFromByteArray(pubByteArray);
    return pubHexUncompressed;
  }
});
