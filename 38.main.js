(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[38],{

/***/ "./node_modules/scryptsy/lib/index.js":
/*!********************************************!*\
  !*** ./node_modules/scryptsy/lib/index.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const scrypt = __webpack_require__(/*! ./scryptSync */ \"./node_modules/scryptsy/lib/scryptSync.js\")\nscrypt.async = __webpack_require__(/*! ./scrypt */ \"./node_modules/scryptsy/lib/scrypt.js\")\nmodule.exports = scrypt\n\n\n//# sourceURL=webpack:///./node_modules/scryptsy/lib/index.js?");

/***/ }),

/***/ "./node_modules/scryptsy/lib/scrypt.js":
/*!*********************************************!*\
  !*** ./node_modules/scryptsy/lib/scrypt.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const crypto = __webpack_require__(/*! crypto */ \"./node_modules/crypto-browserify/index.js\")\nconst {\n  checkAndInit,\n  smix\n} = __webpack_require__(/*! ./utils */ \"./node_modules/scryptsy/lib/utils.js\")\n\n// N = Cpu cost, r = Memory cost, p = parallelization cost\nasync function scrypt (key, salt, N, r, p, dkLen, progressCallback, promiseInterval) {\n  const {\n    XY,\n    V,\n    B32,\n    x,\n    _X,\n    B,\n    tickCallback\n  } = checkAndInit(key, salt, N, r, p, dkLen, progressCallback)\n\n  for (var i = 0; i < p; i++) {\n    await smix(B, i * 128 * r, r, N, V, XY, _X, B32, x, tickCallback, promiseInterval)\n  }\n\n  return crypto.pbkdf2Sync(key, B, 1, dkLen, 'sha256')\n}\n\nmodule.exports = scrypt\n\n\n//# sourceURL=webpack:///./node_modules/scryptsy/lib/scrypt.js?");

/***/ }),

/***/ "./node_modules/scryptsy/lib/scryptSync.js":
/*!*************************************************!*\
  !*** ./node_modules/scryptsy/lib/scryptSync.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const crypto = __webpack_require__(/*! crypto */ \"./node_modules/crypto-browserify/index.js\")\nconst {\n  checkAndInit,\n  smixSync\n} = __webpack_require__(/*! ./utils */ \"./node_modules/scryptsy/lib/utils.js\")\n\n// N = Cpu cost, r = Memory cost, p = parallelization cost\nfunction scrypt (key, salt, N, r, p, dkLen, progressCallback) {\n  const {\n    XY,\n    V,\n    B32,\n    x,\n    _X,\n    B,\n    tickCallback\n  } = checkAndInit(key, salt, N, r, p, dkLen, progressCallback)\n\n  for (var i = 0; i < p; i++) {\n    smixSync(B, i * 128 * r, r, N, V, XY, _X, B32, x, tickCallback)\n  }\n\n  return crypto.pbkdf2Sync(key, B, 1, dkLen, 'sha256')\n}\n\nmodule.exports = scrypt\n\n\n//# sourceURL=webpack:///./node_modules/scryptsy/lib/scryptSync.js?");

/***/ }),

