const Network = require("./network");
// https://stackoverflow.com/questions/36657354/cryptojs-sha3-and-php-sha3
// CryptoJS's "SHA3" is now called "Keccak"
const Keccak = require("keccak");
const bitcoinjsCrypto = require("bitgo-utxo-lib").crypto;
// NEM doesn't use bech32, but toWords/fromWords
const bech32 = require("bech32");

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

/**
 * Encode a Buffer to base32
 *
 * @param {Buffer} s - A buffer
 *
 * @return {string} - The encoded string
 */
let b32encode = function (s) {
  let result = "";
  for (const word of bech32.toWords(s)) {
    result += alphabet[word];
  }
  return result;
};

/**
 * Decode a base32 string.
 * This is made specifically for our use, deals only with proper strings
 *
 * @param {string} s - A base32 string
 *
 * @return {Buffer} - The decoded string
 */
let b32decode = function (s) {
  const words = [];
  for (let idx = 0; idx < s.length; idx++) {
    words.push(alphabet.indexOf(s.charAt(idx)));
  }
  return Buffer.from(bech32.fromWords(words));
};

/**
 * Convert a public key to a NEM address
 *
 * @param {Buffer} publicKey - A public key
 * @param {number} networkId - A network id
 *
 * @return {string} - The NEM address
 */
let toAddress = function (publicKey, networkId) {
  let hash = Keccak("keccak256").update(publicKey).digest();
  let hash2 = bitcoinjsCrypto.ripemd160(hash);
  // 98 is for testnet
  let networkPrefix = Buffer.from([networkId]);
  let versionPrefixedRipemd160Hash = Buffer.concat([networkPrefix, hash2], 21);
  let tempHash = Keccak("keccak256").update(versionPrefixedRipemd160Hash).digest();
  let stepThreeChecksum = tempHash.slice(0, 4);
  let concatStepThreeAndStepSix = Buffer.concat([versionPrefixedRipemd160Hash, stepThreeChecksum]);
  let ret = b32encode(concatStepThreeAndStepSix);
  return ret;
};

/**
 * Check if an address is from a specified network
 *
 * @param {string} _address - An address
 * @param {number} networkId - A network id
 *
 * @return {boolean} - True if address is from network, false otherwise
 */
let isFromNetwork = function (_address, networkId) {
  let address = _address.toString().toUpperCase().replace(/-/g, "");
  let a = address[0];
  return Network.id2Char(networkId) === a;
};

/**
 * Check if an address is valid
 *
 * @param {string} _address - An address
 *
 * @return {boolean} - True if address is valid, false otherwise
 */
let isValid = function (_address) {
  let address = _address.toString().toUpperCase().replace(/-/g, "");
  if (!address || address.length !== 40) {
    return false;
  }
  let decoded = b32decode(address);
  let versionPrefixedRipemd160Hash = decoded.slice(0, 21);
  let tempHash = Keccak("keccak256").update(versionPrefixedRipemd160Hash).digest();
  let stepThreeChecksum = tempHash.slice(0, 4);

  return stepThreeChecksum.equals(decoded.slice(21));
};

/**
 * Remove hyphens from an address
 *
 * @param {string} _address - An address
 *
 * @return {string} - A clean address
 */
let clean = function (_address) {
  return _address.toUpperCase().replace(/-|\s/g, "");
};

module.exports = {
  b32encode,
  b32decode,
  toAddress,
  isFromNetwork,
  isValid,
  clean,
};
