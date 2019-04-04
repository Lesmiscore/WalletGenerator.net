let muchIndex = 0;
let wowLength = 0;
let manyWords = null;
let suchInterval = null;
let muchPlay = false;
let wowElement = document.createElement("div");
let suchColors = ["#FF0000", "#00FF00", "#0000FF"];

function veryRandom(val) {
  return Math.floor(Math.random() * val);
}

function placeWord(word) {
  let muchWidth = window.innerWidth - 200; //Very random offset
  let manyHeight = window.innerHeight - 26; //Such fontsize based offset

  wowElement.textContent = word;
  wowElement.style.left = veryRandom(muchWidth) + "px";
  wowElement.style.top = veryRandom(manyHeight) + "px";
  wowElement.style.color = suchColors[veryRandom(suchColors.length)];
}

function muchWords() {
  muchPlay = true;
  suchInterval = setInterval(function() {
    if (muchIndex === wowLength - 1) {
      muchIndex = 0;
    } else {
      muchIndex++;
    }

    placeWord(manyWords[muchIndex]);
  }, 6000);
}

module.exports = class Doge {
  constructor(words) {
    if (!Array.isArray(words)) {
      return console.error("Wow. Words is not array. Much Error.");
    }
    if (words.length < 1) {
      return console.error("Much dumb. Very fail. No words in array. Wow");
    }
    wowLength = words.length;
    manyWords = words;
    wowElement.className = "dogeTag";
    wowElement.style.position = "fixed";
    wowElement.style.fontSize = "26px";
    wowElement.style.fontFamily = '"Comic Sans MS"';
    wowElement.style.zIndex = 10000001;
    document.body.appendChild(wowElement);
    muchWords();
  }
  stop() {
    if (muchPlay) {
      muchPlay = false;
      clearInterval(suchInterval);
    }
    if (wowElement) wowElement.parentNode.removeChild(wowElement);
  }
};
