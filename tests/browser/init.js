/* global mocha */
async function load() {
  await import("../../src/init.js");
  const onload = (await import("../../src/ninja.misc")).onload;
  const mochaDiv = document.createElement("div");
  mochaDiv.id = "mocha";
  document.body.appendChild(mochaDiv);
  await Promise.all([import("mocha/mocha.css"), import("mocha")]);
  mocha.setup("bdd");
  mocha.checkLeaks();

  await import("./coinimage.js");
  await import("../bitcoin.js");

  onload(() => {
    mocha.run();
  });
}

load()
  .then(() => {})
  .catch(console.err);
