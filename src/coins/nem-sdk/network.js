const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

/**
 * Networks info data
 */
const data = {
  mainnet: {
    id: 104,
    prefix: "68",
    char: "N",
  },
  testnet: {
    id: -104,
    prefix: "98",
    char: "T",
  },
  mijin: {
    id: 96,
    prefix: "60",
    char: "M",
  },
};

/**
 * Gets a network prefix from network id
 *
 * @param {number} id - A network id
 *
 * @return {string} - The network prefix
 */
function id2Prefix(id) {
  return (id & 0xff).toString(16);
}

/**
 * Gets the starting char of the addresses of a network id
 *
 * @param {number} id - A network id
 *
 * @return {string} - The starting char of addresses
 */
function id2Char(id) {
  // it works with -104 or 152 to get "T" for an example
  return alphabet[(id & 0xf8) >> 3];
}

/**
 * Gets the network id from the starting char of an address
 *
 * @param {string} startChar - A starting char from an address
 *
 * @return {number} - The network id
 */
function char2Id(startChar) {
  // NOTE: it returns 152 for input "T", but it's essentially same
  //      (whether it is signed or not in 8-bit integer)
  return alphabet.indexOf(startChar) << 3;
}

/**
 * Gets the network version
 *
 * @param {number} val - A version number (1 or 2)
 * @param {number} network - A network id
 *
 * @return {number} - A network version
 */
function getVersion(val, network) {
  return ((network & 0xff) << 24) | val;
}

module.exports = {
  data,
  id2Prefix,
  id2Char,
  char2Id,
  getVersion,
};
