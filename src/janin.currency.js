const translator = require("./ninja.translator.js");
const Doge = require("./doge.js");
const _ = require("lodash");

const Bitcoin = require("./coins/bitcoin");
const Zcash = require("./coins/zcash");
const BitcoinCash = require("./coins/bitcoincash");
const Ethereum = require("./coins/ethereum");
const NEM = require("./coins/nem");
const Ripple = require("./coins/ripple");

let selectedCurrency, doge;

const name = function() {
  return selectedCurrency.name;
};

const networkVersion = function() {
  return selectedCurrency.pubKeyHash;
};

const privateKeyPrefix = function() {
  return selectedCurrency.wif;
};

const WIF_RegEx = function() {
  return new RegExp("^" + selectedCurrency.WIF_Start + "[123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]{50}$");
};

const CWIF_RegEx = function() {
  return new RegExp("^" + selectedCurrency.CWIF_Start + "[123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]{51}$");
};

// Switch currency
const useCurrency = function(index) {
  selectedCurrency = currencies[index];
  const lowerCurrency = name().toLowerCase();

  const singlewallet = require("./ninja.singlewallet.js");
  const paperwallet = require("./ninja.paperwallet.js");
  const brainwallet = require("./ninja.brainwallet.js");

  const coinImgUrl = "logos/" + lowerCurrency + ".png";
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

  if (require("./ninja.seeder.js").isDone()) {
    // Regenerate a new wallet when not expensive
    singlewallet.generateNewAddressAndKey();
    paperwallet.build(document.getElementById("paperpassphrase").value);
    brainwallet.view();
  }

  // Reset wallet tab when expensive or not applicable
  document.getElementById("bulktextarea").value = "";
  document.getElementById("suppliedPrivateKey").value = "";

  // Hide SegWit fields for non-segwit coins
  const swids = ["pubqrsw", "selectsegwit", "selectsegwitp2sh"];
  for (let id in swids) {
    if ({}.hasOwnProperty.call(swids, id)) {
      const elem = document.getElementById(swids[id]);
      if (!elem) continue;
      if (selectedCurrency.bech32) {
        elem.style.display = "block";
      } else {
        elem.style.display = "none";
      }
    }
  }

  // Hide CashAddr fields for non-BCH
  const caids = ["pubqrbch", "selectcashaddrcomp", "selectcashaddr"];
  for (let id in caids) {
    if ({}.hasOwnProperty.call(caids, id)) {
      const elem = document.getElementById(caids[id]);
      if (!elem) continue;
      if (selectedCurrency.bch) {
        elem.style.display = "block";
      } else {
        elem.style.display = "none";
      }
    }
  }

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
      if (!+i) {
        // i == 0
        addrTypeDropdown += `<option value="0" selected>${formatNames[i]}</option>`;
      } else {
        addrTypeDropdown += `<option value="${i}">${formatNames[i]}</option>`;
      }
    }
  }
  document.getElementById("addresstype").innerHTML = addrTypeDropdown;
  paperwallet.publicMode = 0;

  // easter egg doge ;)
  if (name() === "Dogecoin") {
    doge = new Doge(["wow", "so paper wallet", "such random", "very pretty", "much design", "awesome", "much crypto", "such coin", "wow!!", "to da moon"]);
    return;
  }

  if (doge) {
    doge.stop();
    doge = null;
  }
};

