(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[6],{

/***/ "./node_modules/browserify-aes/aes.js":
/*!********************************************!*\
  !*** ./node_modules/browserify-aes/aes.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("// based on the aes implimentation in triple sec\n// https://github.com/keybase/triplesec\n// which is in turn based on the one from crypto-js\n// https://code.google.com/p/crypto-js/\n\nvar Buffer = __webpack_require__(/*! safe-buffer */ \"./node_modules/safe-buffer/index.js\").Buffer\n\nfunction asUInt32Array (buf) {\n  if (!Buffer.isBuffer(buf)) buf = Buffer.from(buf)\n\n  var len = (buf.length / 4) | 0\n  var out = new Array(len)\n\n  for (var i = 0; i < len; i++) {\n    out[i] = buf.readUInt32BE(i * 4)\n  }\n\n  return out\n}\n\nfunction scrubVec (v) {\n  for (var i = 0; i < v.length; v++) {\n    v[i] = 0\n  }\n}\n\nfunction cryptBlock (M, keySchedule, SUB_MIX, SBOX, nRounds) {\n  var SUB_MIX0 = SUB_MIX[0]\n  var SUB_MIX1 = SUB_MIX[1]\n  var SUB_MIX2 = SUB_MIX[2]\n  var SUB_MIX3 = SUB_MIX[3]\n\n  var s0 = M[0] ^ keySchedule[0]\n  var s1 = M[1] ^ keySchedule[1]\n  var s2 = M[2] ^ keySchedule[2]\n  var s3 = M[3] ^ keySchedule[3]\n  var t0, t1, t2, t3\n  var ksRow = 4\n\n  for (var round = 1; round < nRounds; round++) {\n    t0 = SUB_MIX0[s0 >>> 24] ^ SUB_MIX1[(s1 >>> 16) & 0xff] ^ SUB_MIX2[(s2 >>> 8) & 0xff] ^ SUB_MIX3[s3 & 0xff] ^ keySchedule[ksRow++]\n    t1 = SUB_MIX0[s1 >>> 24] ^ SUB_MIX1[(s2 >>> 16) & 0xff] ^ SUB_MIX2[(s3 >>> 8) & 0xff] ^ SUB_MIX3[s0 & 0xff] ^ keySchedule[ksRow++]\n    t2 = SUB_MIX0[s2 >>> 24] ^ SUB_MIX1[(s3 >>> 16) & 0xff] ^ SUB_MIX2[(s0 >>> 8) & 0xff] ^ SUB_MIX3[s1 & 0xff] ^ keySchedule[ksRow++]\n    t3 = SUB_MIX0[s3 >>> 24] ^ SUB_MIX1[(s0 >>> 16) & 0xff] ^ SUB_MIX2[(s1 >>> 8) & 0xff] ^ SUB_MIX3[s2 & 0xff] ^ keySchedule[ksRow++]\n    s0 = t0\n    s1 = t1\n    s2 = t2\n    s3 = t3\n  }\n\n  t0 = ((SBOX[s0 >>> 24] << 24) | (SBOX[(s1 >>> 16) & 0xff] << 16) | (SBOX[(s2 >>> 8) & 0xff] << 8) | SBOX[s3 & 0xff]) ^ keySchedule[ksRow++]\n  t1 = ((SBOX[s1 >>> 24] << 24) | (SBOX[(s2 >>> 16) & 0xff] << 16) | (SBOX[(s3 >>> 8) & 0xff] << 8) | SBOX[s0 & 0xff]) ^ keySchedule[ksRow++]\n  t2 = ((SBOX[s2 >>> 24] << 24) | (SBOX[(s3 >>> 16) & 0xff] << 16) | (SBOX[(s0 >>> 8) & 0xff] << 8) | SBOX[s1 & 0xff]) ^ keySchedule[ksRow++]\n  t3 = ((SBOX[s3 >>> 24] << 24) | (SBOX[(s0 >>> 16) & 0xff] << 16) | (SBOX[(s1 >>> 8) & 0xff] << 8) | SBOX[s2 & 0xff]) ^ keySchedule[ksRow++]\n  t0 = t0 >>> 0\n  t1 = t1 >>> 0\n  t2 = t2 >>> 0\n  t3 = t3 >>> 0\n\n  return [t0, t1, t2, t3]\n}\n\n// AES constants\nvar RCON = [0x00, 0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x1b, 0x36]\nvar G = (function () {\n  // Compute double table\n  var d = new Array(256)\n  for (var j = 0; j < 256; j++) {\n    if (j < 128) {\n      d[j] = j << 1\n    } else {\n      d[j] = (j << 1) ^ 0x11b\n    }\n  }\n\n  var SBOX = []\n  var INV_SBOX = []\n  var SUB_MIX = [[], [], [], []]\n  var INV_SUB_MIX = [[], [], [], []]\n\n  // Walk GF(2^8)\n  var x = 0\n  var xi = 0\n  for (var i = 0; i < 256; ++i) {\n    // Compute sbox\n    var sx = xi ^ (xi << 1) ^ (xi << 2) ^ (xi << 3) ^ (xi << 4)\n    sx = (sx >>> 8) ^ (sx & 0xff) ^ 0x63\n    SBOX[x] = sx\n    INV_SBOX[sx] = x\n\n    // Compute multiplication\n    var x2 = d[x]\n    var x4 = d[x2]\n    var x8 = d[x4]\n\n    // Compute sub bytes, mix columns tables\n    var t = (d[sx] * 0x101) ^ (sx * 0x1010100)\n    SUB_MIX[0][x] = (t << 24) | (t >>> 8)\n    SUB_MIX[1][x] = (t << 16) | (t >>> 16)\n    SUB_MIX[2][x] = (t << 8) | (t >>> 24)\n    SUB_MIX[3][x] = t\n\n    // Compute inv sub bytes, inv mix columns tables\n    t = (x8 * 0x1010101) ^ (x4 * 0x10001) ^ (x2 * 0x101) ^ (x * 0x1010100)\n    INV_SUB_MIX[0][sx] = (t << 24) | (t >>> 8)\n    INV_SUB_MIX[1][sx] = (t << 16) | (t >>> 16)\n    INV_SUB_MIX[2][sx] = (t << 8) | (t >>> 24)\n    INV_SUB_MIX[3][sx] = t\n\n    if (x === 0) {\n      x = xi = 1\n    } else {\n      x = x2 ^ d[d[d[x8 ^ x2]]]\n      xi ^= d[d[xi]]\n    }\n  }\n\n  return {\n    SBOX: SBOX,\n    INV_SBOX: INV_SBOX,\n    SUB_MIX: SUB_MIX,\n    INV_SUB_MIX: INV_SUB_MIX\n  }\n})()\n\nfunction AES (key) {\n  this._key = asUInt32Array(key)\n  this._reset()\n}\n\nAES.blockSize = 4 * 4\nAES.keySize = 256 / 8\nAES.prototype.blockSize = AES.blockSize\nAES.prototype.keySize = AES.keySize\nAES.prototype._reset = function () {\n  var keyWords = this._key\n  var keySize = keyWords.length\n  var nRounds = keySize + 6\n  var ksRows = (nRounds + 1) * 4\n\n  var keySchedule = []\n  for (var k = 0; k < keySize; k++) {\n    keySchedule[k] = keyWords[k]\n  }\n\n  for (k = keySize; k < ksRows; k++) {\n    var t = keySchedule[k - 1]\n\n    if (k % keySize === 0) {\n      t = (t << 8) | (t >>> 24)\n      t =\n        (G.SBOX[t >>> 24] << 24) |\n        (G.SBOX[(t >>> 16) & 0xff] << 16) |\n        (G.SBOX[(t >>> 8) & 0xff] << 8) |\n        (G.SBOX[t & 0xff])\n\n      t ^= RCON[(k / keySize) | 0] << 24\n    } else if (keySize > 6 && k % keySize === 4) {\n      t =\n        (G.SBOX[t >>> 24] << 24) |\n        (G.SBOX[(t >>> 16) & 0xff] << 16) |\n        (G.SBOX[(t >>> 8) & 0xff] << 8) |\n        (G.SBOX[t & 0xff])\n    }\n\n    keySchedule[k] = keySchedule[k - keySize] ^ t\n  }\n\n  var invKeySchedule = []\n  for (var ik = 0; ik < ksRows; ik++) {\n    var ksR = ksRows - ik\n    var tt = keySchedule[ksR - (ik % 4 ? 0 : 4)]\n\n    if (ik < 4 || ksR <= 4) {\n      invKeySchedule[ik] = tt\n    } else {\n      invKeySchedule[ik] =\n        G.INV_SUB_MIX[0][G.SBOX[tt >>> 24]] ^\n        G.INV_SUB_MIX[1][G.SBOX[(tt >>> 16) & 0xff]] ^\n        G.INV_SUB_MIX[2][G.SBOX[(tt >>> 8) & 0xff]] ^\n        G.INV_SUB_MIX[3][G.SBOX[tt & 0xff]]\n    }\n  }\n\n  this._nRounds = nRounds\n  this._keySchedule = keySchedule\n  this._invKeySchedule = invKeySchedule\n}\n\nAES.prototype.encryptBlockRaw = function (M) {\n  M = asUInt32Array(M)\n  return cryptBlock(M, this._keySchedule, G.SUB_MIX, G.SBOX, this._nRounds)\n}\n\nAES.prototype.encryptBlock = function (M) {\n  var out = this.encryptBlockRaw(M)\n  var buf = Buffer.allocUnsafe(16)\n  buf.writeUInt32BE(out[0], 0)\n  buf.writeUInt32BE(out[1], 4)\n  buf.writeUInt32BE(out[2], 8)\n  buf.writeUInt32BE(out[3], 12)\n  return buf\n}\n\nAES.prototype.decryptBlock = function (M) {\n  M = asUInt32Array(M)\n\n  // swap\n  var m1 = M[1]\n  M[1] = M[3]\n  M[3] = m1\n\n  var out = cryptBlock(M, this._invKeySchedule, G.INV_SUB_MIX, G.INV_SBOX, this._nRounds)\n  var buf = Buffer.allocUnsafe(16)\n  buf.writeUInt32BE(out[0], 0)\n  buf.writeUInt32BE(out[3], 4)\n  buf.writeUInt32BE(out[2], 8)\n  buf.writeUInt32BE(out[1], 12)\n  return buf\n}\n\nAES.prototype.scrub = function () {\n  scrubVec(this._keySchedule)\n  scrubVec(this._invKeySchedule)\n  scrubVec(this._key)\n}\n\nmodule.exports.AES = AES\n\n\n//# sourceURL=webpack:///./node_modules/browserify-aes/aes.js?");

/***/ }),

