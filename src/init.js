const { onload } = require("./misc.js");
const images = require("../src/autogen/images");
const coindex = require("../src/autogen/coindex");
require("./main.css");

onload(() => {
  document.getElementById("coinLogoImg").setAttribute("src", coindex["logos/bitcoin"]());
  document.getElementById("siteTitle").setAttribute("src", images["banner"]());
  document.getElementById("foldingInstructions").setAttribute("src", images["foldinginstructions"]());
  document.getElementById("frontPageImage").setAttribute("src", images["overview"]());
  require("./handlers.js");
  require("./ninja.onload.js");
});