let currencies = [
  //          name, networkVersion, privateKeyPrefix, WIF_Start, CWIF_Start, donate, scriptHash, b32hrp
  new Bitcoin("2GIVE", 0x27, 0xa7, "6", "R", "Givewmf4yv8uuHZG6Eb7sm17fJS2Trf6U8"),
  new Bitcoin("42coin", 0x08, 0x88, "5", "M", "4Fs42jYtLYrUMfKEXc6arojuhRsnYnerxN"),
  new Bitcoin("Acoin", 0x17, 0xe6, "8", "b", "AJvChtExuvLgAor9aw1Xz9bkvJY7JKD9uL"),
  new Bitcoin("AGAcoin", 0x53, 0xd3, "8", "Y", "aWg2jDBnecc17UHrDF5Rz5pj1rTqTDTnTH"),
  new Bitcoin("Alphacoin", 0x52, 0xd2, "8", "Y", "aAWhiGBDUugXC9ZBvw8CDNQH7KRurjy4Nq"),
  new Bitcoin("Alqo", 0x17, 0xc1, "7", "V", "ALF9ykkthT5UwmqdrThMRGb1GNgdCUciHL"),
  new Bitcoin("Animecoin", 0x17, 0x97, "6", "P", "AdA5nLS5FtPws6A3BX8aXccbP7fReptdw7"),
  new Bitcoin("Anoncoin", 0x17, 0x97, "6", "P", "AS3BvkE4wvsXJpn1bGhQni5vZajthnrWQE"),
  new Bitcoin("Apexcoin", 0x17, 0x97, "6", "P", "AdPxUCGLDUhHUTGYftffwFVdxbFy2nkXGX"),
  new Bitcoin("Auroracoin", 0x17, 0x97, "6", "T", "AVWH1ZutLd4Y5LPDDj5FkBjbm2Gci4iFx3"),
  new Bitcoin("Aquariuscoin", 0x17, 0x97, "6", "P", "ARk4VoaCHDoPDn2dctGizJaHFvXNRiDUDr"),
  new Bitcoin("Axe", 0x4b, 0xcb, "7", "X", ""),
  new Bitcoin("BBQcoin", 0x55, 0xd5, "6", "T", "bTFFC3Gg2XzQygLxxakHkNM3ravBZby1y9"),
  new Bitcoin("Biblepay", 0x19, 0xb6, "7", "[TU]", "BDvP86n4oVsLnFh1tCRXWLgBPK6ZtKrJQa"),
  new Bitcoin("Bellcoin", 0x19, 0x80, "5", "[LK]", "BEDspA3yyg8LhzLA75e8J1kR7bSiMAMmXb", 0x55, "bm"),
  new Bitcoin("Bitcoin", 0x00, 0x80, "5", "[LK]", "15DHZzv7eBUwss77qczZiL3DUEZLjDYhbM", 0x05, "bc"),
  new BitcoinCash("BitcoinCash", 0x00, 0x80, "5", "[LK]", "15DHZzv7eBUwss77qczZiL3DUEZLjDYhbM"),
  new Bitcoin("BitcoinDark", 0x3c, 0xbc, "7", "U", "RWtY5fg9ZQ9tYaPd7WJLgsdae1m1ZfrVRe"),
  new Bitcoin("Bitcore", 0x00, 0x80, "5", "[LK]", "1H7fhCsyRfPP8XnJWhezXmi9YNqtBh9xxW"),
  new Bitcoin("BitcoinGold", 0x26, 0x80, "5", "[LK]", "GYjahzU24Am88oZco6oFtpNzgwJTp9S4eB"),
  new Bitcoin("Bitconnect", 0x12, 0x92, "5", "N", "8Zixqosp1KFejfcVQzTWa2EsPa2VxSgeJX"),
  new Bitcoin("Birdcoin", 0x2f, 0xaf, "6", "[ST]", "L97vGT4wRnyyiugHpLXzZzjqueN8YWRdRJ"),
  new Bitcoin("BitSynq", 0x3f, 0xbf, "7", "V", "SRtKRZxSjjwb9BXujkmvLfRHiutk7s7VXh"),
  new Bitcoin("BitZeny", 0x51, 0x80, "5", "[LK]", "ZxUsfFszPsKdot4XnoZHZcMKg2PPS3NUji", 0x05, "sz"),
  new Bitcoin("Blackcoin", 0x19, 0x99, "6", "P", "BFeJrZGyJ6bntd7RLXoNGvdn1HB5AQeiz4"),
  new Bitcoin("BlackJack", 0x15, 0x95, "[56]", "P", "9pzHRZkJ4Df3EBiqXhDVgtB2A7FaAq6nnG"),
  new Bitcoin("BlockNet", 0x1a, 0x9a, "6", "P", "BhGtBAnfp7EUvbVr7R7uTJyHXF7Kt17wni"),
  new Bitcoin("BolivarCoin", 0x55, 0xd5, "8", "Y", "1J1HqJd2CRyacjEkMXxGzWVUYq6XfRqJEP"),
  new Bitcoin("BoxyCoin", 0x4b, 0xcb, "7", "X", "9pzHRZkJ4Df3EBiqXhDVgtB2A7FaAq6nnG"),
  new Bitcoin("BunnyCoin", 0x1a, 0x9a, "6", "P", "BosRXiiSB6WmiSbvzVAdUjpezCWhqpJGyW"),
  new Bitcoin("Cagecoin", 0x1f, 0x9f, "6", "Q", "DjUXeu9pUYq5RsN7qpowb1C8LcvPNi9Bx3"),
  new Bitcoin("CampusCoin", 0x1c, 0x9c, "6", "Q", "Cawn4BSvSuPFHk3wo43Nm85CG8TW1Y2s1H"),
  new Bitcoin("CanadaeCoin", 0x1c, 0x9c, "6", "Q", "CbaoyW9KYP8qQHb9Lu59crvjemryCD88Hv"),
  new Bitcoin("CannabisCoin", 0x1c, 0x9c, "6", "Q", "Cb7SSkHpnk1PwKqKbreMALzJpnmAsBNvnG"),
  new Bitcoin("Capricoin", 0x1c, 0x9c, "6", "Q", "CS1mBL1dyCR8jH5hRrQiZ4Xz37UWwcbUAJ"),
  new Bitcoin("CassubianDetk", 0x1e, 0x9e, "6", "Q", "DBPagysmjfdkND4Zp1SM4myLenNfXpFWnG"),
  new Bitcoin("CashCoin", 0x22, 0xa2, "6", "[QR]", "F3bkQC7xGZZcPFmsucYas7KuHoEwCPtGHC"),
  new Bitcoin("Catcoin", 0x15, 0x95, "[56]", "P", "9rEXDemG6S3k2ddAsKFzRpnMVz3bVryYXZ"),
  new Bitcoin("ChainCoin", 0x1c, 0x9c, "6", "Q", "Ca62ZnR3sfKotqDJzsBW6k75rTFFgFkw1x"),
  new Bitcoin("ColossusCoinXT", 0x1e, 0xd4, "5", "[LK]", "D9buTahK9CXNxoGzXLZ9tamwrQzdW2MzvG"),
  new Bitcoin("Condensate", 0x3c, 0xbc, "7", "U", "RRZZMHaYZXCeUWRVeRvttKCNcvTRCxBfqD"),
  new Bitcoin("Copico", 0x1c, 0x90, "5", "N", "CKWBhVUwQP4fRw6xJk4nxCqKYCMz74bPKr"),
  new Bitcoin("CopperCoin", 0x1c, 0x9c, "6", "Q", "CXh8p64WqmEwTkQSDk9azaZUqrnXE9WESV"),
  new Bitcoin("Corgicoin", 0x1c, 0x9c, "6", "Q", "CNwV11TaKrfB3TnBS8vQjNbWT6CNxV8GBi"),
  new Bitcoin("CryptoBullion", 0x0b, 0x8b, "5", "M", "Cd9CgzTChm9yJQZ3SL3PUSsMkEEN8LGwCF"),
  new Bitcoin("CryptoClub", 0x23, 0xa3, "6", "R", "FKPFTw5LjoeGTZP1d3zHLfZNm91FktgPWY"),
  new Bitcoin("Cryptoescudo", 0x1c, 0x9c, "6", "Q", "Cd9CgzTChm9yJQZ3SL3PUSsMkEEN8LGwCF"),
  new Bitcoin("Cryptonite", 0x1c, 0x80, "5", "[LK]", "CP6uhgcDnXzdgQhnz2q1xhSFMFinmqkQkh"),
  new Bitcoin("CryptoWisdomCoin", 0x49, 0x87, "5", "[LM]", "WYeSz9KmpjgdtycPiJVPcQdp7bBqECfr3W"),
  new Bitcoin("C2coin", 0x1c, 0x9c, "6", "Q", "Cd3kyj77p2zivnqbcoBzNya7LD1w7uUU9v"),
  new Bitcoin("Dash", 0x4c, 0xcc, "7", "X", "XdYX6AbDzjb3AVL1tAmWjuYMD28LD9fcWS"),
  new Bitcoin("DeafDollars", 0x30, 0xb0, "6", "T", "LNHYnoqySwoN5aMyEVavEBT3CxHA9WrTZs"),
  new Bitcoin("DeepOnion", 0x1f, 0x9f, "6", "Q", "DhUAMCqydnYNx9PmeQ1wnyeyAxi477DbTz"),
  new Bitcoin("Deutsche eMark", 0x35, 0xb5, "7", "T", "Ni4112Tmv1ScZ9fkN76knJ4jRTxeHQieJM"),
  new Bitcoin("Devcoin", 0x00, 0x80, "5", "[LK]", "1GUeBfpVhN7xySQej3HiSe5c8jQoVQPosv"),
  new Bitcoin("DigiByte", 0x1e, 0x9e, "6", "Q", "D9s71nQPBCEbM2SvGwHQcrhay6KrJaVo3Z"),
  new Bitcoin("Digitalcoin", 0x1e, 0x9e, "6", "Q", "D7fJwPfW4dFSJNq4NHbMiYJhYnrZehMpqx"),
  new Bitcoin("Dimecoin", 0x0f, 0x8f, "5", "N", "7CRKjq135uBC2FgatpAzoJFLPRGL9gCqVp"),
  new Bitcoin("DNotes", 0x1f, 0x9f, "6", "Q", "DqmNyJd9xiaNpE65meAYX6EqJCFDwhsQoX"),
  new Bitcoin("Dogecoin", 0x1e, 0x9e, "6", "Q", "D74Npoqhwhjw9fShkm5wbj6DD2BJXpmzPj"),
  new Bitcoin("DogecoinDark", 0x1e, 0x9e, "6", "Q", "DLbjdRYsfiT62JZf5YxSAfNZJo1VKxDTNP"),
  new Bitcoin("eGulden", 0x30, 0xb0, "6", "T", "LhBsKs2GUb24KBAzZfua5AsqfQF5uPdWXQ"),
  new Bitcoin("eKrona", 0x2d, 0xad, "6", "S", "KLi8FnMZmSH8EfXYgJwi4R2ZyMscJykXT5"),
  new Bitcoin("ELECTRA", 0x21, 0xa1, "6", "Q", "EeJGVF9efipxqJcwf7dup735ATEDc2f1Yk"),
  new Bitcoin("Ember", 0x5c, 0x32, "2", "8", "eGFUogU3DceaBgY5a6qBQC22WwYsboG2gw"),
  new Bitcoin("Emerald", 0x22, 0xa2, "6", "[QR]", "EnJnzAQSpPp7RshMhNx9zhRnabxTLird6W"),
  new Bitcoin("Emercoin", 0x21, 0x80, "5", "[LK]", "EN5nVyEbLrhYfcjoyGgQFtD3QHETyj1dy1"),
  new Bitcoin("EnergyCoin", 0x5c, 0xdc, "8", "Z", "eD2P3q5PdyHYNwT94Dg6Wt4pBz64k8gwGf"),
  new Bitcoin("Espers", 0x21, 0x90, "5", "N", "EVB5z1zoYYZrjUnGw3fekn1aMjfVhMUKHW"),
  new Ethereum("Ethereum"),
  new Bitcoin("Fastcoin", 0x60, 0xe0, "8", "a", "frxe8F7gQdiAVgy4mRXjpXH5vN1wyta1db"),
  new Bitcoin("Feathercoin", 0x0e, 0x8e, "5", "N", "6dxAP6oacHsove5X2kZPpddcT1Am167YzC"),
  new Bitcoin("Fedoracoin", 0x21, 0x80, "5", "[KL]", "ENRPj6iEh14Xky2hv4B7zTJGMe5Kchjeo8"),
  new Bitcoin("Fibre", 0x23, 0xa3, "6", "R", "F6qGSM29vJm2q3Q9uvozpym7WYqKXBrpqm"),
  new Bitcoin("Florincoin", 0x23, 0xb0, "6", "T", "FLJ7vLPZDLMVr2KPEvZMgWvh8TCXj5Bn3m"),
  new Bitcoin("Flurbo", 0x23, 0x30, "6", "8", "FH65pxAbpGjLzjGGfGETSZhgLf2SXGuGBi"),
  new Bitcoin("Fluttercoin", 0x23, 0xa3, "6", "R", "FJioRLt3gLtqk3tUdMhwjAVo1sdWjRuwqt"),
  new Bitcoin("FrazCoin", 0x23, 0xa3, "6", "R", "F8uHqHrLrToXSMrVVTzap34LBhVSEEWUmm"),
  new Bitcoin("Freicoin", 0x00, 0x80, "5", "[LK]", "18kVnAk5Undi7CqEgGx63YDKBPFpxYJmT9"),
  new Bitcoin("FUDcoin", 0x23, 0xa3, "6", "R", "FEKsbaLJHjbEnuMiRDvtnyvxaJqehBtQ5V"),
  new Bitcoin("Fuelcoin", 0x24, 0x80, "5", "[KL]", "Fq1sL24MgDt7tTiKh8MPvhz2UMP8e1uCo4"),
  new Bitcoin("Fujicoin", 0x24, 0xa4, "6", "R", "Fqr2ZrqWPCryqsfjdghwMT3enGHukGonit"),
  new Bitcoin("GabenCoin", 0x10, 0x90, "5", "N", "7cwtF11nW4qAGp2pFdLuUZ5gzJWiXtUvi1"),
  new Bitcoin("Garlicoin", 0x26, 0xb0, "6", "T", "GdHMURSy1H9NbognUvKNmBXciMnqEpRnjg"),
  new Bitcoin("GlobalBoost", 0x26, 0xa6, "6", "R", "GeXdH1WhzA7ayYim9sdCCQKcVukUq1W8LJ"),
  new Bitcoin("Goodcoin", 0x26, 0xa6, "6", "R", "GM3kAbQGaMVAYk8U3CrVGhSwz1hZaF6gVM"),
  new Bitcoin("GridcoinResearch", 0x3e, 0xbe, "7", "V", "SHs9ESzUL9VAEcq7kStfF1JUAMaNT1EYzJ"),
  new Bitcoin("Gulden", 0x26, 0xa6, "6", "R", "GLD7BDBYyddx6Sr72zGfreRG21dJAe74j8"),
  new Bitcoin("Guncoin", 0x27, 0xa7, "6", "R", "GwVej6c3tF9GqEdSKmwJiUDWtQVK2wY9fP"),
  new Bitcoin("HamRadioCoin", 0x00, 0x80, "5", "LK", "1JQVWKT1NQJUJbbq4UdJUY8DbWmgqrrHWz"),
  new Bitcoin("HFRcoin", 0x10, 0x90, "5", "N", ""),
  new Bitcoin("HOdlcoin", 0x28, 0xa8, "5", "[LK]", "H9SvPiwASJnsCcNS6QWJc3vi3FxoEHEKVb"),
  new Bitcoin("HTMLCoin", 0x29, 0xa9, "6", "S", "HskoM3SRgw3QLV1vHm98cCbFQedHfXZyM2"),
  new Bitcoin("HyperStake", 0x75, 0xf5, "9", "d", "p71G6VRVxTTxg3Hqa9CbENeJY1PumBjtvL"),
  new Bitcoin("ImperiumCoin", 0x30, 0xb0, "6", "T", "LKcNNWGDyKyedwL8QNsCkg2122fBQyiDat"),
  new Bitcoin("IncaKoin", 0x35, 0xb5, "7", "T", "NdEXATr2NSG1pkzC2kScnEnj6g3KYpLnT9"),
  new Bitcoin("IncognitoCoin", 0x00, 0x80, "5", "LK", "1BbRmhGKyKshFge9kBMdfJyQr3KZoh5K5t"),
  new Bitcoin("Influxcoin", 0x66, 0xe6, "8", "b", "i83eN9HxFvfsxSwjXiZQZaWf13cWF25K9Y"),
  new Bitcoin("Innox", 0x4b, 0xcb, "7", "X", "XQm6Vy2tTh87ZnWg6cBdZBmYVExbVuScBF"),
  new Bitcoin("IridiumCoin", 0x30, 0xb0, "6", "T", "LKTu2strS8zV1mDJxJtgE3HLqChD2m54yN"),
  new Bitcoin("iCash", 0x66, 0xcc, "7", "X", "iKCghTCFEPhriPxrduWxks2SCDE1XKzCU6"),
  new Bitcoin("iXcoin", 0x8a, 0x80, "5", "[LK]", "xnF1nshqFLaVdDGBmQ4k2jBQkr8nbuCkLz"),
  new Bitcoin("Judgecoin", 0x2b, 0xab, "6", "S", "JbF9ZnvoFkBdasPEq21jCCTnTUDSiyWrAQ"),
  new Bitcoin("Jumbucks", 0x2b, 0xab, "6", "S", "JSzHiaoD6ewtymBMJHsHqkpFzCYKBzxJeC"),
  new Bitcoin("Kagonmacoin", 0x2d, 0x80, "5", "[LK]", ""), // WIF UNKNOWN
  new Bitcoin("KHcoin", 0x30, 0xb0, "6", "T", "LZWM2nptWZpSDZna5k96Rk1uqN8NDTigvK"),
  new Bitcoin("KittehCoin", 0x2d, 0xad, "6", "S", "KQkaGcgZvbKXoNWaPh5upwUMvEVvvEY5tY"),
  new Zcash("Koto", 0x1836, 0x80, "5", "[LK]", "k1CgSBTwDC79jm1Kucox2DdCakCd2Z9HarJ"),
  new Bitcoin("Lanacoin", 0x30, 0xb0, "6", "T", "LhqrrTHtfNMn8rZi7QesFbbpJYeGWX7319"),
  new Bitcoin("Latium", 0x17, 0x80, "5", "[LK]", "ASz2EgegeXfKyHaY1SbJ6nCDK6sxd7BpXg"),
  new Bitcoin("LBRY Credits", 0x55, 0x80, "5", "[LK]", "bTLCuxhV5m6DK9yPmADz9H23PyoaQo84KP"),
  new Bitcoin("Litecoin", 0x30, 0xb0, "6", "T", "LiScnsyPcqsyxn1fx92BcFguryXcw4DgCy", 0x05, "ltc"),
  new Bitcoin("LiteDoge", 0x5a, 0xab, "6", "S", "daaV1gQ63HpHHn4Ny1fJZHMA7KCeUVE538"),
  new Bitcoin("LoMoCoin", 0x30, 0xb0, "6", "T", "LSdeGMxfMFX38GHCFQT65SJaU1E8ezT2og"),
  new Bitcoin("MadbyteCoin", 0x32, 0x6e, "4", "H", "MCBdZDK326yhGM77nWjj3vHX96edd2PQW3"),
  new Bitcoin("MagicInternetMoney", 0x30, 0xb0, "6", "T", "LPRqCTYEy53FkEzhRTCauLc7Qq23Z5mxZU"),
  new Bitcoin("Magicoin", 0x14, 0x94, "5", "[NP]", "9H6ddyu9S9gyrEHxVrpMBTBZWrwAvdtehD"),
  new Bitcoin("MangaCoin", 0x6e, 0xb0, "6", "T", "", 0x61, "manga"),
  new Bitcoin("Marscoin", 0x32, 0xb2, "6", "T", "M8caDttyKt2r7V7WHMMkRZ1jEzxj16fgCn"),
  new Bitcoin("MarteXcoin", 0x32, 0xb2, "6", "T", "M8DSVG13j3qpNDRbuuUBh5juQmSd15wLXH"),
  new Bitcoin("MasterDoge", 0x33, 0x8b, "5", "M", "Mm4Xqy9FYZ8N1NJzuXCaJLZcw8o2cmVC7c"),
  new Bitcoin("Mazacoin", 0x32, 0xe0, "8", "a", "MLUXCv3GfNgmUSXc5Ek3ePaQ4cfsJwEXHa"),
  new Bitcoin("Megacoin", 0x32, 0xb2, "6", "T", "MPeVmJHvkXN3caneWCB5zGgtGHRRBSLmWd"),
  // new NEM("Mijin", null, NEM.mijin), // disabled because I can't find large size of logo
  new Bitcoin("MiningEnthusiastCoin", 0x30, 0xb0, "6", "T", ""),
  new Bitcoin("MintCoin", 0x33, 0xb3, "[67]", "T", "MdT7t7MhbgQLSdMhHJCyoGHUuniqZDrj4h"),
  new Bitcoin("MobiusCoin", 0x00, 0x80, "5", "[LK]", "1HKNrUR3BaFC8u4VMfnjCuXDPrYGh7jU8S"),
  new Bitcoin("MonetaryUnit", 0x10, 0x7e, "5", "K", "7gzstwRu4owvwk7Se5pPVG8A5pgdgsDzUV"),
  new Bitcoin("Monacoin", 0x32, 0xb0, "6", "T", "MPE8npAXs49HMpQGkETFqBa8GBzsRM5FJn", 0x37, "mona"),
  new Bitcoin("Monocle", 0x32, 0xb2, "6", "T", "M9CFHZjyCipuKqByD5K1sCHmt7etuCFGsc"),
  new Bitcoin("MoonCoin", 0x03, 0x83, "5", "L", "2P2V9npcK7apbUFsWN3zL7R6ARBMwTJ4hA"),
  new Bitcoin("Myriadcoin", 0x32, 0xb2, "6", "T", "MWGDtjDw9c8C6zicDQF22yZBWbEX53v4o9"),
  new Bitcoin("NAMAPOSTAMP", 0x35, 0x80, "5", "[LK]", ""),
  new Bitcoin("NameCoin", 0x34, 0x80, "5", "[LK]", "NASxLK4nt5hgX9wQEny5qPPJ2q4uSGCvT9"),
  new Bitcoin("Navcoin", 0x35, 0x96, "6", "P", "NP2wVKjiT1PbpkFMCfkSxR7QsV3iezf4T6"),
  new Bitcoin("NeedleCoin", 0x35, 0xb5, "7", "T", "NYtEDYHNabMqiad5J2tEPFwE9wnhJQpN1W"),
  new Bitcoin("NEETCOIN", 0x35, 0xb5, "7", "T", "NgTALUftFyFk8osvqo5TryBkeNYKvGBssp"),
  new NEM("NEM", null, NEM.mainnet),
  new Bitcoin("Neoscoin", 0x35, 0xb1, "6", "T", "NZw6WJPiKYcXxua1VveieihiNJRYanHjrP"),
  new Bitcoin("Nevacoin", 0x35, 0xb1, "6", "T", "NQDJrKGP3TNhKhKzaHMdg1Wk9FWCT4Nx3q"),
  new Bitcoin("Novacoin", 0x08, 0x88, "5", "M", "4EZMrEA5LnmwtcK5b2JfCq9k5YS4ZVZrtT"),
  new Bitcoin("Nubits", 0x19, 0xbf, "7", "V", "BPWCkyaVqWdaf3uqahrgdTjB2QTnRZzPMM"),
  new Bitcoin("Nyancoin", 0x2d, 0xad, "6", "S", "KHRsf8ofFYqGm4XoeHuFakKPLs5CH2dhK3"),
  new Bitcoin("NYC", 0x3c, 0xbc, "7", "U", "RY1XJPWksA5zUTCNJ416XJhY9yiFSFfTvz"),
  new Bitcoin("Ocupy", 0x73, 0xf3, "9", "[cd]", "ocLKVPkQRFtKn5mFygrd4QJG9eZd1sKTyi"),
  new Bitcoin("Omnicoin", 0x73, 0xf3, "9", "[cd]", "oMesh62joeab2yMoJUH28mGE8h2suDzcYc"),
  new Bitcoin("Onyxcoin", 0x73, 0xf3, "9", "[cd]", "odRRCGXooJvKs7cn7sax1bJv9EJwwEy94Z"),
  new Bitcoin("PacCoin", 0x18, 0x98, "6", "P", ""),
  new Bitcoin("Particl", 0x38, 0x6c, "4", "[HG]", ""),
  new Bitcoin("Paycoin", 0x37, 0xb7, "7", "U", "PV2t9zzj9rQm81c9VJqqL8edj1ndpcW9HD"),
  new Bitcoin("Pandacoin", 0x37, 0xb7, "7", "U", "PT6guZjCgsrBkqCUhTnG1NNBYBqgzo8gVv"),
  new Bitcoin("ParkByte", 0x37, 0xb7, "7", "U", "PCLozfQ5cBinqdRFGEf6DkuC56YU1jWzMQ"),
  new Bitcoin("Peercoin", 0x37, 0xb7, "7", "U", "PSnwUwknbmqUU1GCcM1DNxcANqihpdt3tW"),
  new Bitcoin("Pesetacoin", 0x2f, 0xaf, "6", "[ST]", "L6qoz2SQN6U9vGNoST35QP85PQbg4s5rDn"),
  new Bitcoin("PHCoin", 0x37, 0xb7, "7", "U", "P9e6c714JUHUfuBVHSS36eqaxGCN6X8nyU"),
  new Bitcoin("PhoenixCoin", 0x38, 0xb8, "7", "U", "PsaaD2mLfAPUJXhMYdC1DBavkJhZj14k6X"),
  new Bitcoin("PiggyCoin", 0x76, 0xf6, "9", "d", "pqXotCKo6mmtYtLY5mi9uEW22mPFgKoLvx"),
  new Bitcoin("Pinkcoin", 0x3, 0x83, "[RQP]", "L", "2Xgy8K2n5cVmnm8Se2rDojQ1GdfHdktx8r"),
  new Bitcoin("PIVX", 0x1e, 0xd4, "8", "Y", "DSiCurCzgdzqSP1urFg3VZJfrpyhMWjEAp"),
  new Bitcoin("Peercoin", 0x37, 0xb7, "7", "U", "PSnwUwknbmqUU1GCcM1DNxcANqihpdt3tW"),
  new Bitcoin("Potcoin", 0x37, 0xb7, "7", "U", "PQcMNuCdeooMcS5H3DGwxXnSE2kmyVMU39"),
  new Bitcoin("Primecoin", 0x17, 0x97, "6", "P", "AbXChfoHyFESePFuVh1xLZdn7Rj1mfD2a4"),
  new Bitcoin("ProsperCoinClassic", 0x3a, 0xba, "7", "Q", "QXLqozFHKP1fdvx4LKMYmtEHWciEZ9pD2F"),
  new Bitcoin("Quark", 0x3a, 0xba, "7", "U", "QNGJBwRApKKwEevTvDwpeoSgmo6w6wv8yQ"),
  new Bitcoin("Qubitcoin", 0x26, 0xe0, "8", "a", "GeNTNSwEh5ZCRCE6LtnMwHCk8VU2Lu8QE7"),
  new Bitcoin("Reddcoin", 0x3d, 0xbd, "7", "[UV]", "RmAB99NsX6Wbjk5WdqNeEab83y72d7zkqZ"),
  new Bitcoin("Riecoin", 0x3c, 0x80, "5", "[LK]", "RUsNQFds88sdWszMUVKwfdBhE9PtzLTK6N"),
  new Bitcoin("Rimbit", 0x3c, 0xbc, "7", "U", "RJNYNAafwKmkGf1hb3LDXiL1gRhSPPrXxN"),
  new Bitcoin("Ringo", 0x3c, 0x80, "5", "[LK]", ""), // WIF UNKNOWN
  new Ripple("Ripple"),
  new Bitcoin("ROIcoin", 0x3c, 0x80, "5", "[LK]", "RKUwWKMfwoq2trvQ4Q3a529U7KZq3Pq6gw"),
  new Bitcoin("Rubycoin", 0x3c, 0xbc, "7", "U", "RNsGHZnnr4pa3nYSp5NsuPtqTAGHT6XWqb"),
  new Bitcoin("Rupaya", 0x3c, 0xbc, "7", "U", "RENYagTnHvczPgFYaAhfVqh9y6B1yaMaij"),
  new Bitcoin("SanDeGo", 0x3f, 0x80, "5", "[LK]", ""), // WIF UNKNOWN
  new Bitcoin("Sambacoin", 0x3e, 0xbe, "7", "V", "SJdiAgazqtum79HzGbNDxi879NzSDjtH5P"),
  new Bitcoin("SecKCoin", 0x3f, 0xbf, "7", "V", "Se1aaa5T1HRpMEfyBPGswVUgTQoZUst9jA"),
  new Bitcoin("SELN", 0x3f, 0x4b, "3", "C", ""),
  new Bitcoin("SibCoin", 0x3f, 0x80, "5", "[LK]", "SY7GAzvFVS8bUA89e7hosPMxqMS482ecsp"),
  new Bitcoin("SixEleven", 0x34, 0x80, "5", "[LK]", "NGPimZxoZMmAsoF4eJME8TkG7UW8vqoJQJ"),
  new Bitcoin("SmileyCoin", 0x19, 0x99, "6", "P", "BEaZDZ8gCbbP1y3t2gPNKwqZa76rUDfR73"),
  new Bitcoin("SongCoin", 0x3f, 0xbf, "7", "V", "SSK9MXormZXgF5ZfV599okJRXYh3g9RXGN"),
  new Bitcoin("SpreadCoin", 0x3f, 0xbf, "7", "V", "SjPkh7V2KkySjL52wsD2CpEj4quTtjiaVW"),
  new Bitcoin("Sprouts", 0x3f, 0x80, "5", "[LK]", ""), // WIF UNKNOWN
  new Bitcoin("StealthCoin", 0x3e, 0xbe, "7", "V", "SJJGGq7UyoUH1TExGJCQ6ee49ztJr2quF8"),
  new Bitcoin("Stratis", 0x3f, 0xbf, "7", "V", "ScMNGH91SpNwbRDeK8vYXXJ3aYpwBr9Pen"),
  new Bitcoin("Susucoin", 0x3f, 0x80, "5", "[LK]", ""),
  new Bitcoin("SwagBucks", 0x3f, 0x99, "6", "P", "SJJGGq7UyoUH1TExGJCQ6ee49ztJr2quF8"),
  new Bitcoin("Syscoin", 0x00, 0x80, "5", "[LK]", "133miKEHohCR5qnbEZ64MFZkCzFM2HpeAd"),
  new Bitcoin("Tajcoin", 0x41, 0x6f, "6", "H", "TWYZCoBw6Kd5fKZ5wWpqgJaeNAbuRF9Qg8"),
  new Bitcoin("Terracoin", 0x00, 0x80, "5", "[LK]", "1BQH6gBzkxxyMQG3VSJCHnmVGfWu64nbPL"),
  new Bitcoin("Titcoin", 0x00, 0x80, "5", "[LK]", "1CHAo7muicsLHdPk5q4asrEbh6aUeSPpdC"),
  new Bitcoin("TittieCoin", 0x41, 0xc1, "7", "V", "TYrdtLy9irV4u1yo2YQVCkS27RzDzBqWwJ"),
  new Bitcoin("Topcoin", 0x42, 0xc2, "7", "V", "TmDTsQqqv1LWGw4xjGNiJ7ABwdCenf2BFF"),
  new Bitcoin("TransferCoin", 0x42, 0x99, "6", "P", "TbnW6ih8314ksuutJpRjwUbc2mAkz64Tij"),
  new Bitcoin("TreasureHuntCoin", 0x32, 0xb2, "6", "T", "MKnC2upgCNfVMS2phkV8SqGaXUGkn39EaX"),
  new Bitcoin("TrezarCoin", 0x42, 0xc2, "7", "V", "Tw1jsLJKfmcosUCkJuMevdLLJob9wD7PSE"),
  new Bitcoin("Unobtanium", 0x82, 0xe0, "8", "a", "uZ8Gq61NGJ2wz3PLybXyXKLYC1FhRpz8Kq"),
  new Bitcoin("USDe", 0x26, 0xa6, "6", "R", "GQTeNSfx6xPbBNsUfqoZNrrCBQXeY5Dtdu"),
  new Bitcoin("Vcash", 0x47, 0xc7, "7", "W", "VoaKH8ndxJoFfM3XJ7DK3P6g7kxASpCf5g"),
  new Bitcoin("Versioncoin", 0x46, 0xc6, "7", "W", "VRYmn3ABchWK7ZSx2V3VD6TzxmqCLsxJSH"),
  new Bitcoin("VergeCoin", 0x1e, 0x9e, "6", "Q", "DJvyiaUdFAH7zmn23SaWzSj9FT5X9a3pSS"),
  new Bitcoin("Vertcoin", 0x47, 0x80, "5", "[LK]", "VkmBz8JJWLP1sVH9sGwc1Fz7o5RtXLW4J5"),
  new Bitcoin("Viacoin", 0x47, 0xc7, "7", "W", "VeJMvqvsZFoTkYfitzEG8fYy7bC7hxMfT1"),
  new Bitcoin("VikingCoin", 0x46, 0x56, "3", "D", "VJXz1cD1mDGQmu52aDdd7Q2G5ejqA6mcqw"),
  new Bitcoin("VIPSTARCOIN", 0x46, 0x80, "5", "[LK]", ""),
  new Bitcoin("W2Coin", 0x49, 0xc9, "7", "W", "Wa3AvKUP5J3BpEa93nwKHPAAQ2P1XdTCeU"),
  new Bitcoin("WACoins", 0x49, 0xc9, "7", "W", ""),
  new Bitcoin("WankCoin", 0x00, 0x80, "5", "[LK]", "1CnEFZZxJQkNAvgFGdRV5JEKShkNj1LRWL"),
  new Bitcoin("WeAreSatoshiCoin", 0x87, 0x97, "6", "P", "wSEgPsCGqQESLDyzBJkwCXvMP1z3e1Qi3X"),
  new Bitcoin("WorldCoin", 0x49, 0xc9, "7", "W", "WNmGkn2WQZKS6xKHEsj5AqSbuE4sh9Upyb"),
  new Bitcoin("XP", 0x4b, 0xcb, "7", "X", "XLRykcGjFMpBDQ7PHfamR2DR4Z21qTUBHG"),
  new Bitcoin("XPChain", 0x4c, 0x80, "5", "[LK]", ""),
  new Bitcoin("Yenten", 0x4e, 0x7b, "5", "K", "YStuCpv1U9iT3L1VqBr52B9nBxrNgt4Fpj"),
  new Bitcoin("Yajucoin", 0x4e, 0x80, "5", "[LK]", ""), // WIF UNKNOWN
  new Zcash("Zcash", 0x1cb8, 0x80, "5", "[LK]", "t1XA64Hw47QaCxCUEgZbc4FVdH811RMd1xp"),
  new Bitcoin("Zetacoin", 0x50, 0xe0, "8", "a", "ZRU6TP8NLzoyey4DPPaa3uCCgDNDc96PXJ"),

  new Bitcoin("Testnet Bitcoin", 0x6f, 0xef, "9", "c", null, 0xc4, "tb"),
  new Bitcoin("Testnet BitZeny", 111, 239, "9", "c", null, 196, "tz"),
  new Bitcoin("Testnet Dogecoin", 0x71, 0xf1, "9", "c", null),
  new Bitcoin("Testnet MonetaryUnit", 0x26, 0x40, "3", "A", null),
  new Bitcoin("Testnet Monacoin", 111, 239, "9", "c", null, 196, "tmona"),
  new NEM("Testnet NEM", null, NEM.testnet),
  new Bitcoin("Testnet PIVX", 0x8b, 0xef, "9", "c", null),
  new Bitcoin("Testnet WACoins", 0x51, 0xd1, "8", "[XY]", null)
];

module.exports = {
  name,
  networkVersion,
  privateKeyPrefix,
  WIF_RegEx,
  CWIF_RegEx,
  useCurrency,
  currencies
};

Object.defineProperty(module.exports, "selectedCurrency", {
  get: () => selectedCurrency,
  set: useCurrency,
  enumerable: true,
  configurable: true
});
