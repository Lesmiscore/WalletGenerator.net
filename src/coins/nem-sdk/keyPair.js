const Helpers = require("./helpers");

const elliptic = require("elliptic");
const { Keccak } = require("sha3");

const ed25519 = new elliptic.eddsa("ed25519");
ed25519.hash = () => new Keccak(512);

// port of crypto_sign_keypair_hash with hashfunc inlined
function cryptoSignKeypairHash(sk) {
  const d = new Keccak(512).update(sk).digest();
  d[0] &= 248;
  d[31] &= 127;
  d[31] |= 64;

  const pk = ed25519.keyFromSecret(d).getPublic();
  return Buffer.from(pk);
}

/***
 * Create a KeyPair Object
 *
 * @param {string} privkey - An hex private key
 */
let KeyPair = function (privkey) {
  this.secretKey = Buffer.from(privkey, "hex").reverse();
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
