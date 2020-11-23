module.exports = (async function () {
  const translator = await import("./ninja.translator.js");
  const janin = await import("./janin.currency.js");
  const { getQueryString, envSecurityCheck, browserSecurityCheck, ev, createElement } = await import("./ninja.misc.js");
  const query = getQueryString();

  let i, a, x;

  // change language
  if (query["culture"]) {
    translator.translate(query["culture"]);
  } else {
    translator.autodetectTranslation();
  }
  if (query["showseedpool"] === "true" || query["showseedpool"] === "1") {
    document.getElementById("seedpoolarea").style.display = "block";
  }
  // change currency
  const currency = (query["currency"] || "bitcoin").toLowerCase();
  let coinFound = false,
    bitcoinIdx = -1;
  for (i = 0; i < janin.currencies.length; i++) {
    const curName = janin.currencies[i].name.toLowerCase();
    if (curName === currency) {
      await janin.useCurrency(i);
      coinFound = true;
    }
    if (curName === "bitcoin") {
      bitcoinIdx = i;
    }
  }
  if (!coinFound) {
    await janin.useCurrency(bitcoinIdx);
  }
  // Reset title if no currency is choosen
  if (!query["currency"]) {
    document.title = translator.get("defaultTitle");
    document.getElementById("siteTitle").alt = translator.get("defaultTitle");
  }
  // populate currency dropdown list
  const select = document.getElementById("currency");
  for (i = 0; i < janin.currencies.length; i++) {
    const curr = janin.currencies[i];
    select.appendChild(
      createElement(
        "option",
        {
          value: i,
          selected: curr.name === janin.name() ? "selected" : undefined,
        },
        curr.name
      )
    );
  }
  // populate supported currency list
  const supportedcurrencies = document.getElementById("supportedcurrencies");
  let j = 0;
  for (i = 0; i < janin.currencies.length; i++) {
    const curr = janin.currencies[i];
    if (!curr.shouldAddCoinList()) continue;
    let href = "?currency=" + curr.name;
    if (query["culture"]) href += "&culture=" + query["culture"];
    supportedcurrencies.appendChild(createElement("a", { href }, curr.name));
    // this is needed to reproduce same behavior as old string-concatenation method
    supportedcurrencies.appendChild(document.createTextNode(" "));
    j++;
  }
  document.getElementById("supportedcurrenciescounter").textContent = j.toString() + " ";
  // populate donate list
  document.getElementById("donateqrcode").style.display = "none";
  const donateList = document.getElementById("donateqrcode");
  const donateTable = document.createElement("table");
  for (i = 0; i < janin.currencies.length; i++) {
    if (!janin.currencies[i].donate) continue;
    const donateLink = createElement("tr", { id: "currencydonatelink" + i }, [
      createElement("td", { class: "currencyNameColumn" }, janin.currencies[i].name),
      createElement("td", { class: "address" }, [createElement("a", { href: janin.currencies[i].name.toLowerCase() + ":" + janin.currencies[i].donate }, janin.currencies[i].donate)]),
    ]);
    donateTable.appendChild(donateLink);
  }
  donateList.appendChild(donateTable);
  for (i = 0; i < janin.currencies.length; i++) {
    if (!janin.currencies[i].donate) continue;
    ev("tr#currencydonatelink" + i, "mouseover", async function () {
      (await import("./ninja.donatetab.js")).displayQrCode(21, this);
    });
  }

  // Extract i18n
  if (query["i18nextract"]) {
    const culture = query["i18nextract"];

    a = document.getElementsByClassName("i18n");

    const obj = Object.create(null);
    const cultureData = (obj[culture] = Object.create(null));

    for (x = 0; x < a.length; x++) {
      cultureData[a[x].id] = "(ENGLISH)" + cleani18n(a[x].innerHTML);
    }
    for (x = 0; x < translator.staticID.length; x++) {
      let value = "";
      if (translator.translations[culture] && translator.translations[culture][translator.staticID[x]]) value += cleani18n(translator.translations[culture][translator.staticID[x]]);
      else value += "(ENGLISH)" + cleani18n(translator.translations["en"][translator.staticID[x]]);
      cultureData[translator.staticID[x]] = value;
    }
    const div = createElement(
      "div",
      {
        style: "text-align: center",
      },
      [
        createElement("h3", {}, "i18n"),
        createElement(
          "textarea",
          {
            rows: "30",
            style: "width: 99%",
            wrap: "off",
          },
          JSON.stringify(obj, null, "  ")
        ),
      ]
    );

    document.body.appendChild(div);
  }
  function cleani18n(string) {
    return string
      .replace(/^\s\s*/, "")
      .replace(/\s\s*$/, "") // remove leading and trailing space
      .replace(/\s*\n+\s*/g, "\\n") // replace new line
      .replace(/"/g, '\\"');
  }

  await envSecurityCheck();
  await browserSecurityCheck();

  (await import("./ninja.singlewallet.js")).open();
})();
module.exports.__esModule = true;