/***/ "./node_modules/browserify-aes/authCipher.js":
/*!***************************************************!*\
  !*** ./node_modules/browserify-aes/authCipher.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var aes = __webpack_require__(/*! ./aes */ \"./node_modules/browserify-aes/aes.js\")\nvar Buffer = __webpack_require__(/*! safe-buffer */ \"./node_modules/safe-buffer/index.js\").Buffer\nvar Transform = __webpack_require__(/*! cipher-base */ \"./node_modules/cipher-base/index.js\")\nvar inherits = __webpack_require__(/*! inherits */ \"./node_modules/inherits/inherits_browser.js\")\nvar GHASH = __webpack_require__(/*! ./ghash */ \"./node_modules/browserify-aes/ghash.js\")\nvar xor = __webpack_require__(/*! buffer-xor */ \"./node_modules/buffer-xor/index.js\")\nvar incr32 = __webpack_require__(/*! ./incr32 */ \"./node_modules/browserify-aes/incr32.js\")\n\nfunction xorTest (a, b) {\n  var out = 0\n  if (a.length !== b.length) out++\n\n  var len = Math.min(a.length, b.length)\n  for (var i = 0; i < len; ++i) {\n    out += (a[i] ^ b[i])\n  }\n\n  return out\n}\n\nfunction calcIv (self, iv, ck) {\n  if (iv.length === 12) {\n    self._finID = Buffer.concat([iv, Buffer.from([0, 0, 0, 1])])\n    return Buffer.concat([iv, Buffer.from([0, 0, 0, 2])])\n  }\n  var ghash = new GHASH(ck)\n  var len = iv.length\n  var toPad = len % 16\n  ghash.update(iv)\n  if (toPad) {\n    toPad = 16 - toPad\n    ghash.update(Buffer.alloc(toPad, 0))\n  }\n  ghash.update(Buffer.alloc(8, 0))\n  var ivBits = len * 8\n  var tail = Buffer.alloc(8)\n  tail.writeUIntBE(ivBits, 0, 8)\n  ghash.update(tail)\n  self._finID = ghash.state\n  var out = Buffer.from(self._finID)\n  incr32(out)\n  return out\n}\nfunction StreamCipher (mode, key, iv, decrypt) {\n  Transform.call(this)\n\n  var h = Buffer.alloc(4, 0)\n\n  this._cipher = new aes.AES(key)\n  var ck = this._cipher.encryptBlock(h)\n  this._ghash = new GHASH(ck)\n  iv = calcIv(this, iv, ck)\n\n  this._prev = Buffer.from(iv)\n  this._cache = Buffer.allocUnsafe(0)\n  this._secCache = Buffer.allocUnsafe(0)\n  this._decrypt = decrypt\n  this._alen = 0\n  this._len = 0\n  this._mode = mode\n\n  this._authTag = null\n  this._called = false\n}\n\ninherits(StreamCipher, Transform)\n\nStreamCipher.prototype._update = function (chunk) {\n  if (!this._called && this._alen) {\n    var rump = 16 - (this._alen % 16)\n    if (rump < 16) {\n      rump = Buffer.alloc(rump, 0)\n      this._ghash.update(rump)\n    }\n  }\n\n  this._called = true\n  var out = this._mode.encrypt(this, chunk)\n  if (this._decrypt) {\n    this._ghash.update(chunk)\n  } else {\n    this._ghash.update(out)\n  }\n  this._len += chunk.length\n  return out\n}\n\nStreamCipher.prototype._final = function () {\n  if (this._decrypt && !this._authTag) throw new Error('Unsupported state or unable to authenticate data')\n\n  var tag = xor(this._ghash.final(this._alen * 8, this._len * 8), this._cipher.encryptBlock(this._finID))\n  if (this._decrypt && xorTest(tag, this._authTag)) throw new Error('Unsupported state or unable to authenticate data')\n\n  this._authTag = tag\n  this._cipher.scrub()\n}\n\nStreamCipher.prototype.getAuthTag = function getAuthTag () {\n  if (this._decrypt || !Buffer.isBuffer(this._authTag)) throw new Error('Attempting to get auth tag in unsupported state')\n\n  return this._authTag\n}\n\nStreamCipher.prototype.setAuthTag = function setAuthTag (tag) {\n  if (!this._decrypt) throw new Error('Attempting to set auth tag in unsupported state')\n\n  this._authTag = tag\n}\n\nStreamCipher.prototype.setAAD = function setAAD (buf) {\n  if (this._called) throw new Error('Attempting to set AAD in unsupported state')\n\n  this._ghash.update(buf)\n  this._alen += buf.length\n}\n\nmodule.exports = StreamCipher\n\n\n//# sourceURL=webpack:///./node_modules/browserify-aes/authCipher.js?");

