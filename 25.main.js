(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[25],{

/***/ "./node_modules/base-x/src/index.js":
/*!******************************************!*\
  !*** ./node_modules/base-x/src/index.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n// base-x encoding / decoding\n// Copyright (c) 2018 base-x contributors\n// Copyright (c) 2014-2018 The Bitcoin Core developers (base58.cpp)\n// Distributed under the MIT software license, see the accompanying\n// file LICENSE or http://www.opensource.org/licenses/mit-license.php.\n// @ts-ignore\nvar _Buffer = __webpack_require__(/*! safe-buffer */ \"./node_modules/safe-buffer/index.js\").Buffer\nfunction base (ALPHABET) {\n  if (ALPHABET.length >= 255) { throw new TypeError('Alphabet too long') }\n  var BASE_MAP = new Uint8Array(256)\n  for (var j = 0; j < BASE_MAP.length; j++) {\n    BASE_MAP[j] = 255\n  }\n  for (var i = 0; i < ALPHABET.length; i++) {\n    var x = ALPHABET.charAt(i)\n    var xc = x.charCodeAt(0)\n    if (BASE_MAP[xc] !== 255) { throw new TypeError(x + ' is ambiguous') }\n    BASE_MAP[xc] = i\n  }\n  var BASE = ALPHABET.length\n  var LEADER = ALPHABET.charAt(0)\n  var FACTOR = Math.log(BASE) / Math.log(256) // log(BASE) / log(256), rounded up\n  var iFACTOR = Math.log(256) / Math.log(BASE) // log(256) / log(BASE), rounded up\n  function encode (source) {\n    if (Array.isArray(source) || source instanceof Uint8Array) { source = _Buffer.from(source) }\n    if (!_Buffer.isBuffer(source)) { throw new TypeError('Expected Buffer') }\n    if (source.length === 0) { return '' }\n        // Skip & count leading zeroes.\n    var zeroes = 0\n    var length = 0\n    var pbegin = 0\n    var pend = source.length\n    while (pbegin !== pend && source[pbegin] === 0) {\n      pbegin++\n      zeroes++\n    }\n        // Allocate enough space in big-endian base58 representation.\n    var size = ((pend - pbegin) * iFACTOR + 1) >>> 0\n    var b58 = new Uint8Array(size)\n        // Process the bytes.\n    while (pbegin !== pend) {\n      var carry = source[pbegin]\n            // Apply \"b58 = b58 * 256 + ch\".\n      var i = 0\n      for (var it1 = size - 1; (carry !== 0 || i < length) && (it1 !== -1); it1--, i++) {\n        carry += (256 * b58[it1]) >>> 0\n        b58[it1] = (carry % BASE) >>> 0\n        carry = (carry / BASE) >>> 0\n      }\n      if (carry !== 0) { throw new Error('Non-zero carry') }\n      length = i\n      pbegin++\n    }\n        // Skip leading zeroes in base58 result.\n    var it2 = size - length\n    while (it2 !== size && b58[it2] === 0) {\n      it2++\n    }\n        // Translate the result into a string.\n    var str = LEADER.repeat(zeroes)\n    for (; it2 < size; ++it2) { str += ALPHABET.charAt(b58[it2]) }\n    return str\n  }\n  function decodeUnsafe (source) {\n    if (typeof source !== 'string') { throw new TypeError('Expected String') }\n    if (source.length === 0) { return _Buffer.alloc(0) }\n    var psz = 0\n        // Skip leading spaces.\n    if (source[psz] === ' ') { return }\n        // Skip and count leading '1's.\n    var zeroes = 0\n    var length = 0\n    while (source[psz] === LEADER) {\n      zeroes++\n      psz++\n    }\n        // Allocate enough space in big-endian base256 representation.\n    var size = (((source.length - psz) * FACTOR) + 1) >>> 0 // log(58) / log(256), rounded up.\n    var b256 = new Uint8Array(size)\n        // Process the characters.\n    while (source[psz]) {\n            // Decode character\n      var carry = BASE_MAP[source.charCodeAt(psz)]\n            // Invalid character\n      if (carry === 255) { return }\n      var i = 0\n      for (var it3 = size - 1; (carry !== 0 || i < length) && (it3 !== -1); it3--, i++) {\n        carry += (BASE * b256[it3]) >>> 0\n        b256[it3] = (carry % 256) >>> 0\n        carry = (carry / 256) >>> 0\n      }\n      if (carry !== 0) { throw new Error('Non-zero carry') }\n      length = i\n      psz++\n    }\n        // Skip trailing spaces.\n    if (source[psz] === ' ') { return }\n        // Skip leading zeroes in b256.\n    var it4 = size - length\n    while (it4 !== size && b256[it4] === 0) {\n      it4++\n    }\n    var vch = _Buffer.allocUnsafe(zeroes + (size - it4))\n    vch.fill(0x00, 0, zeroes)\n    var j = zeroes\n    while (it4 !== size) {\n      vch[j++] = b256[it4++]\n    }\n    return vch\n  }\n  function decode (string) {\n    var buffer = decodeUnsafe(string)\n    if (buffer) { return buffer }\n    throw new Error('Non-base' + BASE + ' character')\n  }\n  return {\n    encode: encode,\n    decodeUnsafe: decodeUnsafe,\n    decode: decode\n  }\n}\nmodule.exports = base\n\n\n//# sourceURL=webpack:///./node_modules/base-x/src/index.js?");

/***/ }),

