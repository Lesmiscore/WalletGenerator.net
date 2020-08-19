// say goodbye to XHR and fetch
window.XMLHttpRequest = require("@nao20010128nao/void-xhr");
window.fetch = require("@nao20010128nao/void-fetch");

Promise.resolve()
  .then(() => import("./main.styl"))
  .then(() => import("./autogen/images"))
  .then((images) => {
    //document.getElementById("coinLogoImg").setAttribute("src", coindex["logos/bitcoin"]());
    document.getElementById("siteTitle").setAttribute("src", images["banner"]());
    document.getElementById("foldingInstructions").setAttribute("src", images["foldinginstructions"]());
    document.getElementById("frontPageImage").setAttribute("src", images["overview"]());
  })
  .then(() => import("./handlers.js"))
  .then(() => import("./ninja.onload.js"));
