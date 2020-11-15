(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[37],{

/***/ "./src/coins/nem-sdk/address.js":
/*!**************************************!*\
  !*** ./src/coins/nem-sdk/address.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("/* WEBPACK VAR INJECTION */(function(Buffer) {const Network = __webpack_require__(/*! ./network */ \"./src/coins/nem-sdk/network.js\"); // https://stackoverflow.com/questions/36657354/cryptojs-sha3-and-php-sha3\n// CryptoJS's \"SHA3\" is now called \"Keccak\"\n\n\nconst Keccak = __webpack_require__(/*! keccak */ \"./node_modules/keccak/js.js\");\n\nconst bitcoinjsCrypto = __webpack_require__(/*! bitgo-utxo-lib */ \"./node_modules/bitgo-utxo-lib/src/index.js\").crypto; // NEM doesn't use bech32, but toWords/fromWords\n\n\nconst bech32 = __webpack_require__(/*! bech32 */ \"./node_modules/bech32/index.js\");\n\nconst alphabet = \"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567\";\n/**\n * Encode a Buffer to base32\n *\n * @param {Buffer} s - A buffer\n *\n * @return {string} - The encoded string\n */\n\nlet b32encode = function (s) {\n  let result = \"\";\n\n  for (const word of bech32.toWords(s)) {\n    result += alphabet[word];\n  }\n\n  return result;\n};\n/**\n * Decode a base32 string.\n * This is made specifically for our use, deals only with proper strings\n *\n * @param {string} s - A base32 string\n *\n * @return {Buffer} - The decoded string\n */\n\n\nlet b32decode = function (s) {\n  const words = [];\n\n  for (let idx = 0; idx < s.length; idx++) {\n    words.push(alphabet.indexOf(s.charAt(idx)));\n  }\n\n  return Buffer.from(bech32.fromWords(words));\n};\n/**\n * Convert a public key to a NEM address\n *\n * @param {Buffer} publicKey - A public key\n * @param {number} networkId - A network id\n *\n * @return {string} - The NEM address\n */\n\n\nlet toAddress = function (publicKey, networkId) {\n  let hash = Keccak(\"keccak256\").update(publicKey).digest();\n  let hash2 = bitcoinjsCrypto.ripemd160(hash); // 98 is for testnet\n\n  let networkPrefix = Buffer.from([networkId]);\n  let versionPrefixedRipemd160Hash = Buffer.concat([networkPrefix, hash2], 21);\n  let tempHash = Keccak(\"keccak256\").update(versionPrefixedRipemd160Hash).digest();\n  let stepThreeChecksum = tempHash.slice(0, 4);\n  let concatStepThreeAndStepSix = Buffer.concat([versionPrefixedRipemd160Hash, stepThreeChecksum]);\n  let ret = b32encode(concatStepThreeAndStepSix);\n  return ret;\n};\n/**\n * Check if an address is from a specified network\n *\n * @param {string} _address - An address\n * @param {number} networkId - A network id\n *\n * @return {boolean} - True if address is from network, false otherwise\n */\n\n\nlet isFromNetwork = function (_address, networkId) {\n  let address = _address.toString().toUpperCase().replace(/-/g, \"\");\n\n  let a = address[0];\n  return Network.id2Char(networkId) === a;\n};\n/**\n * Check if an address is valid\n *\n * @param {string} _address - An address\n *\n * @return {boolean} - True if address is valid, false otherwise\n */\n\n\nlet isValid = function (_address) {\n  let address = _address.toString().toUpperCase().replace(/-/g, \"\");\n\n  if (!address || address.length !== 40) {\n    return false;\n  }\n\n  let decoded = b32decode(address);\n  let versionPrefixedRipemd160Hash = decoded.slice(0, 21);\n  let tempHash = Keccak(\"keccak256\").update(versionPrefixedRipemd160Hash).digest();\n  let stepThreeChecksum = tempHash.slice(0, 4);\n  return stepThreeChecksum.equals(decoded.slice(21));\n};\n/**\n * Remove hyphens from an address\n *\n * @param {string} _address - An address\n *\n * @return {string} - A clean address\n */\n\n\nlet clean = function (_address) {\n  return _address.toUpperCase().replace(/-|\\s/g, \"\");\n};\n\nmodule.exports = {\n  b32encode,\n  b32decode,\n  toAddress,\n  isFromNetwork,\n  isValid,\n  clean\n};\n/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../../node_modules/node-libs-browser/node_modules/buffer/index.js */ \"./node_modules/node-libs-browser/node_modules/buffer/index.js\").Buffer))\n\n//# sourceURL=webpack:///./src/coins/nem-sdk/address.js?");

/***/ }),

/***/ "./src/coins/nem-sdk/helpers.js":
/*!**************************************!*\
  !*** ./src/coins/nem-sdk/helpers.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("let isHexadecimal = function (str) {\n  return str.match(\"^(0x|0X)?[a-fA-F0-9]+$\") !== null;\n};\n\nlet isPrivateKeyValid = function (privateKey) {\n  if (privateKey.length !== 64 && privateKey.length !== 66) {\n    return false;\n  } else if (!isHexadecimal(privateKey)) {\n    return false;\n  } else {\n    return true;\n  }\n};\n\nlet isPublicKeyValid = function (publicKey) {\n  if (publicKey.length !== 64) {\n    return false;\n  } else if (!isHexadecimal(publicKey)) {\n    return false;\n  } else {\n    return true;\n  }\n};\n\nmodule.exports = {\n  isHexadecimal,\n  isPrivateKeyValid,\n  isPublicKeyValid\n};\n\n//# sourceURL=webpack:///./src/coins/nem-sdk/helpers.js?");

/***/ }),

