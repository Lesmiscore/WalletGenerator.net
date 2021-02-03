(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[39],{

/***/ "./src/coins/zcash/_sha256.js":
/*!************************************!*\
  !*** ./src/coins/zcash/_sha256.js ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("// https://github.com/howardwu/zcash-wallet/blob/master/src/sha256.js\n\n/**\n * This file, from the `sha256` library, was ported and modified to support\n * SHA256 pre-processing as an optional flag. All original attribution goes to\n * JP Richardson (MIT License) and authors mentioned in the file.\n *\n * Please note that the `sha256` library has been deprecated in favor of the\n * built-in `crypto` Node.js library. See https://www.npmjs.com/package/sha256\n * for documentation and relevant deprecation warnings.\n */\n(function () {\n  \"use strict\";\n\n  const _imports = {};\n  _imports.bytesToHex = __webpack_require__(/*! convert-hex */ \"./node_modules/convert-hex/convert-hex.js\").bytesToHex;\n  _imports.convertString = __webpack_require__(/*! convert-string */ \"./node_modules/convert-string/convert-string.js\");\n  module.exports = sha256;\n  /*\n  CryptoJS v3.1.2\n  code.google.com/p/crypto-js\n  (c) 2009-2013 by Jeff Mott. All rights reserved.\n  code.google.com/p/crypto-js/wiki/License\n  */\n  // Initialization round constants tables\n\n  const K = []; // Compute constants\n\n  function isPrime(n) {\n    const sqrtN = Math.sqrt(n);\n\n    for (let factor = 2; factor <= sqrtN; factor++) {\n      if (!(n % factor)) return false;\n    }\n\n    return true;\n  }\n\n  function getFractionalBits(n) {\n    return (n - (n | 0)) * 0x100000000 | 0;\n  }\n\n  let n = 2;\n  let nPrime = 0;\n\n  while (nPrime < 64) {\n    if (isPrime(n)) {\n      K[nPrime] = getFractionalBits(Math.pow(n, 1 / 3));\n      nPrime++;\n    }\n\n    n++;\n  }\n\n  const bytesToWords = function (bytes) {\n    const words = [];\n\n    for (let i = 0, b = 0; i < bytes.length; i++, b += 8) {\n      words[b >>> 5] |= bytes[i] << 24 - b % 32;\n    }\n\n    return words;\n  };\n\n  const wordsToBytes = function (words) {\n    const bytes = [];\n\n    for (let b = 0; b < words.length * 32; b += 8) {\n      bytes.push(words[b >>> 5] >>> 24 - b % 32 & 0xff);\n    }\n\n    return bytes;\n  };\n\n  const preprocessBlock = function (bytes) {\n    const m = bytesToWords(bytes);\n    const l = bytes.length * 8;\n    m[l >> 5] |= 0x80 << 24 - l % 32;\n    m[(l + 64 >> 9 << 4) + 15] = l;\n    return m;\n  }; // Reusable object\n\n\n  const W = [];\n\n  const processBlock = function (H, M, offset) {\n    // Working variables\n    let a = H[0];\n    let b = H[1];\n    let c = H[2];\n    let d = H[3];\n    let e = H[4];\n    let f = H[5];\n    let g = H[6];\n    let h = H[7]; // Computation\n\n    for (let i = 0; i < 64; i++) {\n      if (i < 16) {\n        W[i] = M[offset + i] | 0;\n      } else {\n        const gamma0x = W[i - 15];\n        const gamma0 = (gamma0x << 25 | gamma0x >>> 7) ^ (gamma0x << 14 | gamma0x >>> 18) ^ gamma0x >>> 3;\n        const gamma1x = W[i - 2];\n        const gamma1 = (gamma1x << 15 | gamma1x >>> 17) ^ (gamma1x << 13 | gamma1x >>> 19) ^ gamma1x >>> 10;\n        W[i] = gamma0 + W[i - 7] + gamma1 + W[i - 16];\n      }\n\n      const ch = e & f ^ ~e & g;\n      const maj = a & b ^ a & c ^ b & c;\n      const sigma0 = (a << 30 | a >>> 2) ^ (a << 19 | a >>> 13) ^ (a << 10 | a >>> 22);\n      const sigma1 = (e << 26 | e >>> 6) ^ (e << 21 | e >>> 11) ^ (e << 7 | e >>> 25);\n      const t1 = h + sigma1 + ch + K[i] + W[i];\n      const t2 = sigma0 + maj;\n      h = g;\n      g = f;\n      f = e;\n      e = d + t1 | 0;\n      d = c;\n      c = b;\n      b = a;\n      a = t1 + t2 | 0;\n    } // Intermediate hash value\n\n\n    H[0] = H[0] + a | 0;\n    H[1] = H[1] + b | 0;\n    H[2] = H[2] + c | 0;\n    H[3] = H[3] + d | 0;\n    H[4] = H[4] + e | 0;\n    H[5] = H[5] + f | 0;\n    H[6] = H[6] + g | 0;\n    H[7] = H[7] + h | 0;\n  };\n\n  function sha256(message, options) {\n    if (message.constructor === String) {\n      message = _imports.convertString.UTF8.stringToBytes(message);\n    }\n\n    const H = [0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19];\n    const m = options && options.noPreprocess ? bytesToWords(message) : preprocessBlock(message);\n\n    for (let i = 0; i < m.length; i += 16) {\n      processBlock(H, m, i);\n    }\n\n    const digestbytes = wordsToBytes(H);\n    return options && options.asBytes ? digestbytes : options && options.asString ? _imports.convertString.bytesToString(digestbytes) : _imports.bytesToHex(digestbytes);\n  }\n\n  sha256.x2 = function (message, options) {\n    return sha256(sha256(message, {\n      asBytes: true\n    }), options);\n  };\n})();\n\n//# sourceURL=webpack:///./src/coins/zcash/_sha256.js?");

/***/ }),

/***/ "./src/coins/zcash/_z-wallet.js":
/*!**************************************!*\
  !*** ./src/coins/zcash/_z-wallet.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("/* WEBPACK VAR INJECTION */(function(Buffer) {// https://github.com/howardwu/zcash-wallet/blob/master/src/z-wallet.js\nconst bs58check = __webpack_require__(/*! bs58check */ \"./node_modules/bs58check/index.js\");\n\nconst crypto = __webpack_require__(/*! crypto */ \"./node_modules/crypto-browserify/index.js\");\n\nconst nacl = __webpack_require__(/*! tweetnacl */ \"./node_modules/tweetnacl/nacl-fast.js\");\n\nconst sha256 = __webpack_require__(/*! ./_sha256 */ \"./src/coins/zcash/_sha256.js\"); // Validates the prefix of the given key.\n\n\nfunction validateKey(key) {\n  if (key === undefined || key === null) {\n    return false;\n  } else if ((key[0] & 0xf0) !== 0) {\n    return false;\n  } else {\n    return true;\n  }\n} // Generates the SHA256 hash of a formatted key.\n\n\nfunction PRF(key, t) {\n  if (!Buffer.isBuffer(key)) {\n    throw new Error(\"Invalid key instance\");\n  }\n\n  if (key.length < 32) {\n    throw new Error(\"Invalid key length\");\n  }\n\n  const buffer = Buffer.concat([key, Buffer.alloc(32, 0)]);\n  buffer[0] |= 0xc0;\n  buffer[32] = t;\n  return sha256(buffer, {\n    noPreprocess: true,\n    asBytes: true\n  });\n} // Generates the SHA256 hash of a formatted spending key and encoded\n// using the x-coordinate of the generator for Curve25519 with NaCl.\n\n\nfunction encodedPRF(key) {\n  const address = PRF(key, 1);\n  return nacl.scalarMult.base(Uint8Array.from(address));\n} // Creates a spending key.\n\n\nfunction createSpendingKey(network) {\n  const header = network;\n  const buffer = crypto.randomBytes(32);\n  buffer[0] &= 0x0f;\n  const bufferHeader = Buffer.from(header.spendingKey);\n  return bs58check.encode(Buffer.concat([bufferHeader, buffer]));\n} // Creates a spending key.\n\n\nfunction createSpendingKeyFromBuffer(network, buffer) {\n  const header = network;\n  buffer[0] &= 0x0f;\n  const bufferHeader = Buffer.from(header.spendingKey);\n  return bs58check.encode(Buffer.concat([bufferHeader, buffer]));\n}\n\nfunction convertSpendingKeyToViewingKey(key, network) {\n  if (!validateKey(key)) {\n    throw new Error(\"Invalid spending key\");\n  }\n\n  const header = network;\n  const decode = bs58check.decode(key);\n  const prefix = decode.slice(0, 2);\n  const payload = decode.slice(2);\n\n  if (!prefix[0] === header.spendingKey[0] || prefix[1] !== header.spendingKey[1]) {\n    throw new Error(\"Invalid spending key header\");\n  }\n\n  const keyA = PRF(payload, 0);\n  const keyB = PRF(payload, 1);\n  keyB[0] &= 248;\n  keyB[31] &= 127;\n  keyB[31] |= 64;\n  const bufferH = Buffer.from(header.viewingKey);\n  const bufferA = Buffer.from(keyA);\n  const bufferB = Buffer.from(keyB);\n  const bufferViewingKey = Buffer.concat([bufferH, bufferA, bufferB]);\n  const viewingKey = bs58check.encode(bufferViewingKey);\n\n  if (viewingKey.length !== 97) {\n    throw new Error(\"Invalid viewingKey length\");\n  }\n\n  return viewingKey;\n} // Converts a provided spending key string to a address string.\n\n\nfunction convertSpendingKeyToAddress(key, network) {\n  if (!validateKey(key)) {\n    throw new Error(\"Invalid spending key\");\n  }\n\n  const header = network;\n  const decode = bs58check.decode(key);\n  const prefix = decode.slice(0, 2);\n  const payload = decode.slice(2);\n\n  if (!prefix[0] === header.spendingKey[0] || prefix[1] !== header.spendingKey[1]) {\n    throw new Error(\"Invalid spending key header\");\n  }\n\n  const addrA = PRF(payload, 0);\n  const addrB = encodedPRF(payload);\n  const bufferH = Buffer.from(header.address);\n  const bufferA = Buffer.from(addrA);\n  const bufferB = Buffer.from(addrB);\n  const bufferAddr = Buffer.concat([bufferH, bufferA, bufferB]);\n  const address = bs58check.encode(bufferAddr);\n\n  if (address.length !== 95) {\n    throw new Error(\"Invalid address length\");\n  }\n\n  return address;\n}\n\nmodule.exports = {\n  createSpendingKey,\n  createSpendingKeyFromBuffer,\n  convertSpendingKeyToViewingKey,\n  convertSpendingKeyToAddress\n};\n/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../../node_modules/node-libs-browser/node_modules/buffer/index.js */ \"./node_modules/node-libs-browser/node_modules/buffer/index.js\").Buffer))\n\n//# sourceURL=webpack:///./src/coins/zcash/_z-wallet.js?");

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

/***/ 13:
/*!************************!*\
  !*** crypto (ignored) ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("/* (ignored) */\n\n//# sourceURL=webpack:///crypto_(ignored)?");

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