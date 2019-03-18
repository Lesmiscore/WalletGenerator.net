const randombytes = require("randombytes");
const singlewallet = require("./ninja.singlewallet.js");

const seeder = (module.exports = {
  init: (function() {
    document.getElementById("generatekeyinput").value = "";
  })(),

  // number of mouse movements to wait for
  seedLimit: (function() {
    const num = randombytes(12)[11];
    return 200 + Math.floor(num);
  })(),

  seedCount: 0, // counter
  lastInputTime: new Date().getTime(),
  seedPoints: [],

  isDone: function() {
    // randomBytes uses crypto.getRandomValues for random
    return seeder.seedCount >= seeder.seedLimit;
  },

  // seed function exists to wait for mouse movement to add more entropy before generating an address
  seed: function(evt) {
    evt = evt || window.event;
    const timeStamp = new Date().getTime();
    // seeding is over now we generate and display the address
    if (seeder.seedCount === seeder.seedLimit) {
      seeder.seedCount++;
      singlewallet.open();
      document.getElementById("menu").style.visibility = "visible";
      seeder.removePoints();
    }
    // seed mouse position X and Y when mouse movements are greater than 40ms apart.
    else if (
      seeder.seedCount < seeder.seedLimit &&
      evt &&
      timeStamp - seeder.lastInputTime > 40
    ) {
      //SecureRandom.seedTime();
      //SecureRandom.seedInt16((evt.clientX * evt.clientY));
      seeder.showPoint(evt.clientX, evt.clientY);
      seeder.seedCount++;
      seeder.lastInputTime = new Date().getTime();
      seeder.showPool();
    }
  },

  // seed function exists to wait for mouse movement to add more entropy before generating an address
  seedKeyPress: function(evt) {
    evt = evt || window.event;
    // seeding is over now we generate and display the address
    if (seeder.seedCount === seeder.seedLimit) {
      seeder.seedCount++;
      singlewallet.open();
      document.getElementById("generate").style.display = "none";
      document.getElementById("menu").style.visibility = "visible";
      seeder.removePoints();
    }
    // seed key press character
    else if (seeder.seedCount < seeder.seedLimit && evt.which) {
      const timeStamp = new Date().getTime();
      // seed a bunch (minimum seedLimit) of times
      //SecureRandom.seedTime();
      //SecureRandom.seedInt8(evt.which);
      const keyPressTimeDiff = timeStamp - seeder.lastInputTime;
      //SecureRandom.seedInt8(keyPressTimeDiff);
      seeder.seedCount++;
      seeder.lastInputTime = new Date().getTime();
      seeder.showPool();
    }
  },

  showPool: function() {
    const poolHex = randombytes(256).toString("hex"); //Buffer.from(SecureRandom.pool).toString('hex');
    document.getElementById("seedpool").innerHTML = poolHex;
    document.getElementById("seedpooldisplay").innerHTML = poolHex;
    document.getElementById("mousemovelimit").innerHTML =
      seeder.seedLimit - seeder.seedCount;
  },

  showPoint: function(x, y) {
    const div = document.createElement("div");
    div.setAttribute("class", "seedpoint");
    div.style.top = y + "px";
    div.style.left = x + "px";

    // let's make the entropy 'points' grow and change color!
    let percentageComplete = seeder.seedCount / seeder.seedLimit;
    document.getElementById("progress-bar-percentage").style.width =
      Math.ceil(percentageComplete * 100) + "%";

    // for some reason, appending these divs to an IOS device breaks clicking altogether (?)
    if (
      navigator.platform !== "iPad" &&
      navigator.platform !== "iPhone" &&
      navigator.platform !== "iPod"
    ) {
      document.body.appendChild(div);
    }
    seeder.seedPoints.push(div);
  },

  removePoints: function() {
    for (let i = 0; i < seeder.seedPoints.length; i++) {
      document.body.removeChild(seeder.seedPoints[i]);
    }
    seeder.seedPoints = [];
  }
});