/***/ "./src/coins/nem-sdk/index.js":
/*!************************************!*\
  !*** ./src/coins/nem-sdk/index.js ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("module.exports = {\n  address: __webpack_require__(/*! ./address */ \"./src/coins/nem-sdk/address.js\"),\n  network: __webpack_require__(/*! ./network */ \"./src/coins/nem-sdk/network.js\"),\n  keyPair: __webpack_require__(/*! ./keyPair */ \"./src/coins/nem-sdk/keyPair.js\")\n};\n\n//# sourceURL=webpack:///./src/coins/nem-sdk/index.js?");

/***/ }),

/***/ "./src/coins/nem-sdk/keyPair.js":
/*!**************************************!*\
  !*** ./src/coins/nem-sdk/keyPair.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("/* WEBPACK VAR INJECTION */(function(Buffer) {const Helpers = __webpack_require__(/*! ./helpers */ \"./src/coins/nem-sdk/helpers.js\");\n\nconst elliptic = __webpack_require__(/*! elliptic */ \"./node_modules/elliptic/lib/elliptic.js\");\n\nconst Keccak = __webpack_require__(/*! keccak */ \"./node_modules/keccak/js.js\");\n\nconst BN = __webpack_require__(/*! bn.js */ \"./node_modules/bn.js/lib/bn.js\");\n\nconst ed25519 = new elliptic.eddsa(\"ed25519\"); // port of crypto_sign_keypair_hash with hashfunc inlined\n// https://github.com/NemProject/nem.core/blob/master/src/main/java/org/nem/core/crypto/ed25519/Ed25519Utils.java\n// https://github.com/NemProject/nem.core/blob/master/src/main/java/org/nem/core/crypto/ed25519/Ed25519KeyGenerator.java\n// https://github.com/NemProject/nem.core/blob/master/src/main/java/org/nem/core/model/Address.java\n\nfunction cryptoSignKeypairHash(sk) {\n  const rSK = Buffer.from(sk).reverse();\n  const d = Keccak(\"keccak512\").update(rSK).digest().slice(0, 32);\n  d[0] &= 248;\n  d[31] &= 127;\n  d[31] |= 64;\n  const point = ed25519.g.mul(new BN(d.reverse()));\n  const pk = ed25519.encodePoint(point);\n  return Buffer.from(pk);\n}\n/***\n * Create a KeyPair Object\n *\n * @param {string} privkey - An hex private key\n */\n\n\nlet KeyPair = function (privkey) {\n  this.secretKey = Buffer.from(privkey, \"hex\").slice(0, 32);\n  this.publicKey = cryptoSignKeypairHash(this.secretKey);\n};\n/**\n * Create a NEM KeyPair\n *\n * @param {string} hexdata - An hex private key\n *\n * @return {object} - The NEM KeyPair object\n */\n\n\nlet create = function (hexdata) {\n  // Errors\n  if (!hexdata) throw new Error(\"Missing argument !\");\n  if (!Helpers.isPrivateKeyValid(hexdata)) throw new Error(\"Private key is not valid !\"); // Processing\n\n  let r = new KeyPair(hexdata); // Result\n\n  return r;\n};\n\nmodule.exports = {\n  create\n};\n/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../../node_modules/node-libs-browser/node_modules/buffer/index.js */ \"./node_modules/node-libs-browser/node_modules/buffer/index.js\").Buffer))\n\n//# sourceURL=webpack:///./src/coins/nem-sdk/keyPair.js?");

/***/ }),

