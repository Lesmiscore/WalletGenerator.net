(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[70],{

/***/ "./node_modules/base58/src/base58.js":
/*!*******************************************!*\
  !*** ./node_modules/base58/src/base58.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("const alphabet = \"123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ\";\nconst base = alphabet.length;\n\n// Create a lookup table to fetch character index\nconst alphabetLookup = [...alphabet].reduce((lookup, char, index) => {\n  lookup[char] = index;\n  return lookup;\n}, {});\n\nfunction assertNonNegativeSafeInteger(val) {\n  if (\n    typeof val !== \"number\" ||\n    isNaN(val) ||\n    val < 0 ||\n    val > Number.MAX_SAFE_INTEGER ||\n    Math.floor(val) !== val\n  ) {\n    throw new Error(\"Value passed is not a non-negative safe integer.\");\n  }\n}\n\nfunction assertString(str) {\n  if (typeof str !== \"string\") {\n    throw new Error(\"Value passed is not a string.\");\n  }\n}\n\nfunction assertBase58Character(character) {\n  if (alphabetLookup[character] === undefined) {\n    throw new Error(\"Value passed is not a valid Base58 string.\");\n  }\n}\n\nexports.int_to_base58 = exports.encode = function(num) {\n  let str = \"\";\n  let modulus;\n\n  num = Number(num);\n\n  assertNonNegativeSafeInteger(num);\n\n  while (num >= base) {\n    modulus = num % base;\n    str = alphabet[modulus] + str;\n    num = Math.floor(num / base);\n  }\n\n  return alphabet[num] + str;\n};\n\nexports.base58_to_int = exports.decode = function(str) {\n  assertString(str);\n\n  return [...str].reverse().reduce((num, character, index) => {\n    assertBase58Character(character);\n    return num + alphabetLookup[character] * Math.pow(base, index);\n  }, 0);\n};\n\n\n//# sourceURL=webpack:///./node_modules/base58/src/base58.js?");

/***/ })

}]);