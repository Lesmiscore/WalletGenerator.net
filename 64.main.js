(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[64],{

/***/ "./src/coins/zcash/t-address.js":
/*!**************************************!*\
  !*** ./src/coins/zcash/t-address.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("module.exports = async function () {\n  const zcash = await Promise.all(/*! import() */[__webpack_require__.e(1), __webpack_require__.e(0), __webpack_require__.e(2), __webpack_require__.e(3), __webpack_require__.e(5), __webpack_require__.e(6), __webpack_require__.e(7), __webpack_require__.e(4), __webpack_require__.e(8), __webpack_require__.e(10), __webpack_require__.e(11), __webpack_require__.e(17)]).then(__webpack_require__.t.bind(null, /*! bitgo-utxo-lib */ \"./node_modules/bitgo-utxo-lib/src/index.js\", 7));\n  const Bitcoin = await Promise.all(/*! import() */[__webpack_require__.e(0), __webpack_require__.e(22)]).then(__webpack_require__.t.bind(null, /*! ../bitcoin */ \"./src/coins/bitcoin.js\", 7));\n  const {\n    upperValue,\n    lowerValue\n  } = await Promise.all(/*! import() */[__webpack_require__.e(0), __webpack_require__.e(28)]).then(__webpack_require__.t.bind(null, /*! ../constants */ \"./src/coins/constants.js\", 7));\n  return class ZcashT extends Bitcoin {\n    constructor(name, networkVersion, privateKeyPrefix, donate) {\n      super(name, networkVersion, privateKeyPrefix, donate, undefined, undefined, zcash.coins.ZEC);\n    }\n\n    getAddressFormatNames() {\n      return [\"Compressed\", \"Uncompressed\" // no segwit\n      // no cashaddress\n      ];\n    }\n\n    getAddressTitleNames() {\n      return [\"Public Address Compressed\", \"Public Address\"];\n    }\n\n    isVanitygenPossible(pattern, mode) {\n      if (!pattern) return true;\n      const btcB58 = \"[123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]{0,34}$\";\n\n      function testBase58(pkh) {\n        const begin = zcash.address.toBase58Check(upperValue, pkh).slice(0, 2);\n        const final = zcash.address.toBase58Check(lowerValue, pkh).slice(0, 2);\n        const regex = new RegExp(`^(?:${begin}|${final})${btcB58}`);\n        return regex.test(pattern);\n      }\n\n      switch (mode || 0) {\n        default:\n        case 0: // compressed\n\n        case 1:\n          // uncompressed\n          return testBase58(this.network.pubKeyHash);\n      }\n    }\n\n  };\n}();\n\nmodule.exports.__esModule = true;\n\n//# sourceURL=webpack:///./src/coins/zcash/t-address.js?");

/***/ })

}]);