/***/ "./node_modules/bs58/index.js":
/*!************************************!*\
  !*** ./node_modules/bs58/index.js ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var basex = __webpack_require__(/*! base-x */ \"./node_modules/base-x/src/index.js\")\nvar ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'\n\nmodule.exports = basex(ALPHABET)\n\n\n//# sourceURL=webpack:///./node_modules/bs58/index.js?");

/***/ }),

/***/ "./node_modules/bs58check/base.js":
/*!****************************************!*\
  !*** ./node_modules/bs58check/base.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar base58 = __webpack_require__(/*! bs58 */ \"./node_modules/bs58/index.js\")\nvar Buffer = __webpack_require__(/*! safe-buffer */ \"./node_modules/safe-buffer/index.js\").Buffer\n\nmodule.exports = function (checksumFn) {\n  // Encode a buffer as a base58-check encoded string\n  function encode (payload) {\n    var checksum = checksumFn(payload)\n\n    return base58.encode(Buffer.concat([\n      payload,\n      checksum\n    ], payload.length + 4))\n  }\n\n  function decodeRaw (buffer) {\n    var payload = buffer.slice(0, -4)\n    var checksum = buffer.slice(-4)\n    var newChecksum = checksumFn(payload)\n\n    if (checksum[0] ^ newChecksum[0] |\n        checksum[1] ^ newChecksum[1] |\n        checksum[2] ^ newChecksum[2] |\n        checksum[3] ^ newChecksum[3]) return\n\n    return payload\n  }\n\n  // Decode a base58-check encoded string to a buffer, no result if checksum is wrong\n  function decodeUnsafe (string) {\n    var buffer = base58.decodeUnsafe(string)\n    if (!buffer) return\n\n    return decodeRaw(buffer)\n  }\n\n  function decode (string) {\n    var buffer = base58.decode(string)\n    var payload = decodeRaw(buffer, checksumFn)\n    if (!payload) throw new Error('Invalid checksum')\n    return payload\n  }\n\n  return {\n    encode: encode,\n    decode: decode,\n    decodeUnsafe: decodeUnsafe\n  }\n}\n\n\n//# sourceURL=webpack:///./node_modules/bs58check/base.js?");

/***/ }),

/***/ "./node_modules/bs58check/index.js":
/*!*****************************************!*\
  !*** ./node_modules/bs58check/index.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar createHash = __webpack_require__(/*! create-hash */ \"./node_modules/create-hash/browser.js\")\nvar bs58checkBase = __webpack_require__(/*! ./base */ \"./node_modules/bs58check/base.js\")\n\n// SHA256(SHA256(buffer))\nfunction sha256x2 (buffer) {\n  var tmp = createHash('sha256').update(buffer).digest()\n  return createHash('sha256').update(tmp).digest()\n}\n\nmodule.exports = bs58checkBase(sha256x2)\n\n\n//# sourceURL=webpack:///./node_modules/bs58check/index.js?");

/***/ }),

/***/ "./node_modules/wif/index.js":
/*!***********************************!*\
  !*** ./node_modules/wif/index.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("/* WEBPACK VAR INJECTION */(function(Buffer) {var bs58check = __webpack_require__(/*! bs58check */ \"./node_modules/bs58check/index.js\")\n\nfunction decodeRaw (buffer, version) {\n  // check version only if defined\n  if (version !== undefined && buffer[0] !== version) throw new Error('Invalid network version')\n\n  // uncompressed\n  if (buffer.length === 33) {\n    return {\n      version: buffer[0],\n      privateKey: buffer.slice(1, 33),\n      compressed: false\n    }\n  }\n\n  // invalid length\n  if (buffer.length !== 34) throw new Error('Invalid WIF length')\n\n  // invalid compression flag\n  if (buffer[33] !== 0x01) throw new Error('Invalid compression flag')\n\n  return {\n    version: buffer[0],\n    privateKey: buffer.slice(1, 33),\n    compressed: true\n  }\n}\n\nfunction encodeRaw (version, privateKey, compressed) {\n  var result = new Buffer(compressed ? 34 : 33)\n\n  result.writeUInt8(version, 0)\n  privateKey.copy(result, 1)\n\n  if (compressed) {\n    result[33] = 0x01\n  }\n\n  return result\n}\n\nfunction decode (string, version) {\n  return decodeRaw(bs58check.decode(string), version)\n}\n\nfunction encode (version, privateKey, compressed) {\n  if (typeof version === 'number') return bs58check.encode(encodeRaw(version, privateKey, compressed))\n\n  return bs58check.encode(\n    encodeRaw(\n      version.version,\n      version.privateKey,\n      version.compressed\n    )\n  )\n}\n\nmodule.exports = {\n  decode: decode,\n  decodeRaw: decodeRaw,\n  encode: encode,\n  encodeRaw: encodeRaw\n}\n\n/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../node-libs-browser/node_modules/buffer/index.js */ \"./node_modules/node-libs-browser/node_modules/buffer/index.js\").Buffer))\n\n//# sourceURL=webpack:///./node_modules/wif/index.js?");

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

/***/ })

}]);