const randombytes = require("randombytes");
const singlewallet = require("./ninja.singlewallet.js");

(function() {
  document.getElementById("generatekeyinput").value = "";
})();

// number of mouse movements to wait for
const seedLimit = (function() {
  const num = randombytes(12)[11];
  return 200 + Math.floor(num);
})();

let seedCount = 0; // counter
let lastInputTime = new Date().getTime();
let seedPoints = [];

const isDone = function() {
  // randomBytes uses crypto.getRandomValues for random
  return seedCount >= seedLimit;
};

// seed function exists to wait for mouse movement to add more entropy before generating an address
const seed = function(evt) {
  evt = evt || window.event;
  const timeStamp = new Date().getTime();
  // seeding is over now we generate and display the address
  if (seedCount === seedLimit) {
    seedCount++;
    singlewallet.open();
    document.getElementById("menu").style.visibility = "visible";
    removePoints();
  }
  // seed mouse position X and Y when mouse movements are greater than 40ms apart.
  else if (seedCount < seedLimit && evt && timeStamp - lastInputTime > 40) {
    //SecureRandom.seedTime();
    //SecureRandom.seedInt16((evt.clientX * evt.clientY));
    showPoint(evt.clientX, evt.clientY);
    seedCount++;
    lastInputTime = new Date().getTime();
    showPool();
  }
};

// seed function exists to wait for mouse movement to add more entropy before generating an address
const seedKeyPress = function(evt) {
  evt = evt || window.event;
  // seeding is over now we generate and display the address
  if (seedCount === seedLimit) {
    seedCount++;
    singlewallet.open();
    document.getElementById("generate").style.display = "none";
    document.getElementById("menu").style.visibility = "visible";
    removePoints();
  }
  // seed key press character
  else if (seedCount < seedLimit && evt.which) {
    const timeStamp = new Date().getTime();
    // seed a bunch (minimum seedLimit) of times
    //SecureRandom.seedTime();
    //SecureRandom.seedInt8(evt.which);
    const keyPressTimeDiff = timeStamp - lastInputTime;
    //SecureRandom.seedInt8(keyPressTimeDiff);
    seedCount++;
    lastInputTime = new Date().getTime();
    showPool();
  }
};

const showPool = function() {
  const poolHex = randombytes(256).toString("hex"); //Buffer.from(SecureRandom.pool).toString('hex');
  document.getElementById("seedpool").innerHTML = poolHex;
  document.getElementById("seedpooldisplay").innerHTML = poolHex;
  document.getElementById("mousemovelimit").innerHTML = seedLimit - seedCount;
};

const showPoint = function(x, y) {
  const div = document.createElement("div");
  div.setAttribute("class", "seedpoint");
  div.style.top = y + "px";
  div.style.left = x + "px";

  // let's make the entropy 'points' grow and change color!
  let percentageComplete = seedCount / seedLimit;
  document.getElementById("progress-bar-percentage").style.width = Math.ceil(percentageComplete * 100) + "%";

  // for some reason, appending these divs to an IOS device breaks clicking altogether (?)
  if (navigator.platform !== "iPad" && navigator.platform !== "iPhone" && navigator.platform !== "iPod") {
    document.body.appendChild(div);
  }
  seedPoints.push(div);
};

const removePoints = function() {
  for (let i = 0; i < seedPoints.length; i++) {
    document.body.removeChild(seedPoints[i]);
  }
  seedPoints = [];
};

module.exports = {
  isDone,
  seed,
  seedKeyPress,
  showPool,
  showPoint,
  removePoints
};

Object.defineProperty(module.exports, "seedLimit", {
  enumerable: true,
  get: () => seedLimit
});
Object.defineProperty(module.exports, "seedCount", {
  enumerable: true,
  get: () => seedCount,
  set: pm => (seedCount = pm)
});