/***/ }),

/***/ "./node_modules/browserify-aes/browser.js":
/*!************************************************!*\
  !*** ./node_modules/browserify-aes/browser.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var ciphers = __webpack_require__(/*! ./encrypter */ \"./node_modules/browserify-aes/encrypter.js\")\nvar deciphers = __webpack_require__(/*! ./decrypter */ \"./node_modules/browserify-aes/decrypter.js\")\nvar modes = __webpack_require__(/*! ./modes/list.json */ \"./node_modules/browserify-aes/modes/list.json\")\n\nfunction getCiphers () {\n  return Object.keys(modes)\n}\n\nexports.createCipher = exports.Cipher = ciphers.createCipher\nexports.createCipheriv = exports.Cipheriv = ciphers.createCipheriv\nexports.createDecipher = exports.Decipher = deciphers.createDecipher\nexports.createDecipheriv = exports.Decipheriv = deciphers.createDecipheriv\nexports.listCiphers = exports.getCiphers = getCiphers\n\n\n//# sourceURL=webpack:///./node_modules/browserify-aes/browser.js?");

/***/ }),

/***/ "./node_modules/browserify-aes/decrypter.js":
/*!**************************************************!*\
  !*** ./node_modules/browserify-aes/decrypter.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var AuthCipher = __webpack_require__(/*! ./authCipher */ \"./node_modules/browserify-aes/authCipher.js\")\nvar Buffer = __webpack_require__(/*! safe-buffer */ \"./node_modules/safe-buffer/index.js\").Buffer\nvar MODES = __webpack_require__(/*! ./modes */ \"./node_modules/browserify-aes/modes/index.js\")\nvar StreamCipher = __webpack_require__(/*! ./streamCipher */ \"./node_modules/browserify-aes/streamCipher.js\")\nvar Transform = __webpack_require__(/*! cipher-base */ \"./node_modules/cipher-base/index.js\")\nvar aes = __webpack_require__(/*! ./aes */ \"./node_modules/browserify-aes/aes.js\")\nvar ebtk = __webpack_require__(/*! evp_bytestokey */ \"./node_modules/evp_bytestokey/index.js\")\nvar inherits = __webpack_require__(/*! inherits */ \"./node_modules/inherits/inherits_browser.js\")\n\nfunction Decipher (mode, key, iv) {\n  Transform.call(this)\n\n  this._cache = new Splitter()\n  this._last = void 0\n  this._cipher = new aes.AES(key)\n  this._prev = Buffer.from(iv)\n  this._mode = mode\n  this._autopadding = true\n}\n\ninherits(Decipher, Transform)\n\nDecipher.prototype._update = function (data) {\n  this._cache.add(data)\n  var chunk\n  var thing\n  var out = []\n  while ((chunk = this._cache.get(this._autopadding))) {\n    thing = this._mode.decrypt(this, chunk)\n    out.push(thing)\n  }\n  return Buffer.concat(out)\n}\n\nDecipher.prototype._final = function () {\n  var chunk = this._cache.flush()\n  if (this._autopadding) {\n    return unpad(this._mode.decrypt(this, chunk))\n  } else if (chunk) {\n    throw new Error('data not multiple of block length')\n  }\n}\n\nDecipher.prototype.setAutoPadding = function (setTo) {\n  this._autopadding = !!setTo\n  return this\n}\n\nfunction Splitter () {\n  this.cache = Buffer.allocUnsafe(0)\n}\n\nSplitter.prototype.add = function (data) {\n  this.cache = Buffer.concat([this.cache, data])\n}\n\nSplitter.prototype.get = function (autoPadding) {\n  var out\n  if (autoPadding) {\n    if (this.cache.length > 16) {\n      out = this.cache.slice(0, 16)\n      this.cache = this.cache.slice(16)\n      return out\n    }\n  } else {\n    if (this.cache.length >= 16) {\n      out = this.cache.slice(0, 16)\n      this.cache = this.cache.slice(16)\n      return out\n    }\n  }\n\n  return null\n}\n\nSplitter.prototype.flush = function () {\n  if (this.cache.length) return this.cache\n}\n\nfunction unpad (last) {\n  var padded = last[15]\n  if (padded < 1 || padded > 16) {\n    throw new Error('unable to decrypt data')\n  }\n  var i = -1\n  while (++i < padded) {\n    if (last[(i + (16 - padded))] !== padded) {\n      throw new Error('unable to decrypt data')\n    }\n  }\n  if (padded === 16) return\n\n  return last.slice(0, 16 - padded)\n}\n\nfunction createDecipheriv (suite, password, iv) {\n  var config = MODES[suite.toLowerCase()]\n  if (!config) throw new TypeError('invalid suite type')\n\n  if (typeof iv === 'string') iv = Buffer.from(iv)\n  if (config.mode !== 'GCM' && iv.length !== config.iv) throw new TypeError('invalid iv length ' + iv.length)\n\n  if (typeof password === 'string') password = Buffer.from(password)\n  if (password.length !== config.key / 8) throw new TypeError('invalid key length ' + password.length)\n\n  if (config.type === 'stream') {\n    return new StreamCipher(config.module, password, iv, true)\n  } else if (config.type === 'auth') {\n    return new AuthCipher(config.module, password, iv, true)\n  }\n\n  return new Decipher(config.module, password, iv)\n}\n\nfunction createDecipher (suite, password) {\n  var config = MODES[suite.toLowerCase()]\n  if (!config) throw new TypeError('invalid suite type')\n\n  var keys = ebtk(password, false, config.key, config.iv)\n  return createDecipheriv(suite, keys.key, keys.iv)\n}\n\nexports.createDecipher = createDecipher\nexports.createDecipheriv = createDecipheriv\n\n\n//# sourceURL=webpack:///./node_modules/browserify-aes/decrypter.js?");

