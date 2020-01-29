const translator = require("./ninja.translator.js");
const Doge = require("./doge.js");
const _ = require("./lodash");

const Bitcoin = require("./coins/bitcoin");
const Zcash = require("./coins/zcash");
const BitcoinCash = require("./coins/bitcoincash");
const Ethereum = require("./coins/ethereum");
const NEM = require("./coins/nem");
const Ripple = require("./coins/ripple");
const IOTA = require("./coins/iota");

let selectedCurrency, doge;

const name = function() {
  return selectedCurrency.name;
};

// Switch currency
const useCurrency = function(index) {
  selectedCurrency = currencies[index];
  const lowerCurrency = name().toLowerCase();

  const singlewallet = require("./ninja.singlewallet.js");
  const paperwallet = require("./ninja.paperwallet.js");
  const brainwallet = require("./ninja.brainwallet.js");
  const bulkwallet = require("./ninja.bulkwallet.js");

  const coinImgUrl = selectedCurrency.getCoinImageUrl();
  document.getElementById("coinLogoImg").src = coinImgUrl;

  // Update title depending on currency
  document.title = name() + " " + translator.get("title");
  document.getElementById("siteTitle").alt = name() + " " + translator.get("title");

  // Update i18n link
  document.getElementById("cultureen").href = "?culture=en&currency=" + lowerCurrency;
  document.getElementById("culturefr").href = "?culture=fr&currency=" + lowerCurrency;
  document.getElementById("culturede").href = "?culture=de&currency=" + lowerCurrency;
  document.getElementById("culturenl").href = "?culture=nl&currency=" + lowerCurrency;
  document.getElementById("culturept").href = "?culture=pt&currency=" + lowerCurrency;
  document.getElementById("cultureru").href = "?culture=ru&currency=" + lowerCurrency;
  document.getElementById("culturees").href = "?culture=es&currency=" + lowerCurrency;
  document.getElementById("cultureua").href = "?culture=ua&currency=" + lowerCurrency;
  document.getElementById("culturetr").href = "?culture=tr&currency=" + lowerCurrency;
  document.getElementById("cultureit").href = "?culture=it&currency=" + lowerCurrency;
  document.getElementById("culturepl").href = "?culture=pl&currency=" + lowerCurrency;
  document.getElementById("culturezh").href = "?culture=zh&currency=" + lowerCurrency;

  // set modes and stop vanitygen
  const coinDefaultMode = selectedCurrency.defaultMode;
  paperwallet.publicMode = coinDefaultMode;
  singlewallet.publicMode = coinDefaultMode;
  bulkwallet.publicMode = coinDefaultMode;
  brainwallet.publicMode = coinDefaultMode;

  singlewallet.stopVanitygen();

  // Regenerate a new wallet when not expensive
  singlewallet.generateNewAddressAndKey();
  paperwallet.build(document.getElementById("paperpassphrase").value);
  brainwallet.view();

  // Reset wallet tab when expensive or not applicable
  document.getElementById("bulktextarea").value = "";
  document.getElementById("suppliedPrivateKey").value = "";

  // make a table and dropdown from currency instance
  let publicQrTable = "";
  let chunkId = 0;
  for (let [first, second] of _.chunk(selectedCurrency.getAddressTitleNames(), 2)) {
    publicQrTable += `<tr id="pubqr${chunkId}" class="pubqr">`;
    const firstStripped = first.toLowerCase().replace(/[^a-z0-9]/g, "");
    publicQrTable += `
<td class="item">
  <span class="label" id="label${firstStripped}">${first}</span>
  <div id="detailqrcode${firstStripped}" class="qrcode_public left"></div>
  <span class="output" id="detailaddress${firstStripped}"></span>
</td>
`;
    if (second) {
      const secondStripped = second.toLowerCase().replace(/[^a-z0-9]/g, "");
      publicQrTable += `
<td class="item right">
  <span class="label" id="label${secondStripped}">${second}</span>
  <div id="detailqrcode${secondStripped}" class="qrcode_public right"></div>
  <span class="output" id="detailaddress${secondStripped}"></span>
</td>
`;
    }
    publicQrTable += "</tr>";
    chunkId++;
  }
  document.getElementById("pubaddress").innerHTML = publicQrTable;

  let privateQrTable = "";
  chunkId = 0;
  for (let [first, second] of _.chunk(selectedCurrency.getWIFTitleNames(), 2)) {
    privateQrTable += `<tr id="privqr${chunkId}" class="privqr">`;
    const firstStripped = first.toLowerCase().replace(/[^a-z0-9]/g, "");
    privateQrTable += `
<td class="item">
  <span class="label" id="label${firstStripped}">${first}</span>
  <div id="detailqrcode${firstStripped}" class="qrcode_private left"></div>
  <span class="output" id="detailaddress${firstStripped}"></span>
</td>
`;
    if (second) {
      const secondStripped = second.toLowerCase().replace(/[^a-z0-9]/g, "");
      privateQrTable += `
<td class="item right">
  <span class="label" id="label${secondStripped}">${second}</span>
  <div id="detailqrcode${secondStripped}" class="qrcode_private right"></div>
  <span class="output" id="detailaddress${secondStripped}"></span>
</td>
`;
    }
    privateQrTable += "</tr>";
    chunkId++;
  }
  document.getElementById("privaddress").innerHTML = privateQrTable;

  const formatNames = selectedCurrency.getAddressFormatNames();
  let addrTypeDropdown = "";
  for (let i in formatNames) {
    if ({}.hasOwnProperty.call(formatNames, i)) {
      if (+i === coinDefaultMode) {
        addrTypeDropdown += `<option value="${i}" selected>${formatNames[i]}</option>`;
      } else {
        addrTypeDropdown += `<option value="${i}">${formatNames[i]}</option>`;
      }
    }
  }
  document.getElementById("addresstype").innerHTML = addrTypeDropdown;
  document.getElementById("singleaddresstype").innerHTML = addrTypeDropdown;
  document.getElementById("bulkaddresstype").innerHTML = addrTypeDropdown;
  document.getElementById("brainaddresstype").innerHTML = addrTypeDropdown;

  // show banner to ask for help
  const unsureFlag = selectedCurrency.isUnsure();
  if (selectedCurrency.isUnsure()) {
    document.getElementById("unsure").style.display = "block";
    if (typeof unsureFlag === "boolean") {
      document.getElementById("unsureHere").setAttribute("href", `https://github.com/nao20010128nao/WalletGenerator.net/blob/master/src/coins/${name().toLowerCase()}.js`);
    } else {
      document.getElementById("unsureHere").setAttribute("href", `https://github.com/nao20010128nao/WalletGenerator.net/blob/master/src/coins/${unsureFlag}.js`);
    }
  } else {
    document.getElementById("unsure").style.display = "none";
  }

  // easter egg doge ;)
  if (name() === "Dogecoin") {
    doge = new Doge(["wow", "so paper wallet", "such random", "very pretty", "much design", "awesome", "much crypto", "such coin", "wow!!", "to da moon"]);
  } else if (doge) {
    doge.stop();
    doge = null;
  }
};

