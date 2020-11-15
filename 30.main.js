(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[30],{

/***/ "./src/ninja.donatetab.js":
/*!********************************!*\
  !*** ./src/ninja.donatetab.js ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("module.exports = async function () {\n  const qrCode = await Promise.all(/*! import() */[__webpack_require__.e(16), __webpack_require__.e(14)]).then(__webpack_require__.t.bind(null, /*! ./ninja.qrcode */ \"./src/ninja.qrcode/index.js\", 7));\n  const janin = await __webpack_require__.e(/*! import() */ 13).then(__webpack_require__.t.bind(null, /*! ./janin.currency.js */ \"./src/janin.currency.js\", 7));\n\n  const open = function () {\n    document.getElementById(\"donatearea\").style.display = \"block\";\n  };\n\n  const close = function () {\n    document.getElementById(\"donatearea\").style.display = \"none\";\n  };\n\n  const displayQrCode = function (currencyid, e) {\n    const keyValuePair = {};\n    keyValuePair[\"donateqrcode\"] = janin.currencies[currencyid].donate;\n    qrCode.showQrCode(keyValuePair, 4);\n    document.getElementById(\"donateqrcode\").style.display = \"block\";\n    document.getElementById(\"donateqrcode\").style.top = e.offsetTop + 15 + \"px\";\n  };\n\n  return {\n    open,\n    close,\n    displayQrCode\n  };\n}();\n\nmodule.exports.__esModule = true;\n\n//# sourceURL=webpack:///./src/ninja.donatetab.js?");

/***/ })

}]);