/***/ }),

/***/ "./node_modules/browserify-aes/encrypter.js":
/*!**************************************************!*\
  !*** ./node_modules/browserify-aes/encrypter.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var MODES = __webpack_require__(/*! ./modes */ \"./node_modules/browserify-aes/modes/index.js\")\nvar AuthCipher = __webpack_require__(/*! ./authCipher */ \"./node_modules/browserify-aes/authCipher.js\")\nvar Buffer = __webpack_require__(/*! safe-buffer */ \"./node_modules/safe-buffer/index.js\").Buffer\nvar StreamCipher = __webpack_require__(/*! ./streamCipher */ \"./node_modules/browserify-aes/streamCipher.js\")\nvar Transform = __webpack_require__(/*! cipher-base */ \"./node_modules/cipher-base/index.js\")\nvar aes = __webpack_require__(/*! ./aes */ \"./node_modules/browserify-aes/aes.js\")\nvar ebtk = __webpack_require__(/*! evp_bytestokey */ \"./node_modules/evp_bytestokey/index.js\")\nvar inherits = __webpack_require__(/*! inherits */ \"./node_modules/inherits/inherits_browser.js\")\n\nfunction Cipher (mode, key, iv) {\n  Transform.call(this)\n\n  this._cache = new Splitter()\n  this._cipher = new aes.AES(key)\n  this._prev = Buffer.from(iv)\n  this._mode = mode\n  this._autopadding = true\n}\n\ninherits(Cipher, Transform)\n\nCipher.prototype._update = function (data) {\n  this._cache.add(data)\n  var chunk\n  var thing\n  var out = []\n\n  while ((chunk = this._cache.get())) {\n    thing = this._mode.encrypt(this, chunk)\n    out.push(thing)\n  }\n\n  return Buffer.concat(out)\n}\n\nvar PADDING = Buffer.alloc(16, 0x10)\n\nCipher.prototype._final = function () {\n  var chunk = this._cache.flush()\n  if (this._autopadding) {\n    chunk = this._mode.encrypt(this, chunk)\n    this._cipher.scrub()\n    return chunk\n  }\n\n  if (!chunk.equals(PADDING)) {\n    this._cipher.scrub()\n    throw new Error('data not multiple of block length')\n  }\n}\n\nCipher.prototype.setAutoPadding = function (setTo) {\n  this._autopadding = !!setTo\n  return this\n}\n\nfunction Splitter () {\n  this.cache = Buffer.allocUnsafe(0)\n}\n\nSplitter.prototype.add = function (data) {\n  this.cache = Buffer.concat([this.cache, data])\n}\n\nSplitter.prototype.get = function () {\n  if (this.cache.length > 15) {\n    var out = this.cache.slice(0, 16)\n    this.cache = this.cache.slice(16)\n    return out\n  }\n  return null\n}\n\nSplitter.prototype.flush = function () {\n  var len = 16 - this.cache.length\n  var padBuff = Buffer.allocUnsafe(len)\n\n  var i = -1\n  while (++i < len) {\n    padBuff.writeUInt8(len, i)\n  }\n\n  return Buffer.concat([this.cache, padBuff])\n}\n\nfunction createCipheriv (suite, password, iv) {\n  var config = MODES[suite.toLowerCase()]\n  if (!config) throw new TypeError('invalid suite type')\n\n  if (typeof password === 'string') password = Buffer.from(password)\n  if (password.length !== config.key / 8) throw new TypeError('invalid key length ' + password.length)\n\n  if (typeof iv === 'string') iv = Buffer.from(iv)\n  if (config.mode !== 'GCM' && iv.length !== config.iv) throw new TypeError('invalid iv length ' + iv.length)\n\n  if (config.type === 'stream') {\n    return new StreamCipher(config.module, password, iv)\n  } else if (config.type === 'auth') {\n    return new AuthCipher(config.module, password, iv)\n  }\n\n  return new Cipher(config.module, password, iv)\n}\n\nfunction createCipher (suite, password) {\n  var config = MODES[suite.toLowerCase()]\n  if (!config) throw new TypeError('invalid suite type')\n\n  var keys = ebtk(password, false, config.key, config.iv)\n  return createCipheriv(suite, keys.key, keys.iv)\n}\n\nexports.createCipheriv = createCipheriv\nexports.createCipher = createCipher\n\n\n//# sourceURL=webpack:///./node_modules/browserify-aes/encrypter.js?");

/***/ }),

