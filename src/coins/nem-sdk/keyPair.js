const Helpers = require("./helpers");

const elliptic = require("elliptic");
const { Keccak } = require("sha3");
const BN = require("bn.js");
const ed25519 = new elliptic.eddsa("ed25519");

// port of crypto_sign_keypair_hash with hashfunc inlined
// https://github.com/NemProject/nem.core/blob/master/src/main/java/org/nem/core/crypto/ed25519/Ed25519Utils.java
// https://github.com/NemProject/nem.core/blob/master/src/main/java/org/nem/core/crypto/ed25519/Ed25519KeyGenerator.java
// https://github.com/NemProject/nem.core/blob/master/src/main/java/org/nem/core/model/Address.java
function cryptoSignKeypairHash(sk) {
  const d = new Keccak(512).update(sk).digest().slice(0, 32);
  d[0] &= 248;
  d[31] &= 127;
  d[31] |= 64;

  const point = ed25519.g.mul(new BN(d));
  const pk = ed25519.encodePoint(point);
  return Buffer.from(pk);
}

/***
 * Create a KeyPair Object
 *
 * @param {string} privkey - An hex private key
 */
let KeyPair = function (privkey) {
  this.secretKey = Buffer.from(privkey, "hex").slice(0, 32);
  this.publicKey = cryptoSignKeypairHash(this.secretKey);
};

/**
 * Create a NEM KeyPair
 *
 * @param {string} hexdata - An hex private key
 *
 * @return {object} - The NEM KeyPair object
 */
let create = function (hexdata) {
  // Errors
  if (!hexdata) throw new Error("Missing argument !");
  if (!Helpers.isPrivateKeyValid(hexdata)) throw new Error("Private key is not valid !");
  // Processing
  let r = new KeyPair(hexdata);
  // Result
  return r;
};

module.exports = {
  create,
};