/***/ "./src/coins/nem-sdk/network.js":
/*!**************************************!*\
  !*** ./src/coins/nem-sdk/network.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("const alphabet = \"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567\";\n/**\n * Networks info data\n */\n\nconst data = {\n  mainnet: {\n    id: 104,\n    prefix: \"68\",\n    char: \"N\"\n  },\n  testnet: {\n    id: -104,\n    prefix: \"98\",\n    char: \"T\"\n  },\n  mijin: {\n    id: 96,\n    prefix: \"60\",\n    char: \"M\"\n  }\n};\n/**\n * Gets a network prefix from network id\n *\n * @param {number} id - A network id\n *\n * @return {string} - The network prefix\n */\n\nlet id2Prefix = function (id) {\n  return (id & 0xff).toString(16);\n};\n/**\n * Gets the starting char of the addresses of a network id\n *\n * @param {number} id - A network id\n *\n * @return {string} - The starting char of addresses\n */\n\n\nlet id2Char = function (id) {\n  // it works with -104 or 152 to get \"T\" for an example\n  return alphabet[(id & 0xf8) >> 3];\n};\n/**\n * Gets the network id from the starting char of an address\n *\n * @param {string} startChar - A starting char from an address\n *\n * @return {number} - The network id\n */\n\n\nlet char2Id = function (startChar) {\n  // NOTE: it returns 152 for input \"T\", but it's essentially same\n  //      (whether it is signed or not in 8-bit integer)\n  return alphabet.indexOf(startChar) << 3;\n};\n/**\n * Gets the network version\n *\n * @param {number} val - A version number (1 or 2)\n * @param {number} network - A network id\n *\n * @return {number} - A network version\n */\n\n\nlet getVersion = function (val, network) {\n  return (network & 0xff) << 24 | val;\n};\n\nmodule.exports = {\n  data,\n  id2Prefix,\n  id2Char,\n  char2Id,\n  getVersion\n};\n\n//# sourceURL=webpack:///./src/coins/nem-sdk/network.js?");

/***/ }),

/***/ 0:
/*!**********************!*\
  !*** util (ignored) ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("/* (ignored) */\n\n//# sourceURL=webpack:///util_(ignored)?");

/***/ }),

/***/ 1:
/*!**********************!*\
  !*** util (ignored) ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("/* (ignored) */\n\n//# sourceURL=webpack:///util_(ignored)?");

/***/ }),

/***/ 10:
/*!************************!*\
  !*** buffer (ignored) ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("/* (ignored) */\n\n//# sourceURL=webpack:///buffer_(ignored)?");

/***/ }),

/***/ 11:
/*!************************!*\
  !*** buffer (ignored) ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("/* (ignored) */\n\n//# sourceURL=webpack:///buffer_(ignored)?");

/***/ }),

/***/ 12:
/*!************************!*\
  !*** buffer (ignored) ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("/* (ignored) */\n\n//# sourceURL=webpack:///buffer_(ignored)?");

/***/ }),

/***/ 13:
/*!************************!*\
  !*** buffer (ignored) ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("/* (ignored) */\n\n//# sourceURL=webpack:///buffer_(ignored)?");

/***/ }),

/***/ 2:
/*!**********************!*\
  !*** util (ignored) ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("/* (ignored) */\n\n//# sourceURL=webpack:///util_(ignored)?");

/***/ }),

/***/ 3:
/*!**********************!*\
  !*** util (ignored) ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("/* (ignored) */\n\n//# sourceURL=webpack:///util_(ignored)?");

/***/ }),

/***/ 4:
/*!************************!*\
  !*** buffer (ignored) ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("/* (ignored) */\n\n//# sourceURL=webpack:///buffer_(ignored)?");

/***/ }),

/***/ 5:
/*!************************!*\
  !*** buffer (ignored) ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("/* (ignored) */\n\n//# sourceURL=webpack:///buffer_(ignored)?");

/***/ }),

/***/ 6:
/*!************************!*\
  !*** crypto (ignored) ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("/* (ignored) */\n\n//# sourceURL=webpack:///crypto_(ignored)?");

/***/ }),

/***/ 7:
/*!************************!*\
  !*** buffer (ignored) ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("/* (ignored) */\n\n//# sourceURL=webpack:///buffer_(ignored)?");

/***/ }),

/***/ 8:
/*!************************!*\
  !*** buffer (ignored) ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("/* (ignored) */\n\n//# sourceURL=webpack:///buffer_(ignored)?");

/***/ }),

/***/ 9:
/*!************************!*\
  !*** buffer (ignored) ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("/* (ignored) */\n\n//# sourceURL=webpack:///buffer_(ignored)?");

/***/ })

}]);