/***/ "./node_modules/browserify-aes/ghash.js":
/*!**********************************************!*\
  !*** ./node_modules/browserify-aes/ghash.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var Buffer = __webpack_require__(/*! safe-buffer */ \"./node_modules/safe-buffer/index.js\").Buffer\nvar ZEROES = Buffer.alloc(16, 0)\n\nfunction toArray (buf) {\n  return [\n    buf.readUInt32BE(0),\n    buf.readUInt32BE(4),\n    buf.readUInt32BE(8),\n    buf.readUInt32BE(12)\n  ]\n}\n\nfunction fromArray (out) {\n  var buf = Buffer.allocUnsafe(16)\n  buf.writeUInt32BE(out[0] >>> 0, 0)\n  buf.writeUInt32BE(out[1] >>> 0, 4)\n  buf.writeUInt32BE(out[2] >>> 0, 8)\n  buf.writeUInt32BE(out[3] >>> 0, 12)\n  return buf\n}\n\nfunction GHASH (key) {\n  this.h = key\n  this.state = Buffer.alloc(16, 0)\n  this.cache = Buffer.allocUnsafe(0)\n}\n\n// from http://bitwiseshiftleft.github.io/sjcl/doc/symbols/src/core_gcm.js.html\n// by Juho Vähä-Herttua\nGHASH.prototype.ghash = function (block) {\n  var i = -1\n  while (++i < block.length) {\n    this.state[i] ^= block[i]\n  }\n  this._multiply()\n}\n\nGHASH.prototype._multiply = function () {\n  var Vi = toArray(this.h)\n  var Zi = [0, 0, 0, 0]\n  var j, xi, lsbVi\n  var i = -1\n  while (++i < 128) {\n    xi = (this.state[~~(i / 8)] & (1 << (7 - (i % 8)))) !== 0\n    if (xi) {\n      // Z_i+1 = Z_i ^ V_i\n      Zi[0] ^= Vi[0]\n      Zi[1] ^= Vi[1]\n      Zi[2] ^= Vi[2]\n      Zi[3] ^= Vi[3]\n    }\n\n    // Store the value of LSB(V_i)\n    lsbVi = (Vi[3] & 1) !== 0\n\n    // V_i+1 = V_i >> 1\n    for (j = 3; j > 0; j--) {\n      Vi[j] = (Vi[j] >>> 1) | ((Vi[j - 1] & 1) << 31)\n    }\n    Vi[0] = Vi[0] >>> 1\n\n    // If LSB(V_i) is 1, V_i+1 = (V_i >> 1) ^ R\n    if (lsbVi) {\n      Vi[0] = Vi[0] ^ (0xe1 << 24)\n    }\n  }\n  this.state = fromArray(Zi)\n}\n\nGHASH.prototype.update = function (buf) {\n  this.cache = Buffer.concat([this.cache, buf])\n  var chunk\n  while (this.cache.length >= 16) {\n    chunk = this.cache.slice(0, 16)\n    this.cache = this.cache.slice(16)\n    this.ghash(chunk)\n  }\n}\n\nGHASH.prototype.final = function (abl, bl) {\n  if (this.cache.length) {\n    this.ghash(Buffer.concat([this.cache, ZEROES], 16))\n  }\n\n  this.ghash(fromArray([0, abl, 0, bl]))\n  return this.state\n}\n\nmodule.exports = GHASH\n\n\n//# sourceURL=webpack:///./node_modules/browserify-aes/ghash.js?");

/***/ }),

/***/ "./node_modules/browserify-aes/incr32.js":
/*!***********************************************!*\
  !*** ./node_modules/browserify-aes/incr32.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("function incr32 (iv) {\n  var len = iv.length\n  var item\n  while (len--) {\n    item = iv.readUInt8(len)\n    if (item === 255) {\n      iv.writeUInt8(0, len)\n    } else {\n      item++\n      iv.writeUInt8(item, len)\n      break\n    }\n  }\n}\nmodule.exports = incr32\n\n\n//# sourceURL=webpack:///./node_modules/browserify-aes/incr32.js?");

/***/ }),

/***/ "./node_modules/browserify-aes/modes/cbc.js":
/*!**************************************************!*\
  !*** ./node_modules/browserify-aes/modes/cbc.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var xor = __webpack_require__(/*! buffer-xor */ \"./node_modules/buffer-xor/index.js\")\n\nexports.encrypt = function (self, block) {\n  var data = xor(block, self._prev)\n\n  self._prev = self._cipher.encryptBlock(data)\n  return self._prev\n}\n\nexports.decrypt = function (self, block) {\n  var pad = self._prev\n\n  self._prev = block\n  var out = self._cipher.decryptBlock(block)\n\n  return xor(out, pad)\n}\n\n\n//# sourceURL=webpack:///./node_modules/browserify-aes/modes/cbc.js?");

/***/ }),

/***/ "./node_modules/browserify-aes/modes/cfb.js":
/*!**************************************************!*\
  !*** ./node_modules/browserify-aes/modes/cfb.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var Buffer = __webpack_require__(/*! safe-buffer */ \"./node_modules/safe-buffer/index.js\").Buffer\nvar xor = __webpack_require__(/*! buffer-xor */ \"./node_modules/buffer-xor/index.js\")\n\nfunction encryptStart (self, data, decrypt) {\n  var len = data.length\n  var out = xor(data, self._cache)\n  self._cache = self._cache.slice(len)\n  self._prev = Buffer.concat([self._prev, decrypt ? data : out])\n  return out\n}\n\nexports.encrypt = function (self, data, decrypt) {\n  var out = Buffer.allocUnsafe(0)\n  var len\n\n  while (data.length) {\n    if (self._cache.length === 0) {\n      self._cache = self._cipher.encryptBlock(self._prev)\n      self._prev = Buffer.allocUnsafe(0)\n    }\n\n    if (self._cache.length <= data.length) {\n      len = self._cache.length\n      out = Buffer.concat([out, encryptStart(self, data.slice(0, len), decrypt)])\n      data = data.slice(len)\n    } else {\n      out = Buffer.concat([out, encryptStart(self, data, decrypt)])\n      break\n    }\n  }\n\n  return out\n}\n\n\n//# sourceURL=webpack:///./node_modules/browserify-aes/modes/cfb.js?");

/***/ }),