let currencies = [
  //          name, networkVersion, privateKeyPrefix, WIF_Start, CWIF_Start, donate, scriptHash, b32hrp
  new Bitcoin("2GIVE", 0x27, 0xa7, "Givewmf4yv8uuHZG6Eb7sm17fJS2Trf6U8"),
  new Bitcoin("42coin", 0x08, 0x88, "4Fs42jYtLYrUMfKEXc6arojuhRsnYnerxN"),
  new Bitcoin("Acoin", 0x17, 0xe6, "AJvChtExuvLgAor9aw1Xz9bkvJY7JKD9uL"),
  new Bitcoin("AGAcoin", 0x53, 0xd3, "aWg2jDBnecc17UHrDF5Rz5pj1rTqTDTnTH"),
  new Bitcoin("Alphacoin", 0x52, 0xd2, "aAWhiGBDUugXC9ZBvw8CDNQH7KRurjy4Nq"),
  new Bitcoin("Alqo", 0x17, 0xc1, "ALF9ykkthT5UwmqdrThMRGb1GNgdCUciHL"),
  new Bitcoin("Animecoin", 0x17, 0x97, "AdA5nLS5FtPws6A3BX8aXccbP7fReptdw7"),
  new Bitcoin("Anoncoin", 0x17, 0x97, "AS3BvkE4wvsXJpn1bGhQni5vZajthnrWQE"),
  new Bitcoin("Apexcoin", 0x17, 0x97, "AdPxUCGLDUhHUTGYftffwFVdxbFy2nkXGX"),
  new Bitcoin("Aquariuscoin", 0x17, 0x97, "ARk4VoaCHDoPDn2dctGizJaHFvXNRiDUDr"),
  new Bitcoin("Auroracoin", 0x17, 0x97, "AVWH1ZutLd4Y5LPDDj5FkBjbm2Gci4iFx3"),
  new Bitcoin("Axe", 0x4b, 0xcb, ""),
  new Bitcoin("BBQcoin", 0x55, 0xd5, "bTFFC3Gg2XzQygLxxakHkNM3ravBZby1y9"),
  new Bitcoin("Bellcoin", 0x19, 0x80, "BEDspA3yyg8LhzLA75e8J1kR7bSiMAMmXb", 0x55, "bm"),
  new Bitcoin("Biblepay", 0x19, 0xb6, "BDvP86n4oVsLnFh1tCRXWLgBPK6ZtKrJQa"),
  new Bitcoin("Birdcoin", 0x2f, 0xaf, "L97vGT4wRnyyiugHpLXzZzjqueN8YWRdRJ"),
  new Bitcoin("Bitcoin", 0x00, 0x80, "15DHZzv7eBUwss77qczZiL3DUEZLjDYhbM", 0x05, "bc"),
  new BitcoinCash("BitcoinCash", 0x00, 0x80, "15DHZzv7eBUwss77qczZiL3DUEZLjDYhbM"),
  new Bitcoin("BitcoinDark", 0x3c, 0xbc, "RWtY5fg9ZQ9tYaPd7WJLgsdae1m1ZfrVRe"),
  new Bitcoin("BitcoinGold", 0x26, 0x80, "GYjahzU24Am88oZco6oFtpNzgwJTp9S4eB"),
  new Bitcoin("Bitconnect", 0x12, 0x92, "8Zixqosp1KFejfcVQzTWa2EsPa2VxSgeJX"),
  new Bitcoin("Bitcore", 0x00, 0x80, "1H7fhCsyRfPP8XnJWhezXmi9YNqtBh9xxW"),
  new Bitcoin("BitSynq", 0x3f, 0xbf, "SRtKRZxSjjwb9BXujkmvLfRHiutk7s7VXh"),
  new Bitcoin("BitZeny", 0x51, 0x80, "ZxUsfFszPsKdot4XnoZHZcMKg2PPS3NUji", 0x05, "sz"),
  new Bitcoin("Blackcoin", 0x19, 0x99, "BFeJrZGyJ6bntd7RLXoNGvdn1HB5AQeiz4"),
  new Bitcoin("BlackJack", 0x15, 0x95, "9pzHRZkJ4Df3EBiqXhDVgtB2A7FaAq6nnG"),
  new Bitcoin("BlockNet", 0x1a, 0x9a, "BhGtBAnfp7EUvbVr7R7uTJyHXF7Kt17wni"),
  new Bitcoin("BolivarCoin", 0x55, 0xd5, "1J1HqJd2CRyacjEkMXxGzWVUYq6XfRqJEP"),
  new Bitcoin("BoxyCoin", 0x4b, 0xcb, "9pzHRZkJ4Df3EBiqXhDVgtB2A7FaAq6nnG"),
  new Bitcoin("BunnyCoin", 0x1a, 0x9a, "BosRXiiSB6WmiSbvzVAdUjpezCWhqpJGyW"),
  new Bitcoin("C2coin", 0x1c, 0x9c, "Cd3kyj77p2zivnqbcoBzNya7LD1w7uUU9v"),
  new Bitcoin("Cagecoin", 0x1f, 0x9f, "DjUXeu9pUYq5RsN7qpowb1C8LcvPNi9Bx3"),
  new Bitcoin("CampusCoin", 0x1c, 0x9c, "Cawn4BSvSuPFHk3wo43Nm85CG8TW1Y2s1H"),
  new Bitcoin("CanadaeCoin", 0x1c, 0x9c, "CbaoyW9KYP8qQHb9Lu59crvjemryCD88Hv"),
  new Bitcoin("CannabisCoin", 0x1c, 0x9c, "Cb7SSkHpnk1PwKqKbreMALzJpnmAsBNvnG"),
  new Bitcoin("Capricoin", 0x1c, 0x9c, "CS1mBL1dyCR8jH5hRrQiZ4Xz37UWwcbUAJ"),
  new Bitcoin("CashCoin", 0x22, 0xa2, "F3bkQC7xGZZcPFmsucYas7KuHoEwCPtGHC"),
  new Bitcoin("CassubianDetk", 0x1e, 0x9e, "DBPagysmjfdkND4Zp1SM4myLenNfXpFWnG"),
  new Bitcoin("Catcoin", 0x15, 0x95, "9rEXDemG6S3k2ddAsKFzRpnMVz3bVryYXZ"),
  new Bitcoin("ChainCoin", 0x1c, 0x9c, "Ca62ZnR3sfKotqDJzsBW6k75rTFFgFkw1x"),
  new Bitcoin("ColossusCoinXT", 0x1e, 0xd4, "D9buTahK9CXNxoGzXLZ9tamwrQzdW2MzvG"),
  new Bitcoin("Condensate", 0x3c, 0xbc, "RRZZMHaYZXCeUWRVeRvttKCNcvTRCxBfqD"),
  new Bitcoin("Copico", 0x1c, 0x90, "CKWBhVUwQP4fRw6xJk4nxCqKYCMz74bPKr"),
  new Bitcoin("CopperCoin", 0x1c, 0x9c, "CXh8p64WqmEwTkQSDk9azaZUqrnXE9WESV"),
  new Bitcoin("Corgicoin", 0x1c, 0x9c, "CNwV11TaKrfB3TnBS8vQjNbWT6CNxV8GBi"),
  new Bitcoin("CryptoBullion", 0x0b, 0x8b, "Cd9CgzTChm9yJQZ3SL3PUSsMkEEN8LGwCF"),
  new Bitcoin("CryptoClub", 0x23, 0xa3, "FKPFTw5LjoeGTZP1d3zHLfZNm91FktgPWY"),
  new Bitcoin("Cryptoescudo", 0x1c, 0x9c, "Cd9CgzTChm9yJQZ3SL3PUSsMkEEN8LGwCF"),
  new Bitcoin("Cryptonite", 0x1c, 0x80, "CP6uhgcDnXzdgQhnz2q1xhSFMFinmqkQkh"),
  new Bitcoin("CryptoWisdomCoin", 0x49, 0x87, "WYeSz9KmpjgdtycPiJVPcQdp7bBqECfr3W"),
  new Bitcoin("Dash", 0x4c, 0xcc, "XdYX6AbDzjb3AVL1tAmWjuYMD28LD9fcWS"),
  new Bitcoin("DeafDollars", 0x30, 0xb0, "LNHYnoqySwoN5aMyEVavEBT3CxHA9WrTZs"),
  new Bitcoin("DeepOnion", 0x1f, 0x9f, "DhUAMCqydnYNx9PmeQ1wnyeyAxi477DbTz"),
  new Bitcoin("Deutsche eMark", 0x35, 0xb5, "Ni4112Tmv1ScZ9fkN76knJ4jRTxeHQieJM"),
  new Bitcoin("Devcoin", 0x00, 0x80, "1GUeBfpVhN7xySQej3HiSe5c8jQoVQPosv"),
  new Bitcoin("DigiByte", 0x1e, 0x9e, "D9s71nQPBCEbM2SvGwHQcrhay6KrJaVo3Z"),
  new Bitcoin("Digitalcoin", 0x1e, 0x9e, "D7fJwPfW4dFSJNq4NHbMiYJhYnrZehMpqx"),
  new Bitcoin("Dimecoin", 0x0f, 0x8f, "7CRKjq135uBC2FgatpAzoJFLPRGL9gCqVp"),
  new Bitcoin("DNotes", 0x1f, 0x9f, "DqmNyJd9xiaNpE65meAYX6EqJCFDwhsQoX"),
  new Bitcoin("Dogecoin", 0x1e, 0x9e, "D74Npoqhwhjw9fShkm5wbj6DD2BJXpmzPj"),
  new Bitcoin("DogecoinDark", 0x1e, 0x9e, "DLbjdRYsfiT62JZf5YxSAfNZJo1VKxDTNP"),
  new Bitcoin("eGulden", 0x30, 0xb0, "LhBsKs2GUb24KBAzZfua5AsqfQF5uPdWXQ"),
  new Bitcoin("eKrona", 0x2d, 0xad, "KLi8FnMZmSH8EfXYgJwi4R2ZyMscJykXT5"),
  new Bitcoin("ELECTRA", 0x21, 0xa1, "EeJGVF9efipxqJcwf7dup735ATEDc2f1Yk"),
  new Bitcoin("Ember", 0x5c, 0x32, "eGFUogU3DceaBgY5a6qBQC22WwYsboG2gw"),
  new Bitcoin("Emerald", 0x22, 0xa2, "EnJnzAQSpPp7RshMhNx9zhRnabxTLird6W"),
  new Bitcoin("Emercoin", 0x21, 0x80, "EN5nVyEbLrhYfcjoyGgQFtD3QHETyj1dy1"),
  new Bitcoin("EnergyCoin", 0x5c, 0xdc, "eD2P3q5PdyHYNwT94Dg6Wt4pBz64k8gwGf"),
  new Bitcoin("Espers", 0x21, 0x90, "EVB5z1zoYYZrjUnGw3fekn1aMjfVhMUKHW"),
  new Ethereum("Ethereum"),
  new Bitcoin("Fastcoin", 0x60, 0xe0, "frxe8F7gQdiAVgy4mRXjpXH5vN1wyta1db"),
  new Bitcoin("Feathercoin", 0x0e, 0x8e, "6dxAP6oacHsove5X2kZPpddcT1Am167YzC"),
  new Bitcoin("Fedoracoin", 0x21, 0x80, "ENRPj6iEh14Xky2hv4B7zTJGMe5Kchjeo8"),
  new Bitcoin("Fibre", 0x23, 0xa3, "F6qGSM29vJm2q3Q9uvozpym7WYqKXBrpqm"),
  new Bitcoin("Florincoin", 0x23, 0xb0, "FLJ7vLPZDLMVr2KPEvZMgWvh8TCXj5Bn3m"),
  new Bitcoin("Flurbo", 0x23, 0x30, "FH65pxAbpGjLzjGGfGETSZhgLf2SXGuGBi"),
  new Bitcoin("Fluttercoin", 0x23, 0xa3, "FJioRLt3gLtqk3tUdMhwjAVo1sdWjRuwqt"),
  new Bitcoin("FrazCoin", 0x23, 0xa3, "F8uHqHrLrToXSMrVVTzap34LBhVSEEWUmm"),
  new Bitcoin("Freicoin", 0x00, 0x80, "18kVnAk5Undi7CqEgGx63YDKBPFpxYJmT9"),
  new Bitcoin("FUDcoin", 0x23, 0xa3, "FEKsbaLJHjbEnuMiRDvtnyvxaJqehBtQ5V"),
  new Bitcoin("Fuelcoin", 0x24, 0x80, "Fq1sL24MgDt7tTiKh8MPvhz2UMP8e1uCo4"),
  new Bitcoin("Fujicoin", 0x24, 0xa4, "Fqr2ZrqWPCryqsfjdghwMT3enGHukGonit"),
  new Bitcoin("GabenCoin", 0x10, 0x90, "7cwtF11nW4qAGp2pFdLuUZ5gzJWiXtUvi1"),
  new Bitcoin("Garlicoin", 0x26, 0xb0, "GdHMURSy1H9NbognUvKNmBXciMnqEpRnjg"),
  new Bitcoin("GlobalBoost", 0x26, 0xa6, "GeXdH1WhzA7ayYim9sdCCQKcVukUq1W8LJ"),
  new Bitcoin("Goodcoin", 0x26, 0xa6, "GM3kAbQGaMVAYk8U3CrVGhSwz1hZaF6gVM"),
  new Bitcoin("GridcoinResearch", 0x3e, 0xbe, "SHs9ESzUL9VAEcq7kStfF1JUAMaNT1EYzJ"),
  new Bitcoin("Gulden", 0x26, 0xa6, "GLD7BDBYyddx6Sr72zGfreRG21dJAe74j8"),
  new Bitcoin("Guncoin", 0x27, 0xa7, "GwVej6c3tF9GqEdSKmwJiUDWtQVK2wY9fP"),
  new Bitcoin("HamRadioCoin", 0x00, 0x80, "1JQVWKT1NQJUJbbq4UdJUY8DbWmgqrrHWz"),
  new Bitcoin("HFRcoin", 0x10, 0x90, ""),
  new Bitcoin("HOdlcoin", 0x28, 0xa8, "H9SvPiwASJnsCcNS6QWJc3vi3FxoEHEKVb"),
  new Bitcoin("HTMLCoin", 0x29, 0xa9, "HskoM3SRgw3QLV1vHm98cCbFQedHfXZyM2"),
  new Bitcoin("HyperStake", 0x75, 0xf5, "p71G6VRVxTTxg3Hqa9CbENeJY1PumBjtvL"),
  new Bitcoin("iCash", 0x66, 0xcc, "iKCghTCFEPhriPxrduWxks2SCDE1XKzCU6"),
  new Bitcoin("ImperiumCoin", 0x30, 0xb0, "LKcNNWGDyKyedwL8QNsCkg2122fBQyiDat"),
  new Bitcoin("IncaKoin", 0x35, 0xb5, "NdEXATr2NSG1pkzC2kScnEnj6g3KYpLnT9"),
  new Bitcoin("IncognitoCoin", 0x00, 0x80, "1BbRmhGKyKshFge9kBMdfJyQr3KZoh5K5t"),
  new Bitcoin("Influxcoin", 0x66, 0xe6, "i83eN9HxFvfsxSwjXiZQZaWf13cWF25K9Y"),
  new Bitcoin("Innox", 0x4b, 0xcb, "XQm6Vy2tTh87ZnWg6cBdZBmYVExbVuScBF"),
  new IOTA("IOTA", ""),
  new Bitcoin("IridiumCoin", 0x30, 0xb0, "LKTu2strS8zV1mDJxJtgE3HLqChD2m54yN"),
  new Bitcoin("iXcoin", 0x8a, 0x80, "xnF1nshqFLaVdDGBmQ4k2jBQkr8nbuCkLz"),
  new Bitcoin("Judgecoin", 0x2b, 0xab, "JbF9ZnvoFkBdasPEq21jCCTnTUDSiyWrAQ"),
  new Bitcoin("Jumbucks", 0x2b, 0xab, "JSzHiaoD6ewtymBMJHsHqkpFzCYKBzxJeC"),
  new Bitcoin("Kagonmacoin", 0x2d, 0x80, ""), // WIF UNKNOWN
  new Bitcoin("KHcoin", 0x30, 0xb0, "LZWM2nptWZpSDZna5k96Rk1uqN8NDTigvK"),
  new Bitcoin("KittehCoin", 0x2d, 0xad, "KQkaGcgZvbKXoNWaPh5upwUMvEVvvEY5tY"),
  new Zcash("Koto", 0x1836, 0x80, "k1CgSBTwDC79jm1Kucox2DdCakCd2Z9HarJ"),
  new Bitcoin("Lanacoin", 0x30, 0xb0, "LhqrrTHtfNMn8rZi7QesFbbpJYeGWX7319"),
  new Bitcoin("Latium", 0x17, 0x80, "ASz2EgegeXfKyHaY1SbJ6nCDK6sxd7BpXg"),
  new Bitcoin("LBRY Credits", 0x55, 0x80, "bTLCuxhV5m6DK9yPmADz9H23PyoaQo84KP"),
  new Bitcoin("Litecoin", 0x30, 0xb0, "LiScnsyPcqsyxn1fx92BcFguryXcw4DgCy", 0x05, "ltc"),
  new Bitcoin("LiteDoge", 0x5a, 0xab, "daaV1gQ63HpHHn4Ny1fJZHMA7KCeUVE538"),
  new Bitcoin("LoMoCoin", 0x30, 0xb0, "LSdeGMxfMFX38GHCFQT65SJaU1E8ezT2og"),
  new Bitcoin("MadbyteCoin", 0x32, 0x6e, "MCBdZDK326yhGM77nWjj3vHX96edd2PQW3"),
  new Bitcoin("MagicInternetMoney", 0x30, 0xb0, "LPRqCTYEy53FkEzhRTCauLc7Qq23Z5mxZU"),
  new Bitcoin("Magicoin", 0x14, 0x94, "9H6ddyu9S9gyrEHxVrpMBTBZWrwAvdtehD"),
  new Bitcoin("MangaCoin", 0x6e, 0xb0, "", 0x61, "manga"),
  new Bitcoin("Marscoin", 0x32, 0xb2, "M8caDttyKt2r7V7WHMMkRZ1jEzxj16fgCn"),
  new Bitcoin("MarteXcoin", 0x32, 0xb2, "M8DSVG13j3qpNDRbuuUBh5juQmSd15wLXH"),
  new Bitcoin("MasterDoge", 0x33, 0x8b, "Mm4Xqy9FYZ8N1NJzuXCaJLZcw8o2cmVC7c"),
  new Bitcoin("Mazacoin", 0x32, 0xe0, "MLUXCv3GfNgmUSXc5Ek3ePaQ4cfsJwEXHa"),
  new Bitcoin("Megacoin", 0x32, 0xb2, "MPeVmJHvkXN3caneWCB5zGgtGHRRBSLmWd"),
  // new NEM("Mijin", null, NEM.mijin), // disabled because I can't find large size of logo
  new Bitcoin("MiningEnthusiastCoin", 0x30, 0xb0, ""),
  new Bitcoin("MintCoin", 0x33, 0xb3, "MdT7t7MhbgQLSdMhHJCyoGHUuniqZDrj4h"),
  new Bitcoin("MobiusCoin", 0x00, 0x80, "1HKNrUR3BaFC8u4VMfnjCuXDPrYGh7jU8S"),
  new Bitcoin("Monacoin", 0x32, 0xb0, "MPE8npAXs49HMpQGkETFqBa8GBzsRM5FJn", 0x37, "mona"),
  new Bitcoin("MonetaryUnit", 0x10, 0x7e, "7gzstwRu4owvwk7Se5pPVG8A5pgdgsDzUV"),
  new Bitcoin("Monocle", 0x32, 0xb2, "M9CFHZjyCipuKqByD5K1sCHmt7etuCFGsc"),
  new Bitcoin("MoonCoin", 0x03, 0x83, "2P2V9npcK7apbUFsWN3zL7R6ARBMwTJ4hA"),
  new Bitcoin("Myriadcoin", 0x32, 0xb2, "MWGDtjDw9c8C6zicDQF22yZBWbEX53v4o9"),
  new Bitcoin("NAMAPOSTAMP", 0x35, 0x80, ""),
  new Bitcoin("NameCoin", 0x34, 0x80, "NASxLK4nt5hgX9wQEny5qPPJ2q4uSGCvT9"),
  new Bitcoin("Navcoin", 0x35, 0x96, "NP2wVKjiT1PbpkFMCfkSxR7QsV3iezf4T6"),
  new Bitcoin("NeedleCoin", 0x35, 0xb5, "NYtEDYHNabMqiad5J2tEPFwE9wnhJQpN1W"),
  new Bitcoin("NEETCOIN", 0x35, 0xb5, "NgTALUftFyFk8osvqo5TryBkeNYKvGBssp"),
  new NEM("NEM", null, NEM.mainnet),
  new Bitcoin("Neoscoin", 0x35, 0xb1, "NZw6WJPiKYcXxua1VveieihiNJRYanHjrP"),
  new Bitcoin("Nevacoin", 0x35, 0xb1, "NQDJrKGP3TNhKhKzaHMdg1Wk9FWCT4Nx3q"),
  new Bitcoin("Novacoin", 0x08, 0x88, "4EZMrEA5LnmwtcK5b2JfCq9k5YS4ZVZrtT"),
  new Bitcoin("Nubits", 0x19, 0xbf, "BPWCkyaVqWdaf3uqahrgdTjB2QTnRZzPMM"),
  new Bitcoin("Nyancoin", 0x2d, 0xad, "KHRsf8ofFYqGm4XoeHuFakKPLs5CH2dhK3"),
  new Bitcoin("NYC", 0x3c, 0xbc, "RY1XJPWksA5zUTCNJ416XJhY9yiFSFfTvz"),
  new Bitcoin("Ocupy", 0x73, 0xf3, "ocLKVPkQRFtKn5mFygrd4QJG9eZd1sKTyi"),
  new Bitcoin("Omnicoin", 0x73, 0xf3, "oMesh62joeab2yMoJUH28mGE8h2suDzcYc"),
  new Bitcoin("Onyxcoin", 0x73, 0xf3, "odRRCGXooJvKs7cn7sax1bJv9EJwwEy94Z"),
  new Bitcoin("PacCoin", 0x18, 0x98, ""),
  new Bitcoin("Pandacoin", 0x37, 0xb7, "PT6guZjCgsrBkqCUhTnG1NNBYBqgzo8gVv"),
  new Bitcoin("ParkByte", 0x37, 0xb7, "PCLozfQ5cBinqdRFGEf6DkuC56YU1jWzMQ"),
  new Bitcoin("Particl", 0x38, 0x6c, ""),
  new Bitcoin("Paycoin", 0x37, 0xb7, "PV2t9zzj9rQm81c9VJqqL8edj1ndpcW9HD"),
  new Bitcoin("Peercoin", 0x37, 0xb7, "PSnwUwknbmqUU1GCcM1DNxcANqihpdt3tW"),
  new Bitcoin("Pesetacoin", 0x2f, 0xaf, "L6qoz2SQN6U9vGNoST35QP85PQbg4s5rDn"),
  new Bitcoin("PHCoin", 0x37, 0xb7, "P9e6c714JUHUfuBVHSS36eqaxGCN6X8nyU"),
  new Bitcoin("PhoenixCoin", 0x38, 0xb8, "PsaaD2mLfAPUJXhMYdC1DBavkJhZj14k6X"),
  new Bitcoin("PiggyCoin", 0x76, 0xf6, "pqXotCKo6mmtYtLY5mi9uEW22mPFgKoLvx"),
  new Bitcoin("Pinkcoin", 0x3, 0x83, "2Xgy8K2n5cVmnm8Se2rDojQ1GdfHdktx8r"),
  new Bitcoin("PIVX", 0x1e, 0xd4, "DSiCurCzgdzqSP1urFg3VZJfrpyhMWjEAp"),
  new Bitcoin("Potcoin", 0x37, 0xb7, "PQcMNuCdeooMcS5H3DGwxXnSE2kmyVMU39"),
  new Bitcoin("Primecoin", 0x17, 0x97, "AbXChfoHyFESePFuVh1xLZdn7Rj1mfD2a4"),
  new Bitcoin("ProsperCoinClassic", 0x3a, 0xba, "QXLqozFHKP1fdvx4LKMYmtEHWciEZ9pD2F"),
  new Bitcoin("Quark", 0x3a, 0xba, "QNGJBwRApKKwEevTvDwpeoSgmo6w6wv8yQ"),
  new Bitcoin("Qubitcoin", 0x26, 0xe0, "GeNTNSwEh5ZCRCE6LtnMwHCk8VU2Lu8QE7"),
  new Bitcoin("Reddcoin", 0x3d, 0xbd, "RmAB99NsX6Wbjk5WdqNeEab83y72d7zkqZ"),
  new Bitcoin("Riecoin", 0x3c, 0x80, "RUsNQFds88sdWszMUVKwfdBhE9PtzLTK6N"),
  new Bitcoin("Rimbit", 0x3c, 0xbc, "RJNYNAafwKmkGf1hb3LDXiL1gRhSPPrXxN"),
  new Bitcoin("Ringo", 0x3c, 0x80, ""), // WIF UNKNOWN
  new Ripple("Ripple"),
  new Bitcoin("ROIcoin", 0x3c, 0x80, "RKUwWKMfwoq2trvQ4Q3a529U7KZq3Pq6gw"),
  new Bitcoin("Rubycoin", 0x3c, 0xbc, "RNsGHZnnr4pa3nYSp5NsuPtqTAGHT6XWqb"),
  new Bitcoin("Rupaya", 0x3c, 0xbc, "RENYagTnHvczPgFYaAhfVqh9y6B1yaMaij"),
  new Bitcoin("Sambacoin", 0x3e, 0xbe, "SJdiAgazqtum79HzGbNDxi879NzSDjtH5P"),
  new Bitcoin("SanDeGo", 0x3f, 0x80, ""), // WIF UNKNOWN
  new Bitcoin("SecKCoin", 0x3f, 0xbf, "Se1aaa5T1HRpMEfyBPGswVUgTQoZUst9jA"),
  new Bitcoin("SELN", 0x3f, 0x4b, ""),
  new Bitcoin("SibCoin", 0x3f, 0x80, "SY7GAzvFVS8bUA89e7hosPMxqMS482ecsp"),
  new Bitcoin("SixEleven", 0x34, 0x80, "NGPimZxoZMmAsoF4eJME8TkG7UW8vqoJQJ"),
  new Bitcoin("SmileyCoin", 0x19, 0x99, "BEaZDZ8gCbbP1y3t2gPNKwqZa76rUDfR73"),
  new Bitcoin("SongCoin", 0x3f, 0xbf, "SSK9MXormZXgF5ZfV599okJRXYh3g9RXGN"),
  new Bitcoin("SpreadCoin", 0x3f, 0xbf, "SjPkh7V2KkySjL52wsD2CpEj4quTtjiaVW"),
  new Bitcoin("Sprouts", 0x3f, 0x80, ""), // WIF UNKNOWN
  new Bitcoin("StealthCoin", 0x3e, 0xbe, "SJJGGq7UyoUH1TExGJCQ6ee49ztJr2quF8"),
  new Bitcoin("Stratis", 0x3f, 0xbf, "ScMNGH91SpNwbRDeK8vYXXJ3aYpwBr9Pen"),
  new Bitcoin("Sugarchain", 0x3f, 0x80, "sugar1qjh4ltstwqdpc242ck02duwrwyg2twycpsrhj8z", 0x7d, "sugar").withDefaultMode("segwit"),
  new Bitcoin("Susucoin", 0x3f, 0x80, ""),
  new Bitcoin("SwagBucks", 0x3f, 0x99, "SJJGGq7UyoUH1TExGJCQ6ee49ztJr2quF8"),
  new Bitcoin("Syscoin", 0x00, 0x80, "133miKEHohCR5qnbEZ64MFZkCzFM2HpeAd"),
  new Bitcoin("Tajcoin", 0x41, 0x6f, "TWYZCoBw6Kd5fKZ5wWpqgJaeNAbuRF9Qg8"),
  new Bitcoin("Terracoin", 0x00, 0x80, "1BQH6gBzkxxyMQG3VSJCHnmVGfWu64nbPL"),
  new Bitcoin("Titcoin", 0x00, 0x80, "1CHAo7muicsLHdPk5q4asrEbh6aUeSPpdC"),
  new Bitcoin("TittieCoin", 0x41, 0xc1, "TYrdtLy9irV4u1yo2YQVCkS27RzDzBqWwJ"),
  new Bitcoin("Topcoin", 0x42, 0xc2, "TmDTsQqqv1LWGw4xjGNiJ7ABwdCenf2BFF"),
  new Bitcoin("TransferCoin", 0x42, 0x99, "TbnW6ih8314ksuutJpRjwUbc2mAkz64Tij"),
  new Bitcoin("TreasureHuntCoin", 0x32, 0xb2, "MKnC2upgCNfVMS2phkV8SqGaXUGkn39EaX"),
  new Bitcoin("TrezarCoin", 0x42, 0xc2, "Tw1jsLJKfmcosUCkJuMevdLLJob9wD7PSE"),
  new Bitcoin("Unobtanium", 0x82, 0xe0, "uZ8Gq61NGJ2wz3PLybXyXKLYC1FhRpz8Kq"),
  new Bitcoin("USDe", 0x26, 0xa6, "GQTeNSfx6xPbBNsUfqoZNrrCBQXeY5Dtdu"),
  new Bitcoin("Vcash", 0x47, 0xc7, "VoaKH8ndxJoFfM3XJ7DK3P6g7kxASpCf5g"),
  new Bitcoin("VergeCoin", 0x1e, 0x9e, "DJvyiaUdFAH7zmn23SaWzSj9FT5X9a3pSS"),
  new Bitcoin("Versioncoin", 0x46, 0xc6, "VRYmn3ABchWK7ZSx2V3VD6TzxmqCLsxJSH"),
  new Bitcoin("Vertcoin", 0x47, 0x80, "VkmBz8JJWLP1sVH9sGwc1Fz7o5RtXLW4J5"),
  new Bitcoin("Viacoin", 0x47, 0xc7, "VeJMvqvsZFoTkYfitzEG8fYy7bC7hxMfT1"),
  new Bitcoin("VikingCoin", 0x46, 0x56, "VJXz1cD1mDGQmu52aDdd7Q2G5ejqA6mcqw"),
  new Bitcoin("VIPSTARCOIN", 0x46, 0x80, ""),
  new Bitcoin("W2Coin", 0x49, 0xc9, "Wa3AvKUP5J3BpEa93nwKHPAAQ2P1XdTCeU"),
  new Bitcoin("WACoins", 0x49, 0xc9, ""),
  new Bitcoin("WankCoin", 0x00, 0x80, "1CnEFZZxJQkNAvgFGdRV5JEKShkNj1LRWL"),
  new Bitcoin("WeAreSatoshiCoin", 0x87, 0x97, "wSEgPsCGqQESLDyzBJkwCXvMP1z3e1Qi3X"),
  new Bitcoin("WorldCoin", 0x49, 0xc9, "WNmGkn2WQZKS6xKHEsj5AqSbuE4sh9Upyb"),
  new Bitcoin("XP", 0x4b, 0xcb, "XLRykcGjFMpBDQ7PHfamR2DR4Z21qTUBHG"),
  new Bitcoin("XPChain", 0x4c, 0x80, ""),
  new Bitcoin("Yajucoin", 0x4e, 0x80, ""), // WIF UNKNOWN
  new Bitcoin("Yenten", 0x4e, 0x7b, "YStuCpv1U9iT3L1VqBr52B9nBxrNgt4Fpj"),
  new Zcash("Zcash", 0x1cb8, 0x80, "t1XA64Hw47QaCxCUEgZbc4FVdH811RMd1xp"),
  new Bitcoin("Zetacoin", 0x50, 0xe0, "ZRU6TP8NLzoyey4DPPaa3uCCgDNDc96PXJ"),

  new Bitcoin("Testnet Bitcoin", 0x6f, 0xef, null, 0xc4, "tb"),
  new Bitcoin("Testnet BitZeny", 111, 239, null, 196, "tz"),
  new Bitcoin("Testnet Dogecoin", 0x71, 0xf1, null),
  new Bitcoin("Testnet Monacoin", 111, 239, null, 196, "tmona"),
  new Bitcoin("Testnet MonetaryUnit", 0x26, 0x40, null),
  new NEM("Testnet NEM", null, NEM.testnet),
  new Bitcoin("Testnet PIVX", 0x8b, 0xef, null),
  new Bitcoin("Testnet Sugarchain", 66, 239, null, 128, "tugar").withDefaultMode("segwit"),
  new Bitcoin("Testnet WACoins", 0x51, 0xd1, null)
];

module.exports = {
  name,
  useCurrency,
  currencies
};

Object.defineProperty(module.exports, "selectedCurrency", {
  get: () => selectedCurrency,
  set: useCurrency,
  enumerable: true,
  configurable: true
});
