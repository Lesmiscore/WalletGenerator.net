const cheerio = require("cheerio");
const fs = require("fs");
const ndir = require("node-dir");

const realArgs = process.argv.slice(2);

const lang = realArgs[0] || "en";

// index.html
const htmlLang = {};
{
  const data = fs.readFileSync("src/index.html", "utf8");
  const $ = cheerio.load(data);
  $(".i18n").each(function() {
    const elem = $(this);
    const id = elem.attr("id");
    let value = "";
    if (elem.prop("tagName") !== "INPUT") {
      value = elem
        .text()
        .trim()
        .replace(/\n\s*/g, "\n")
        .replace(/\n/gm, "<br />");
    }
    htmlLang[id] = value;
  });
}

// all js files
const jsLang = {};
const extractorRegex = /translator\.get("([a-zA-Z0-9]+)")/g;
let files = [];
ndir.files("./src/", (err, res) => {
  files = res.filter(a => a.match(/\.js$/));
});
files.forEach(file => {
  const text = fs.readFileSync(file, "utf8");
  let m;
  do {
    m = extractorRegex.exec(text);
    if (m) {
      jsLang[m[0]] = "";
    }
  } while (m);
});

// original
const originalLang = require(`../l10n/${lang}.js`);

const combined = Object.assign({}, jsLang, htmlLang, originalLang);
//console.log(combined);

fs.writeFileSync(`./l10n/${lang}.js`, "module.exports=" + JSON.stringify(combined));