/***/ "./node_modules/browserify-aes/modes/cfb1.js":
/*!***************************************************!*\
  !*** ./node_modules/browserify-aes/modes/cfb1.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var Buffer = __webpack_require__(/*! safe-buffer */ \"./node_modules/safe-buffer/index.js\").Buffer\n\nfunction encryptByte (self, byteParam, decrypt) {\n  var pad\n  var i = -1\n  var len = 8\n  var out = 0\n  var bit, value\n  while (++i < len) {\n    pad = self._cipher.encryptBlock(self._prev)\n    bit = (byteParam & (1 << (7 - i))) ? 0x80 : 0\n    value = pad[0] ^ bit\n    out += ((value & 0x80) >> (i % 8))\n    self._prev = shiftIn(self._prev, decrypt ? bit : value)\n  }\n  return out\n}\n\nfunction shiftIn (buffer, value) {\n  var len = buffer.length\n  var i = -1\n  var out = Buffer.allocUnsafe(buffer.length)\n  buffer = Buffer.concat([buffer, Buffer.from([value])])\n\n  while (++i < len) {\n    out[i] = buffer[i] << 1 | buffer[i + 1] >> (7)\n  }\n\n  return out\n}\n\nexports.encrypt = function (self, chunk, decrypt) {\n  var len = chunk.length\n  var out = Buffer.allocUnsafe(len)\n  var i = -1\n\n  while (++i < len) {\n    out[i] = encryptByte(self, chunk[i], decrypt)\n  }\n\n  return out\n}\n\n\n//# sourceURL=webpack:///./node_modules/browserify-aes/modes/cfb1.js?");

/***/ }),

/***/ "./node_modules/browserify-aes/modes/cfb8.js":
/*!***************************************************!*\
  !*** ./node_modules/browserify-aes/modes/cfb8.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var Buffer = __webpack_require__(/*! safe-buffer */ \"./node_modules/safe-buffer/index.js\").Buffer\n\nfunction encryptByte (self, byteParam, decrypt) {\n  var pad = self._cipher.encryptBlock(self._prev)\n  var out = pad[0] ^ byteParam\n\n  self._prev = Buffer.concat([\n    self._prev.slice(1),\n    Buffer.from([decrypt ? byteParam : out])\n  ])\n\n  return out\n}\n\nexports.encrypt = function (self, chunk, decrypt) {\n  var len = chunk.length\n  var out = Buffer.allocUnsafe(len)\n  var i = -1\n\n  while (++i < len) {\n    out[i] = encryptByte(self, chunk[i], decrypt)\n  }\n\n  return out\n}\n\n\n//# sourceURL=webpack:///./node_modules/browserify-aes/modes/cfb8.js?");

/***/ }),

/***/ "./node_modules/browserify-aes/modes/ctr.js":
/*!**************************************************!*\
  !*** ./node_modules/browserify-aes/modes/ctr.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var xor = __webpack_require__(/*! buffer-xor */ \"./node_modules/buffer-xor/index.js\")\nvar Buffer = __webpack_require__(/*! safe-buffer */ \"./node_modules/safe-buffer/index.js\").Buffer\nvar incr32 = __webpack_require__(/*! ../incr32 */ \"./node_modules/browserify-aes/incr32.js\")\n\nfunction getBlock (self) {\n  var out = self._cipher.encryptBlockRaw(self._prev)\n  incr32(self._prev)\n  return out\n}\n\nvar blockSize = 16\nexports.encrypt = function (self, chunk) {\n  var chunkNum = Math.ceil(chunk.length / blockSize)\n  var start = self._cache.length\n  self._cache = Buffer.concat([\n    self._cache,\n    Buffer.allocUnsafe(chunkNum * blockSize)\n  ])\n  for (var i = 0; i < chunkNum; i++) {\n    var out = getBlock(self)\n    var offset = start + i * blockSize\n    self._cache.writeUInt32BE(out[0], offset + 0)\n    self._cache.writeUInt32BE(out[1], offset + 4)\n    self._cache.writeUInt32BE(out[2], offset + 8)\n    self._cache.writeUInt32BE(out[3], offset + 12)\n  }\n  var pad = self._cache.slice(0, chunk.length)\n  self._cache = self._cache.slice(chunk.length)\n  return xor(chunk, pad)\n}\n\n\n//# sourceURL=webpack:///./node_modules/browserify-aes/modes/ctr.js?");

/***/ }),

/***/ "./node_modules/browserify-aes/modes/ecb.js":
/*!**************************************************!*\
  !*** ./node_modules/browserify-aes/modes/ecb.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("exports.encrypt = function (self, block) {\n  return self._cipher.encryptBlock(block)\n}\n\nexports.decrypt = function (self, block) {\n  return self._cipher.decryptBlock(block)\n}\n\n\n//# sourceURL=webpack:///./node_modules/browserify-aes/modes/ecb.js?");

/***/ }),

/***/ "./node_modules/browserify-aes/modes/index.js":
/*!****************************************************!*\
  !*** ./node_modules/browserify-aes/modes/index.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var modeModules = {\n  ECB: __webpack_require__(/*! ./ecb */ \"./node_modules/browserify-aes/modes/ecb.js\"),\n  CBC: __webpack_require__(/*! ./cbc */ \"./node_modules/browserify-aes/modes/cbc.js\"),\n  CFB: __webpack_require__(/*! ./cfb */ \"./node_modules/browserify-aes/modes/cfb.js\"),\n  CFB8: __webpack_require__(/*! ./cfb8 */ \"./node_modules/browserify-aes/modes/cfb8.js\"),\n  CFB1: __webpack_require__(/*! ./cfb1 */ \"./node_modules/browserify-aes/modes/cfb1.js\"),\n  OFB: __webpack_require__(/*! ./ofb */ \"./node_modules/browserify-aes/modes/ofb.js\"),\n  CTR: __webpack_require__(/*! ./ctr */ \"./node_modules/browserify-aes/modes/ctr.js\"),\n  GCM: __webpack_require__(/*! ./ctr */ \"./node_modules/browserify-aes/modes/ctr.js\")\n}\n\nvar modes = __webpack_require__(/*! ./list.json */ \"./node_modules/browserify-aes/modes/list.json\")\n\nfor (var key in modes) {\n  modes[key].module = modeModules[modes[key].mode]\n}\n\nmodule.exports = modes\n\n\n//# sourceURL=webpack:///./node_modules/browserify-aes/modes/index.js?");

/***/ }),

/***/ "./node_modules/browserify-aes/modes/list.json":
/*!*****************************************************!*\
  !*** ./node_modules/browserify-aes/modes/list.json ***!
  \*****************************************************/
