(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[66],{

/***/ "./src/doge.js":
/*!*********************!*\
  !*** ./src/doge.js ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("let muchIndex = 0;\nlet wowLength = 0;\nlet manyWords = null;\nlet suchInterval = null;\nlet muchPlay = false;\nlet wowElement = document.createElement(\"div\");\nlet suchColors = [\"#FF0000\", \"#00FF00\", \"#0000FF\"];\n\nfunction veryRandom(val) {\n  return Math.floor(Math.random() * val);\n}\n\nfunction placeWord(word) {\n  let muchWidth = window.innerWidth - 200; //Very random offset\n\n  let manyHeight = window.innerHeight - 26; //Such fontsize based offset\n\n  wowElement.textContent = word;\n  wowElement.style.left = veryRandom(muchWidth) + \"px\";\n  wowElement.style.top = veryRandom(manyHeight) + \"px\";\n  wowElement.style.color = suchColors[veryRandom(suchColors.length)];\n}\n\nfunction muchWords() {\n  muchPlay = true;\n  suchInterval = setInterval(function () {\n    if (muchIndex === wowLength - 1) {\n      muchIndex = 0;\n    } else {\n      muchIndex++;\n    }\n\n    placeWord(manyWords[muchIndex]);\n  }, 6000);\n}\n\nmodule.exports = class Doge {\n  constructor(words) {\n    if (!Array.isArray(words)) {\n      return console.error(\"Wow. Words is not array. Much Error.\");\n    }\n\n    if (words.length < 1) {\n      return console.error(\"Much dumb. Very fail. No words in array. Wow\");\n    }\n\n    wowLength = words.length;\n    manyWords = words;\n    wowElement.className = \"dogeTag\";\n    wowElement.style.position = \"fixed\";\n    wowElement.style.fontSize = \"26px\";\n    wowElement.style.fontFamily = '\"Comic Sans MS\"';\n    wowElement.style.zIndex = 10000001;\n    document.body.appendChild(wowElement);\n    muchWords();\n  }\n\n  stop() {\n    if (muchPlay) {\n      muchPlay = false;\n      clearInterval(suchInterval);\n    }\n\n    if (wowElement) wowElement.parentNode.removeChild(wowElement);\n  }\n\n};\n\n//# sourceURL=webpack:///./src/doge.js?");

/***/ })

}]);