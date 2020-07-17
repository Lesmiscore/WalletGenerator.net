// say goodbye to XHR and fetch
window.XMLHttpRequest = require("@nao20010128nao/void-xhr");
window.fetch = require("@nao20010128nao/void-fetch");

const { onload } = require("./ninja.misc.js").default;
const images = require("../src/autogen/images");
require("./main.styl");

onload(() => {
  //document.getElementById("coinLogoImg").setAttribute("src", coindex["logos/bitcoin"]());
  document.getElementById("siteTitle").setAttribute("src", images["banner"]());
  document.getElementById("foldingInstructions").setAttribute("src", images["foldinginstructions"]());
  document.getElementById("frontPageImage").setAttribute("src", images["overview"]());
  require("./handlers.js");
  require("./ninja.onload.js");
});