/*! exports provided: aes-128-ecb, aes-192-ecb, aes-256-ecb, aes-128-cbc, aes-192-cbc, aes-256-cbc, aes128, aes192, aes256, aes-128-cfb, aes-192-cfb, aes-256-cfb, aes-128-cfb8, aes-192-cfb8, aes-256-cfb8, aes-128-cfb1, aes-192-cfb1, aes-256-cfb1, aes-128-ofb, aes-192-ofb, aes-256-ofb, aes-128-ctr, aes-192-ctr, aes-256-ctr, aes-128-gcm, aes-192-gcm, aes-256-gcm, default */
/***/ (function(module) {

eval("module.exports = JSON.parse(\"{\\\"aes-128-ecb\\\":{\\\"cipher\\\":\\\"AES\\\",\\\"key\\\":128,\\\"iv\\\":0,\\\"mode\\\":\\\"ECB\\\",\\\"type\\\":\\\"block\\\"},\\\"aes-192-ecb\\\":{\\\"cipher\\\":\\\"AES\\\",\\\"key\\\":192,\\\"iv\\\":0,\\\"mode\\\":\\\"ECB\\\",\\\"type\\\":\\\"block\\\"},\\\"aes-256-ecb\\\":{\\\"cipher\\\":\\\"AES\\\",\\\"key\\\":256,\\\"iv\\\":0,\\\"mode\\\":\\\"ECB\\\",\\\"type\\\":\\\"block\\\"},\\\"aes-128-cbc\\\":{\\\"cipher\\\":\\\"AES\\\",\\\"key\\\":128,\\\"iv\\\":16,\\\"mode\\\":\\\"CBC\\\",\\\"type\\\":\\\"block\\\"},\\\"aes-192-cbc\\\":{\\\"cipher\\\":\\\"AES\\\",\\\"key\\\":192,\\\"iv\\\":16,\\\"mode\\\":\\\"CBC\\\",\\\"type\\\":\\\"block\\\"},\\\"aes-256-cbc\\\":{\\\"cipher\\\":\\\"AES\\\",\\\"key\\\":256,\\\"iv\\\":16,\\\"mode\\\":\\\"CBC\\\",\\\"type\\\":\\\"block\\\"},\\\"aes128\\\":{\\\"cipher\\\":\\\"AES\\\",\\\"key\\\":128,\\\"iv\\\":16,\\\"mode\\\":\\\"CBC\\\",\\\"type\\\":\\\"block\\\"},\\\"aes192\\\":{\\\"cipher\\\":\\\"AES\\\",\\\"key\\\":192,\\\"iv\\\":16,\\\"mode\\\":\\\"CBC\\\",\\\"type\\\":\\\"block\\\"},\\\"aes256\\\":{\\\"cipher\\\":\\\"AES\\\",\\\"key\\\":256,\\\"iv\\\":16,\\\"mode\\\":\\\"CBC\\\",\\\"type\\\":\\\"block\\\"},\\\"aes-128-cfb\\\":{\\\"cipher\\\":\\\"AES\\\",\\\"key\\\":128,\\\"iv\\\":16,\\\"mode\\\":\\\"CFB\\\",\\\"type\\\":\\\"stream\\\"},\\\"aes-192-cfb\\\":{\\\"cipher\\\":\\\"AES\\\",\\\"key\\\":192,\\\"iv\\\":16,\\\"mode\\\":\\\"CFB\\\",\\\"type\\\":\\\"stream\\\"},\\\"aes-256-cfb\\\":{\\\"cipher\\\":\\\"AES\\\",\\\"key\\\":256,\\\"iv\\\":16,\\\"mode\\\":\\\"CFB\\\",\\\"type\\\":\\\"stream\\\"},\\\"aes-128-cfb8\\\":{\\\"cipher\\\":\\\"AES\\\",\\\"key\\\":128,\\\"iv\\\":16,\\\"mode\\\":\\\"CFB8\\\",\\\"type\\\":\\\"stream\\\"},\\\"aes-192-cfb8\\\":{\\\"cipher\\\":\\\"AES\\\",\\\"key\\\":192,\\\"iv\\\":16,\\\"mode\\\":\\\"CFB8\\\",\\\"type\\\":\\\"stream\\\"},\\\"aes-256-cfb8\\\":{\\\"cipher\\\":\\\"AES\\\",\\\"key\\\":256,\\\"iv\\\":16,\\\"mode\\\":\\\"CFB8\\\",\\\"type\\\":\\\"stream\\\"},\\\"aes-128-cfb1\\\":{\\\"cipher\\\":\\\"AES\\\",\\\"key\\\":128,\\\"iv\\\":16,\\\"mode\\\":\\\"CFB1\\\",\\\"type\\\":\\\"stream\\\"},\\\"aes-192-cfb1\\\":{\\\"cipher\\\":\\\"AES\\\",\\\"key\\\":192,\\\"iv\\\":16,\\\"mode\\\":\\\"CFB1\\\",\\\"type\\\":\\\"stream\\\"},\\\"aes-256-cfb1\\\":{\\\"cipher\\\":\\\"AES\\\",\\\"key\\\":256,\\\"iv\\\":16,\\\"mode\\\":\\\"CFB1\\\",\\\"type\\\":\\\"stream\\\"},\\\"aes-128-ofb\\\":{\\\"cipher\\\":\\\"AES\\\",\\\"key\\\":128,\\\"iv\\\":16,\\\"mode\\\":\\\"OFB\\\",\\\"type\\\":\\\"stream\\\"},\\\"aes-192-ofb\\\":{\\\"cipher\\\":\\\"AES\\\",\\\"key\\\":192,\\\"iv\\\":16,\\\"mode\\\":\\\"OFB\\\",\\\"type\\\":\\\"stream\\\"},\\\"aes-256-ofb\\\":{\\\"cipher\\\":\\\"AES\\\",\\\"key\\\":256,\\\"iv\\\":16,\\\"mode\\\":\\\"OFB\\\",\\\"type\\\":\\\"stream\\\"},\\\"aes-128-ctr\\\":{\\\"cipher\\\":\\\"AES\\\",\\\"key\\\":128,\\\"iv\\\":16,\\\"mode\\\":\\\"CTR\\\",\\\"type\\\":\\\"stream\\\"},\\\"aes-192-ctr\\\":{\\\"cipher\\\":\\\"AES\\\",\\\"key\\\":192,\\\"iv\\\":16,\\\"mode\\\":\\\"CTR\\\",\\\"type\\\":\\\"stream\\\"},\\\"aes-256-ctr\\\":{\\\"cipher\\\":\\\"AES\\\",\\\"key\\\":256,\\\"iv\\\":16,\\\"mode\\\":\\\"CTR\\\",\\\"type\\\":\\\"stream\\\"},\\\"aes-128-gcm\\\":{\\\"cipher\\\":\\\"AES\\\",\\\"key\\\":128,\\\"iv\\\":12,\\\"mode\\\":\\\"GCM\\\",\\\"type\\\":\\\"auth\\\"},\\\"aes-192-gcm\\\":{\\\"cipher\\\":\\\"AES\\\",\\\"key\\\":192,\\\"iv\\\":12,\\\"mode\\\":\\\"GCM\\\",\\\"type\\\":\\\"auth\\\"},\\\"aes-256-gcm\\\":{\\\"cipher\\\":\\\"AES\\\",\\\"key\\\":256,\\\"iv\\\":12,\\\"mode\\\":\\\"GCM\\\",\\\"type\\\":\\\"auth\\\"}}\");\n\n//# sourceURL=webpack:///./node_modules/browserify-aes/modes/list.json?");

/***/ }),