/***/ "./node_modules/scryptsy/lib/utils.js":
/*!********************************************!*\
  !*** ./node_modules/scryptsy/lib/utils.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("/* WEBPACK VAR INJECTION */(function(Buffer, setImmediate) {const crypto = __webpack_require__(/*! crypto */ \"./node_modules/crypto-browserify/index.js\")\nconst MAX_VALUE = 0x7fffffff\nconst DEFAULT_PROMISE_INTERVAL = 5000\n/* eslint-disable camelcase */\n\nfunction checkAndInit (key, salt, N, r, p, dkLen, progressCallback) {\n  if (N === 0 || (N & (N - 1)) !== 0) throw Error('N must be > 0 and a power of 2')\n\n  if (N > MAX_VALUE / 128 / r) throw Error('Parameter N is too large')\n  if (r > MAX_VALUE / 128 / p) throw Error('Parameter r is too large')\n\n  let XY = Buffer.alloc(256 * r)\n  let V = Buffer.alloc(128 * r * N)\n\n  // pseudo global\n  let B32 = new Int32Array(16) // salsa20_8\n  let x = new Int32Array(16) // salsa20_8\n  let _X = Buffer.alloc(64) // blockmix_salsa8\n\n  // pseudo global\n  let B = crypto.pbkdf2Sync(key, salt, 1, p * 128 * r, 'sha256')\n\n  let tickCallback\n  if (progressCallback) {\n    let totalOps = p * N * 2\n    let currentOp = 0\n\n    tickCallback = function () {\n      ++currentOp\n\n      // send progress notifications once every 1,000 ops\n      if (currentOp % 1000 === 0) {\n        progressCallback({\n          current: currentOp,\n          total: totalOps,\n          percent: (currentOp / totalOps) * 100.0\n        })\n      }\n    }\n  }\n  return {\n    XY,\n    V,\n    B32,\n    x,\n    _X,\n    B,\n    tickCallback\n  }\n}\n\nasync function smix (B, Bi, r, N, V, XY, _X, B32, x, tickCallback, promiseInterval) {\n  promiseInterval = promiseInterval || DEFAULT_PROMISE_INTERVAL\n  let Xi = 0\n  let Yi = 128 * r\n  let i\n\n  B.copy(XY, Xi, Bi, Bi + Yi)\n\n  for (i = 0; i < N; i++) {\n    XY.copy(V, i * Yi, Xi, Xi + Yi)\n    if (i % promiseInterval === 0) {\n      await new Promise(resolve => setImmediate(resolve))\n    }\n    blockmix_salsa8(XY, Xi, Yi, r, _X, B32, x)\n\n    if (tickCallback) tickCallback()\n  }\n\n  for (i = 0; i < N; i++) {\n    let offset = Xi + (2 * r - 1) * 64\n    let j = XY.readUInt32LE(offset) & (N - 1)\n    blockxor(V, j * Yi, XY, Xi, Yi)\n    if (i % promiseInterval === 0) {\n      await new Promise(resolve => setImmediate(resolve))\n    }\n    blockmix_salsa8(XY, Xi, Yi, r, _X, B32, x)\n\n    if (tickCallback) tickCallback()\n  }\n\n  XY.copy(B, Bi, Xi, Xi + Yi)\n}\n\nfunction smixSync (B, Bi, r, N, V, XY, _X, B32, x, tickCallback) {\n  let Xi = 0\n  let Yi = 128 * r\n  let i\n\n  B.copy(XY, Xi, Bi, Bi + Yi)\n\n  for (i = 0; i < N; i++) {\n    XY.copy(V, i * Yi, Xi, Xi + Yi)\n    blockmix_salsa8(XY, Xi, Yi, r, _X, B32, x)\n\n    if (tickCallback) tickCallback()\n  }\n\n  for (i = 0; i < N; i++) {\n    let offset = Xi + (2 * r - 1) * 64\n    let j = XY.readUInt32LE(offset) & (N - 1)\n    blockxor(V, j * Yi, XY, Xi, Yi)\n    blockmix_salsa8(XY, Xi, Yi, r, _X, B32, x)\n\n    if (tickCallback) tickCallback()\n  }\n\n  XY.copy(B, Bi, Xi, Xi + Yi)\n}\n\nfunction blockmix_salsa8 (BY, Bi, Yi, r, _X, B32, x) {\n  let i\n\n  arraycopy(BY, Bi + (2 * r - 1) * 64, _X, 0, 64)\n\n  for (i = 0; i < 2 * r; i++) {\n    blockxor(BY, i * 64, _X, 0, 64)\n    salsa20_8(_X, B32, x)\n    arraycopy(_X, 0, BY, Yi + (i * 64), 64)\n  }\n\n  for (i = 0; i < r; i++) {\n    arraycopy(BY, Yi + (i * 2) * 64, BY, Bi + (i * 64), 64)\n  }\n\n  for (i = 0; i < r; i++) {\n    arraycopy(BY, Yi + (i * 2 + 1) * 64, BY, Bi + (i + r) * 64, 64)\n  }\n}\n\nfunction R (a, b) {\n  return (a << b) | (a >>> (32 - b))\n}\n\nfunction salsa20_8 (B, B32, x) {\n  let i\n\n  for (i = 0; i < 16; i++) {\n    B32[i] = (B[i * 4 + 0] & 0xff) << 0\n    B32[i] |= (B[i * 4 + 1] & 0xff) << 8\n    B32[i] |= (B[i * 4 + 2] & 0xff) << 16\n    B32[i] |= (B[i * 4 + 3] & 0xff) << 24\n    // B32[i] = B.readUInt32LE(i*4)   <--- this is signficantly slower even in Node.js\n  }\n\n  arraycopy(B32, 0, x, 0, 16)\n\n  for (i = 8; i > 0; i -= 2) {\n    x[4] ^= R(x[0] + x[12], 7)\n    x[8] ^= R(x[4] + x[0], 9)\n    x[12] ^= R(x[8] + x[4], 13)\n    x[0] ^= R(x[12] + x[8], 18)\n    x[9] ^= R(x[5] + x[1], 7)\n    x[13] ^= R(x[9] + x[5], 9)\n    x[1] ^= R(x[13] + x[9], 13)\n    x[5] ^= R(x[1] + x[13], 18)\n    x[14] ^= R(x[10] + x[6], 7)\n    x[2] ^= R(x[14] + x[10], 9)\n    x[6] ^= R(x[2] + x[14], 13)\n    x[10] ^= R(x[6] + x[2], 18)\n    x[3] ^= R(x[15] + x[11], 7)\n    x[7] ^= R(x[3] + x[15], 9)\n    x[11] ^= R(x[7] + x[3], 13)\n    x[15] ^= R(x[11] + x[7], 18)\n    x[1] ^= R(x[0] + x[3], 7)\n    x[2] ^= R(x[1] + x[0], 9)\n    x[3] ^= R(x[2] + x[1], 13)\n    x[0] ^= R(x[3] + x[2], 18)\n    x[6] ^= R(x[5] + x[4], 7)\n    x[7] ^= R(x[6] + x[5], 9)\n    x[4] ^= R(x[7] + x[6], 13)\n    x[5] ^= R(x[4] + x[7], 18)\n    x[11] ^= R(x[10] + x[9], 7)\n    x[8] ^= R(x[11] + x[10], 9)\n    x[9] ^= R(x[8] + x[11], 13)\n    x[10] ^= R(x[9] + x[8], 18)\n    x[12] ^= R(x[15] + x[14], 7)\n    x[13] ^= R(x[12] + x[15], 9)\n    x[14] ^= R(x[13] + x[12], 13)\n    x[15] ^= R(x[14] + x[13], 18)\n  }\n\n  for (i = 0; i < 16; ++i) B32[i] = x[i] + B32[i]\n\n  for (i = 0; i < 16; i++) {\n    let bi = i * 4\n    B[bi + 0] = (B32[i] >> 0 & 0xff)\n    B[bi + 1] = (B32[i] >> 8 & 0xff)\n    B[bi + 2] = (B32[i] >> 16 & 0xff)\n    B[bi + 3] = (B32[i] >> 24 & 0xff)\n    // B.writeInt32LE(B32[i], i*4)  //<--- this is signficantly slower even in Node.js\n  }\n}\n\n// naive approach... going back to loop unrolling may yield additional performance\nfunction blockxor (S, Si, D, Di, len) {\n  for (let i = 0; i < len; i++) {\n    D[Di + i] ^= S[Si + i]\n  }\n}\n\nfunction arraycopy (src, srcPos, dest, destPos, length) {\n  if (Buffer.isBuffer(src) && Buffer.isBuffer(dest)) {\n    src.copy(dest, destPos, srcPos, srcPos + length)\n  } else {\n    while (length--) {\n      dest[destPos++] = src[srcPos++]\n    }\n  }\n}\n\nmodule.exports = {\n  checkAndInit,\n  smix,\n  smixSync\n}\n\n/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../node-libs-browser/node_modules/buffer/index.js */ \"./node_modules/node-libs-browser/node_modules/buffer/index.js\").Buffer, __webpack_require__(/*! ./../../timers-browserify/main.js */ \"./node_modules/timers-browserify/main.js\").setImmediate))\n\n//# sourceURL=webpack:///./node_modules/scryptsy/lib/utils.js?");

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