/***/ "./node_modules/browserify-aes/modes/ofb.js":
/*!**************************************************!*\
  !*** ./node_modules/browserify-aes/modes/ofb.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("/* WEBPACK VAR INJECTION */(function(Buffer) {var xor = __webpack_require__(/*! buffer-xor */ \"./node_modules/buffer-xor/index.js\")\n\nfunction getBlock (self) {\n  self._prev = self._cipher.encryptBlock(self._prev)\n  return self._prev\n}\n\nexports.encrypt = function (self, chunk) {\n  while (self._cache.length < chunk.length) {\n    self._cache = Buffer.concat([self._cache, getBlock(self)])\n  }\n\n  var pad = self._cache.slice(0, chunk.length)\n  self._cache = self._cache.slice(chunk.length)\n  return xor(chunk, pad)\n}\n\n/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../node-libs-browser/node_modules/buffer/index.js */ \"./node_modules/node-libs-browser/node_modules/buffer/index.js\").Buffer))\n\n//# sourceURL=webpack:///./node_modules/browserify-aes/modes/ofb.js?");

/***/ }),

/***/ "./node_modules/browserify-aes/streamCipher.js":
/*!*****************************************************!*\
  !*** ./node_modules/browserify-aes/streamCipher.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var aes = __webpack_require__(/*! ./aes */ \"./node_modules/browserify-aes/aes.js\")\nvar Buffer = __webpack_require__(/*! safe-buffer */ \"./node_modules/safe-buffer/index.js\").Buffer\nvar Transform = __webpack_require__(/*! cipher-base */ \"./node_modules/cipher-base/index.js\")\nvar inherits = __webpack_require__(/*! inherits */ \"./node_modules/inherits/inherits_browser.js\")\n\nfunction StreamCipher (mode, key, iv, decrypt) {\n  Transform.call(this)\n\n  this._cipher = new aes.AES(key)\n  this._prev = Buffer.from(iv)\n  this._cache = Buffer.allocUnsafe(0)\n  this._secCache = Buffer.allocUnsafe(0)\n  this._decrypt = decrypt\n  this._mode = mode\n}\n\ninherits(StreamCipher, Transform)\n\nStreamCipher.prototype._update = function (chunk) {\n  return this._mode.encrypt(this, chunk, this._decrypt)\n}\n\nStreamCipher.prototype._final = function () {\n  this._cipher.scrub()\n}\n\nmodule.exports = StreamCipher\n\n\n//# sourceURL=webpack:///./node_modules/browserify-aes/streamCipher.js?");

/***/ }),

/***/ "./node_modules/buffer-xor/index.js":
/*!******************************************!*\
  !*** ./node_modules/buffer-xor/index.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("/* WEBPACK VAR INJECTION */(function(Buffer) {module.exports = function xor (a, b) {\n  var length = Math.min(a.length, b.length)\n  var buffer = new Buffer(length)\n\n  for (var i = 0; i < length; ++i) {\n    buffer[i] = a[i] ^ b[i]\n  }\n\n  return buffer\n}\n\n/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../node-libs-browser/node_modules/buffer/index.js */ \"./node_modules/node-libs-browser/node_modules/buffer/index.js\").Buffer))\n\n//# sourceURL=webpack:///./node_modules/buffer-xor/index.js?");

/***/ }),

/***/ "./node_modules/evp_bytestokey/index.js":
/*!**********************************************!*\
  !*** ./node_modules/evp_bytestokey/index.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var Buffer = __webpack_require__(/*! safe-buffer */ \"./node_modules/safe-buffer/index.js\").Buffer\nvar MD5 = __webpack_require__(/*! md5.js */ \"./node_modules/md5.js/index.js\")\n\n/* eslint-disable camelcase */\nfunction EVP_BytesToKey (password, salt, keyBits, ivLen) {\n  if (!Buffer.isBuffer(password)) password = Buffer.from(password, 'binary')\n  if (salt) {\n    if (!Buffer.isBuffer(salt)) salt = Buffer.from(salt, 'binary')\n    if (salt.length !== 8) throw new RangeError('salt should be Buffer with 8 byte length')\n  }\n\n  var keyLen = keyBits / 8\n  var key = Buffer.alloc(keyLen)\n  var iv = Buffer.alloc(ivLen || 0)\n  var tmp = Buffer.alloc(0)\n\n  while (keyLen > 0 || ivLen > 0) {\n    var hash = new MD5()\n    hash.update(tmp)\n    hash.update(password)\n    if (salt) hash.update(salt)\n    tmp = hash.digest()\n\n    var used = 0\n\n    if (keyLen > 0) {\n      var keyStart = key.length - keyLen\n      used = Math.min(keyLen, tmp.length)\n      tmp.copy(key, keyStart, 0, used)\n      keyLen -= used\n    }\n\n    if (used < tmp.length && ivLen > 0) {\n      var ivStart = iv.length - ivLen\n      var length = Math.min(ivLen, tmp.length - used)\n      tmp.copy(iv, ivStart, used, used + length)\n      ivLen -= length\n    }\n  }\n\n  tmp.fill(0)\n  return { key: key, iv: iv }\n}\n\nmodule.exports = EVP_BytesToKey\n\n\n//# sourceURL=webpack:///./node_modules/evp_bytestokey/index.js?");

/***/ })

}]);