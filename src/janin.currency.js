let selectedCurrency;

const createCurrency = function(
  name,
  networkVersion,
  privateKeyPrefix,
  WIF_Start,
  CWIF_Start,
  donate,
  scriptHash,
  b32hrp
) {
  var currency = {
    // that's ok to copy from bitcoin; because we only need parameters to make addresses
    messagePrefix: "\x18Bitcoin Signed Message:\n",
    bech32: b32hrp,
    bip32: {
      public: 0x0488b21e,
      private: 0x0488ade4
    },
    pubKeyHash: networkVersion & 0xffff,
    scriptHash: scriptHash || 0x05,
    wif: privateKeyPrefix,

    name: name,
    WIF_Start: WIF_Start,
    CWIF_Start: CWIF_Start,
    donate: donate,

    zcash: networkVersion > 0xff,
    bch: name === "BitcoinCash" // TODO: support BSV if they added new type of address
  };
  return currency;
};

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
  return new RegExp(
    "^" +
      selectedCurrency.WIF_Start +
      "[123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]{50}$"
  );
};

const CWIF_RegEx = function() {
  return new RegExp(
    "^" +
      selectedCurrency.CWIF_Start +
      "[123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]{51}$"
  );
};

// Switch currency
const useCurrency = function(index) {
  selectedCurrency = janin.currencies[index];

  var coinImgUrl = "logos/" + name().toLowerCase() + ".png";
  document.getElementById("coinLogoImg").src = coinImgUrl;

  // Update title depending on currency
  document.title = name() + " " + ninja.translator.get("title");
  document.getElementById("siteTitle").alt =
    name() + " " + ninja.translator.get("title");

  // Update i18n link
  document.getElementById("cultureen").href =
    "?culture=en&currency=" + name().toLowerCase();
  document.getElementById("culturefr").href =
    "?culture=fr&currency=" + name().toLowerCase();
  document.getElementById("culturede").href =
    "?culture=de&currency=" + name().toLowerCase();
  document.getElementById("culturenl").href =
    "?culture=nl&currency=" + name().toLowerCase();
  document.getElementById("culturept").href =
    "?culture=pt&currency=" + name().toLowerCase();
  document.getElementById("cultureru").href =
    "?culture=ru&currency=" + name().toLowerCase();
  document.getElementById("culturees").href =
    "?culture=es&currency=" + name().toLowerCase();
  document.getElementById("cultureua").href =
    "?culture=ua&currency=" + name().toLowerCase();
  document.getElementById("culturetr").href =
    "?culture=tr&currency=" + name().toLowerCase();
  document.getElementById("cultureit").href =
    "?culture=it&currency=" + name().toLowerCase();
  document.getElementById("culturepl").href =
    "?culture=pl&currency=" + name().toLowerCase();
  document.getElementById("culturezh").href =
    "?culture=zh&currency=" + name().toLowerCase();

  if (ninja.seeder.isDone()) {
    // Regenerate a new wallet when not expensive
    ninja.wallets.singlewallet.generateNewAddressAndKey();
    ninja.wallets.paperwallet.build(
      document.getElementById("paperpassphrase").value
    );
    ninja.wallets.brainwallet.view();
  }

  // Reset wallet tab when expensive or not applicable
  document.getElementById("bulktextarea").value = "";
  document.getElementById("suppliedPrivateKey").value = "";

  // Hide SegWit fields for non-segwit coins
  var swids = ["pubqrsw", "selectsegwit", "selectsegwitp2sh"];
  for (let id in swids) {
    var elem = document.getElementById(swids[id]);
    if (!elem) continue;
    if (selectedCurrency.bech32) {
      elem.style.display = "block";
    } else {
      elem.style.display = "none";
    }
  }

  // Hide CashAddr fields for non-BCH
  var swids = ["pubqrbch", "selectcashaddrcomp", "selectcashaddr"];
  for (let id in swids) {
    var elem = document.getElementById(swids[id]);
    if (!elem) continue;
    if (selectedCurrency.bch) {
      elem.style.display = "block";
    } else {
      elem.style.display = "none";
    }
  }

  // easter egg doge ;)
  if (name() == "Dogecoin") {
    janin.doge = new Doge([
      "wow",
      "so paper wallet",
      "such random",
      "very pretty",
      "much design",
      "awesome",
      "much crypto",
      "such coin",
      "wow!!",
      "to da moon"
    ]);
    return;
  }

  if (janin.doge != null) {
    janin.doge.stop();
    janin.doge = null;
  }
};

module.exports = {
  createCurrency,
  name,
  networkVersion,
  privateKeyPrefix,
  WIF_RegEx,
  CWIF_RegEx,
  useCurrency
};

let currencies = [
  //                              name, networkVersion, privateKeyPrefix, WIF_Start, CWIF_Start, donate, scriptHash, b32hrp
  createCurrency(
    "2GIVE",
    0x27,
    0xa7,
    "6",
    "R",
    "Givewmf4yv8uuHZG6Eb7sm17fJS2Trf6U8"
  ),
  createCurrency(
    "42coin",
    0x08,
    0x88,
    "5",
    "M",
    "4Fs42jYtLYrUMfKEXc6arojuhRsnYnerxN"
  ),
  createCurrency(
    "Acoin",
    0x17,
    0xe6,
    "8",
    "b",
    "AJvChtExuvLgAor9aw1Xz9bkvJY7JKD9uL"
  ),
  createCurrency(
    "AGAcoin",
    0x53,
    0xd3,
    "8",
    "Y",
    "aWg2jDBnecc17UHrDF5Rz5pj1rTqTDTnTH"
  ),
  createCurrency(
    "Alphacoin",
    0x52,
    0xd2,
    "8",
    "Y",
    "aAWhiGBDUugXC9ZBvw8CDNQH7KRurjy4Nq"
  ),
  createCurrency(
    "Alqo",
    0x17,
    0xc1,
    "7",
    "V",
    "ALF9ykkthT5UwmqdrThMRGb1GNgdCUciHL"
  ),
  createCurrency(
    "Animecoin",
    0x17,
    0x97,
    "6",
    "P",
    "AdA5nLS5FtPws6A3BX8aXccbP7fReptdw7"
  ),
  createCurrency(
    "Anoncoin",
    0x17,
    0x97,
    "6",
    "P",
    "AS3BvkE4wvsXJpn1bGhQni5vZajthnrWQE"
  ),
  createCurrency(
    "Apexcoin",
    0x17,
    0x97,
    "6",
    "P",
    "AdPxUCGLDUhHUTGYftffwFVdxbFy2nkXGX"
  ),
  createCurrency(
    "Auroracoin",
    0x17,
    0x97,
    "6",
    "T",
    "AVWH1ZutLd4Y5LPDDj5FkBjbm2Gci4iFx3"
  ),
  createCurrency(
    "Aquariuscoin",
    0x17,
    0x97,
    "6",
    "P",
    "ARk4VoaCHDoPDn2dctGizJaHFvXNRiDUDr"
  ),
  createCurrency("Axe", 0x4b, 0xcb, "7", "X", ""),
  createCurrency(
    "BBQcoin",
    0x55,
    0xd5,
    "6",
    "T",
    "bTFFC3Gg2XzQygLxxakHkNM3ravBZby1y9"
  ),
  createCurrency(
    "Biblepay",
    0x19,
    0xb6,
    "7",
    "[TU]",
    "BDvP86n4oVsLnFh1tCRXWLgBPK6ZtKrJQa"
  ),
  createCurrency(
    "Bellcoin",
    0x19,
    0x80,
    "5",
    "[LK]",
    "BEDspA3yyg8LhzLA75e8J1kR7bSiMAMmXb",
    0x55,
    "bm"
  ),
  createCurrency(
    "Bitcoin",
    0x00,
    0x80,
    "5",
    "[LK]",
    "15DHZzv7eBUwss77qczZiL3DUEZLjDYhbM",
    0x05,
    "bc"
  ),
  createCurrency(
    "BitcoinCash",
    0x00,
    0x80,
    "5",
    "[LK]",
    "15DHZzv7eBUwss77qczZiL3DUEZLjDYhbM"
  ),
  createCurrency(
    "BitcoinDark",
    0x3c,
    0xbc,
    "7",
    "U",
    "RWtY5fg9ZQ9tYaPd7WJLgsdae1m1ZfrVRe"
  ),
  createCurrency(
    "Bitcore",
    0x00,
    0x80,
    "5",
    "[LK]",
    "1H7fhCsyRfPP8XnJWhezXmi9YNqtBh9xxW"
  ),
  createCurrency(
    "BitcoinGold",
    0x26,
    0x80,
    "5",
    "[LK]",
    "GYjahzU24Am88oZco6oFtpNzgwJTp9S4eB"
  ),
  createCurrency(
    "Bitconnect",
    0x12,
    0x92,
    "5",
    "N",
    "8Zixqosp1KFejfcVQzTWa2EsPa2VxSgeJX"
  ),
  createCurrency(
    "Birdcoin",
    0x2f,
    0xaf,
    "6",
    "[ST]",
    "L97vGT4wRnyyiugHpLXzZzjqueN8YWRdRJ"
  ),
  createCurrency(
    "BitSynq",
    0x3f,
    0xbf,
    "7",
    "V",
    "SRtKRZxSjjwb9BXujkmvLfRHiutk7s7VXh"
  ),
  createCurrency(
    "BitZeny",
    0x51,
    0x80,
    "5",
    "[LK]",
    "ZxUsfFszPsKdot4XnoZHZcMKg2PPS3NUji",
    0x05,
    "sz"
  ),
  createCurrency(
    "Blackcoin",
    0x19,
    0x99,
    "6",
    "P",
    "BFeJrZGyJ6bntd7RLXoNGvdn1HB5AQeiz4"
  ),
  createCurrency(
    "BlackJack",
    0x15,
    0x95,
    "[56]",
    "P",
    "9pzHRZkJ4Df3EBiqXhDVgtB2A7FaAq6nnG"
  ),
  createCurrency(
    "BlockNet",
    0x1a,
    0x9a,
    "6",
    "P",
    "BhGtBAnfp7EUvbVr7R7uTJyHXF7Kt17wni"
  ),
  createCurrency(
    "BolivarCoin",
    0x55,
    0xd5,
    "8",
    "Y",
    "1J1HqJd2CRyacjEkMXxGzWVUYq6XfRqJEP"
  ),
  createCurrency(
    "BoxyCoin",
    0x4b,
    0xcb,
    "7",
    "X",
    "9pzHRZkJ4Df3EBiqXhDVgtB2A7FaAq6nnG"
  ),
  createCurrency(
    "BunnyCoin",
    0x1a,
    0x9a,
    "6",
    "P",
    "BosRXiiSB6WmiSbvzVAdUjpezCWhqpJGyW"
  ),
  createCurrency(
    "Cagecoin",
    0x1f,
    0x9f,
    "6",
    "Q",
    "DjUXeu9pUYq5RsN7qpowb1C8LcvPNi9Bx3"
  ),
  createCurrency(
    "CampusCoin",
    0x1c,
    0x9c,
    "6",
    "Q",
    "Cawn4BSvSuPFHk3wo43Nm85CG8TW1Y2s1H"
  ),
  createCurrency(
    "CanadaeCoin",
    0x1c,
    0x9c,
    "6",
    "Q",
    "CbaoyW9KYP8qQHb9Lu59crvjemryCD88Hv"
  ),
  createCurrency(
    "CannabisCoin",
    0x1c,
    0x9c,
    "6",
    "Q",
    "Cb7SSkHpnk1PwKqKbreMALzJpnmAsBNvnG"
  ),
  createCurrency(
    "Capricoin",
    0x1c,
    0x9c,
    "6",
    "Q",
    "CS1mBL1dyCR8jH5hRrQiZ4Xz37UWwcbUAJ"
  ),
  createCurrency(
    "CassubianDetk",
    0x1e,
    0x9e,
    "6",
    "Q",
    "DBPagysmjfdkND4Zp1SM4myLenNfXpFWnG"
  ),
  createCurrency(
    "CashCoin",
    0x22,
    0xa2,
    "6",
    "[QR]",
    "F3bkQC7xGZZcPFmsucYas7KuHoEwCPtGHC"
  ),
  createCurrency(
    "Catcoin",
    0x15,
    0x95,
    "[56]",
    "P",
    "9rEXDemG6S3k2ddAsKFzRpnMVz3bVryYXZ"
  ),
  createCurrency(
    "ChainCoin",
    0x1c,
    0x9c,
    "6",
    "Q",
    "Ca62ZnR3sfKotqDJzsBW6k75rTFFgFkw1x"
  ),
  createCurrency(
    "ColossusCoinXT",
    0x1e,
    0xd4,
    "5",
    "[LK]",
    "D9buTahK9CXNxoGzXLZ9tamwrQzdW2MzvG"
  ),
  createCurrency(
    "Condensate",
    0x3c,
    0xbc,
    "7",
    "U",
    "RRZZMHaYZXCeUWRVeRvttKCNcvTRCxBfqD"
  ),
  createCurrency(
    "Copico",
    0x1c,
    0x90,
    "5",
    "N",
    "CKWBhVUwQP4fRw6xJk4nxCqKYCMz74bPKr"
  ),
  createCurrency(
    "CopperCoin",
    0x1c,
    0x9c,
    "6",
    "Q",
    "CXh8p64WqmEwTkQSDk9azaZUqrnXE9WESV"
  ),
  createCurrency(
    "Corgicoin",
    0x1c,
    0x9c,
    "6",
    "Q",
    "CNwV11TaKrfB3TnBS8vQjNbWT6CNxV8GBi"
  ),
  createCurrency(
    "CryptoBullion",
    0x0b,
    0x8b,
    "5",
    "M",
    "Cd9CgzTChm9yJQZ3SL3PUSsMkEEN8LGwCF"
  ),
  createCurrency(
    "CryptoClub",
    0x23,
    0xa3,
    "6",
    "R",
    "FKPFTw5LjoeGTZP1d3zHLfZNm91FktgPWY"
  ),
  createCurrency(
    "Cryptoescudo",
    0x1c,
    0x9c,
    "6",
    "Q",
    "Cd9CgzTChm9yJQZ3SL3PUSsMkEEN8LGwCF"
  ),
  createCurrency(
    "Cryptonite",
    0x1c,
    0x80,
    "5",
    "[LK]",
    "CP6uhgcDnXzdgQhnz2q1xhSFMFinmqkQkh"
  ),
  createCurrency(
    "CryptoWisdomCoin",
    0x49,
    0x87,
    "5",
    "[LM]",
    "WYeSz9KmpjgdtycPiJVPcQdp7bBqECfr3W"
  ),
  createCurrency(
    "C2coin",
    0x1c,
    0x9c,
    "6",
    "Q",
    "Cd3kyj77p2zivnqbcoBzNya7LD1w7uUU9v"
  ),
  createCurrency(
    "Dash",
    0x4c,
    0xcc,
    "7",
    "X",
    "XdYX6AbDzjb3AVL1tAmWjuYMD28LD9fcWS"
  ),
  createCurrency(
    "DeafDollars",
    0x30,
    0xb0,
    "6",
    "T",
    "LNHYnoqySwoN5aMyEVavEBT3CxHA9WrTZs"
  ),
  createCurrency(
    "DeepOnion",
    0x1f,
    0x9f,
    "6",
    "Q",
    "DhUAMCqydnYNx9PmeQ1wnyeyAxi477DbTz"
  ),
  createCurrency(
    "Deutsche eMark",
    0x35,
    0xb5,
    "7",
    "T",
    "Ni4112Tmv1ScZ9fkN76knJ4jRTxeHQieJM"
  ),
  createCurrency(
    "Devcoin",
    0x00,
    0x80,
    "5",
    "[LK]",
    "1GUeBfpVhN7xySQej3HiSe5c8jQoVQPosv"
  ),
  createCurrency(
    "DigiByte",
    0x1e,
    0x9e,
    "6",
    "Q",
    "D9s71nQPBCEbM2SvGwHQcrhay6KrJaVo3Z"
  ),
  createCurrency(
    "Digitalcoin",
    0x1e,
    0x9e,
    "6",
    "Q",
    "D7fJwPfW4dFSJNq4NHbMiYJhYnrZehMpqx"
  ),
  createCurrency(
    "Dimecoin",
    0x0f,
    0x8f,
    "5",
    "N",
    "7CRKjq135uBC2FgatpAzoJFLPRGL9gCqVp"
  ),
  createCurrency(
    "DNotes",
    0x1f,
    0x9f,
    "6",
    "Q",
    "DqmNyJd9xiaNpE65meAYX6EqJCFDwhsQoX"
  ),
  createCurrency(
    "Dogecoin",
    0x1e,
    0x9e,
    "6",
    "Q",
    "D74Npoqhwhjw9fShkm5wbj6DD2BJXpmzPj"
  ),
  createCurrency(
    "DogecoinDark",
    0x1e,
    0x9e,
    "6",
    "Q",
    "DLbjdRYsfiT62JZf5YxSAfNZJo1VKxDTNP"
  ),
  createCurrency(
    "eGulden",
    0x30,
    0xb0,
    "6",
    "T",
    "LhBsKs2GUb24KBAzZfua5AsqfQF5uPdWXQ"
  ),
  createCurrency(
    "eKrona",
    0x2d,
    0xad,
    "6",
    "S",
    "KLi8FnMZmSH8EfXYgJwi4R2ZyMscJykXT5"
  ),
  createCurrency(
    "ELECTRA",
    0x21,
    0xa1,
    "6",
    "Q",
    "EeJGVF9efipxqJcwf7dup735ATEDc2f1Yk"
  ),
  createCurrency(
    "Ember",
    0x5c,
    0x32,
    "2",
    "8",
    "eGFUogU3DceaBgY5a6qBQC22WwYsboG2gw"
  ),
  createCurrency(
    "Emerald",
    0x22,
    0xa2,
    "6",
    "[QR]",
    "EnJnzAQSpPp7RshMhNx9zhRnabxTLird6W"
  ),
  createCurrency(
    "Emercoin",
    0x21,
    0x80,
    "5",
    "[LK]",
    "EN5nVyEbLrhYfcjoyGgQFtD3QHETyj1dy1"
  ),
  createCurrency(
    "EnergyCoin",
    0x5c,
    0xdc,
    "8",
    "Z",
    "eD2P3q5PdyHYNwT94Dg6Wt4pBz64k8gwGf"
  ),
  createCurrency(
    "Espers",
    0x21,
    0x90,
    "5",
    "N",
    "EVB5z1zoYYZrjUnGw3fekn1aMjfVhMUKHW"
  ),
  createCurrency(
    "Fastcoin",
    0x60,
    0xe0,
    "8",
    "a",
    "frxe8F7gQdiAVgy4mRXjpXH5vN1wyta1db"
  ),
  createCurrency(
    "Feathercoin",
    0x0e,
    0x8e,
    "5",
    "N",
    "6dxAP6oacHsove5X2kZPpddcT1Am167YzC"
  ),
  createCurrency(
    "Fedoracoin",
    0x21,
    0x80,
    "5",
    "[KL]",
    "ENRPj6iEh14Xky2hv4B7zTJGMe5Kchjeo8"
  ),
  createCurrency(
    "Fibre",
    0x23,
    0xa3,
    "6",
    "R",
    "F6qGSM29vJm2q3Q9uvozpym7WYqKXBrpqm"
  ),
  createCurrency(
    "Florincoin",
    0x23,
    0xb0,
    "6",
    "T",
    "FLJ7vLPZDLMVr2KPEvZMgWvh8TCXj5Bn3m"
  ),
  createCurrency(
    "Flurbo",
    0x23,
    0x30,
    "6",
    "8",
    "FH65pxAbpGjLzjGGfGETSZhgLf2SXGuGBi"
  ),
  createCurrency(
    "Fluttercoin",
    0x23,
    0xa3,
    "6",
    "R",
    "FJioRLt3gLtqk3tUdMhwjAVo1sdWjRuwqt"
  ),
  createCurrency(
    "FrazCoin",
    0x23,
    0xa3,
    "6",
    "R",
    "F8uHqHrLrToXSMrVVTzap34LBhVSEEWUmm"
  ),
  createCurrency(
    "Freicoin",
    0x00,
    0x80,
    "5",
    "[LK]",
    "18kVnAk5Undi7CqEgGx63YDKBPFpxYJmT9"
  ),
  createCurrency(
    "FUDcoin",
    0x23,
    0xa3,
    "6",
    "R",
    "FEKsbaLJHjbEnuMiRDvtnyvxaJqehBtQ5V"
  ),
  createCurrency(
    "Fuelcoin",
    0x24,
    0x80,
    "5",
    "[KL]",
    "Fq1sL24MgDt7tTiKh8MPvhz2UMP8e1uCo4"
  ),
  createCurrency(
    "Fujicoin",
    0x24,
    0xa4,
    "6",
    "R",
    "Fqr2ZrqWPCryqsfjdghwMT3enGHukGonit"
  ),
  createCurrency(
    "GabenCoin",
    0x10,
    0x90,
    "5",
    "N",
    "7cwtF11nW4qAGp2pFdLuUZ5gzJWiXtUvi1"
  ),
  createCurrency(
    "Garlicoin",
    0x26,
    0xb0,
    "6",
    "T",
    "GdHMURSy1H9NbognUvKNmBXciMnqEpRnjg"
  ),
  createCurrency(
    "GlobalBoost",
    0x26,
    0xa6,
    "6",
    "R",
    "GeXdH1WhzA7ayYim9sdCCQKcVukUq1W8LJ"
  ),
  createCurrency(
    "Goodcoin",
    0x26,
    0xa6,
    "6",
    "R",
    "GM3kAbQGaMVAYk8U3CrVGhSwz1hZaF6gVM"
  ),
  createCurrency(
    "GridcoinResearch",
    0x3e,
    0xbe,
    "7",
    "V",
    "SHs9ESzUL9VAEcq7kStfF1JUAMaNT1EYzJ"
  ),
  createCurrency(
    "Gulden",
    0x26,
    0xa6,
    "6",
    "R",
    "GLD7BDBYyddx6Sr72zGfreRG21dJAe74j8"
  ),
  createCurrency(
    "Guncoin",
    0x27,
    0xa7,
    "6",
    "R",
    "GwVej6c3tF9GqEdSKmwJiUDWtQVK2wY9fP"
  ),
  createCurrency(
    "HamRadioCoin",
    0x00,
    0x80,
    "5",
    "LK",
    "1JQVWKT1NQJUJbbq4UdJUY8DbWmgqrrHWz"
  ),
  createCurrency("HFRcoin", 0x10, 0x90, "5", "N", ""),
  createCurrency(
    "HOdlcoin",
    0x28,
    0xa8,
    "5",
    "[LK]",
    "H9SvPiwASJnsCcNS6QWJc3vi3FxoEHEKVb"
  ),
  createCurrency(
    "HTMLCoin",
    0x29,
    0xa9,
    "6",
    "S",
    "HskoM3SRgw3QLV1vHm98cCbFQedHfXZyM2"
  ),
  createCurrency(
    "HyperStake",
    0x75,
    0xf5,
    "9",
    "d",
    "p71G6VRVxTTxg3Hqa9CbENeJY1PumBjtvL"
  ),
  createCurrency(
    "ImperiumCoin",
    0x30,
    0xb0,
    "6",
    "T",
    "LKcNNWGDyKyedwL8QNsCkg2122fBQyiDat"
  ),
  createCurrency(
    "IncaKoin",
    0x35,
    0xb5,
    "7",
    "T",
    "NdEXATr2NSG1pkzC2kScnEnj6g3KYpLnT9"
  ),
  createCurrency(
    "IncognitoCoin",
    0x00,
    0x80,
    "5",
    "LK",
    "1BbRmhGKyKshFge9kBMdfJyQr3KZoh5K5t"
  ),
  createCurrency(
    "Influxcoin",
    0x66,
    0xe6,
    "8",
    "b",
    "i83eN9HxFvfsxSwjXiZQZaWf13cWF25K9Y"
  ),
  createCurrency(
    "Innox",
    0x4b,
    0xcb,
    "7",
    "X",
    "XQm6Vy2tTh87ZnWg6cBdZBmYVExbVuScBF"
  ),
  createCurrency(
    "IridiumCoin",
    0x30,
    0xb0,
    "6",
    "T",
    "LKTu2strS8zV1mDJxJtgE3HLqChD2m54yN"
  ),
  createCurrency(
    "iCash",
    0x66,
    0xcc,
    "7",
    "X",
    "iKCghTCFEPhriPxrduWxks2SCDE1XKzCU6"
  ),
  createCurrency(
    "iXcoin",
    0x8a,
    0x80,
    "5",
    "[LK]",
    "xnF1nshqFLaVdDGBmQ4k2jBQkr8nbuCkLz"
  ),
  createCurrency(
    "Judgecoin",
    0x2b,
    0xab,
    "6",
    "S",
    "JbF9ZnvoFkBdasPEq21jCCTnTUDSiyWrAQ"
  ),
  createCurrency(
    "Jumbucks",
    0x2b,
    0xab,
    "6",
    "S",
    "JSzHiaoD6ewtymBMJHsHqkpFzCYKBzxJeC"
  ),
  createCurrency("Kagonmacoin", 0x2d, 0x80, "5", "[LK]", ""), // WIF UNKNOWN
  createCurrency(
    "KHcoin",
    0x30,
    0xb0,
    "6",
    "T",
    "LZWM2nptWZpSDZna5k96Rk1uqN8NDTigvK"
  ),
  createCurrency(
    "KittehCoin",
    0x2d,
    0xad,
    "6",
    "S",
    "KQkaGcgZvbKXoNWaPh5upwUMvEVvvEY5tY"
  ),
  createCurrency(
    "Koto",
    0x1836,
    0x80,
    "5",
    "[LK]",
    "k1CgSBTwDC79jm1Kucox2DdCakCd2Z9HarJ"
  ),
  createCurrency(
    "Lanacoin",
    0x30,
    0xb0,
    "6",
    "T",
    "LhqrrTHtfNMn8rZi7QesFbbpJYeGWX7319"
  ),
  createCurrency(
    "Latium",
    0x17,
    0x80,
    "5",
    "[LK]",
    "ASz2EgegeXfKyHaY1SbJ6nCDK6sxd7BpXg"
  ),
  createCurrency(
    "LBRY Credits",
    0x55,
    0x80,
    "5",
    "[LK]",
    "bTLCuxhV5m6DK9yPmADz9H23PyoaQo84KP"
  ),
  createCurrency(
    "Litecoin",
    0x30,
    0xb0,
    "6",
    "T",
    "LiScnsyPcqsyxn1fx92BcFguryXcw4DgCy",
    0x05,
    "ltc"
  ),
  createCurrency(
    "LiteDoge",
    0x5a,
    0xab,
    "6",
    "S",
    "daaV1gQ63HpHHn4Ny1fJZHMA7KCeUVE538"
  ),
  createCurrency(
    "LoMoCoin",
    0x30,
    0xb0,
    "6",
    "T",
    "LSdeGMxfMFX38GHCFQT65SJaU1E8ezT2og"
  ),
  createCurrency(
    "MadbyteCoin",
    0x32,
    0x6e,
    "4",
    "H",
    "MCBdZDK326yhGM77nWjj3vHX96edd2PQW3"
  ),
  createCurrency(
    "MagicInternetMoney",
    0x30,
    0xb0,
    "6",
    "T",
    "LPRqCTYEy53FkEzhRTCauLc7Qq23Z5mxZU"
  ),
  createCurrency(
    "Magicoin",
    0x14,
    0x94,
    "5",
    "[NP]",
    "9H6ddyu9S9gyrEHxVrpMBTBZWrwAvdtehD"
  ),
  createCurrency("MangaCoin", 0x6e, 0xb0, "6", "T", "", 0x61, "manga"),
  createCurrency(
    "Marscoin",
    0x32,
    0xb2,
    "6",
    "T",
    "M8caDttyKt2r7V7WHMMkRZ1jEzxj16fgCn"
  ),
  createCurrency(
    "MarteXcoin",
    0x32,
    0xb2,
    "6",
    "T",
    "M8DSVG13j3qpNDRbuuUBh5juQmSd15wLXH"
  ),
  createCurrency(
    "MasterDoge",
    0x33,
    0x8b,
    "5",
    "M",
    "Mm4Xqy9FYZ8N1NJzuXCaJLZcw8o2cmVC7c"
  ),
  createCurrency(
    "Mazacoin",
    0x32,
    0xe0,
    "8",
    "a",
    "MLUXCv3GfNgmUSXc5Ek3ePaQ4cfsJwEXHa"
  ),
  createCurrency(
    "Megacoin",
    0x32,
    0xb2,
    "6",
    "T",
    "MPeVmJHvkXN3caneWCB5zGgtGHRRBSLmWd"
  ),
  createCurrency("MiningEnthusiastCoin", 0x30, 0xb0, "6", "T", ""),
  createCurrency(
    "MintCoin",
    0x33,
    0xb3,
    "[67]",
    "T",
    "MdT7t7MhbgQLSdMhHJCyoGHUuniqZDrj4h"
  ),
  createCurrency(
    "MobiusCoin",
    0x00,
    0x80,
    "5",
    "[LK]",
    "1HKNrUR3BaFC8u4VMfnjCuXDPrYGh7jU8S"
  ),
  createCurrency(
    "MonetaryUnit",
    0x10,
    0x7e,
    "5",
    "K",
    "7gzstwRu4owvwk7Se5pPVG8A5pgdgsDzUV"
  ),
  createCurrency(
    "Monacoin",
    0x32,
    0xb0,
    "6",
    "T",
    "MPE8npAXs49HMpQGkETFqBa8GBzsRM5FJn",
    0x37,
    "mona"
  ),
  createCurrency(
    "Monocle",
    0x32,
    0xb2,
    "6",
    "T",
    "M9CFHZjyCipuKqByD5K1sCHmt7etuCFGsc"
  ),
  createCurrency(
    "MoonCoin",
    0x03,
    0x83,
    "5",
    "L",
    "2P2V9npcK7apbUFsWN3zL7R6ARBMwTJ4hA"
  ),
  createCurrency(
    "Myriadcoin",
    0x32,
    0xb2,
    "6",
    "T",
    "MWGDtjDw9c8C6zicDQF22yZBWbEX53v4o9"
  ),
  createCurrency("NAMAPOSTAMP", 0x35, 0x80, "5", "[LK]", ""),
  createCurrency(
    "NameCoin",
    0x34,
    0x80,
    "5",
    "[LK]",
    "NASxLK4nt5hgX9wQEny5qPPJ2q4uSGCvT9"
  ),
  createCurrency(
    "Navcoin",
    0x35,
    0x96,
    "6",
    "P",
    "NP2wVKjiT1PbpkFMCfkSxR7QsV3iezf4T6"
  ),
  createCurrency(
    "NeedleCoin",
    0x35,
    0xb5,
    "7",
    "T",
    "NYtEDYHNabMqiad5J2tEPFwE9wnhJQpN1W"
  ),
  createCurrency(
    "NEETCOIN",
    0x35,
    0xb5,
    "7",
    "T",
    "NgTALUftFyFk8osvqo5TryBkeNYKvGBssp"
  ),
  createCurrency(
    "NYC",
    0x3c,
    0xbc,
    "7",
    "U",
    "RY1XJPWksA5zUTCNJ416XJhY9yiFSFfTvz"
  ),
  createCurrency(
    "Neoscoin",
    0x35,
    0xb1,
    "6",
    "T",
    "NZw6WJPiKYcXxua1VveieihiNJRYanHjrP"
  ),
  createCurrency(
    "Nevacoin",
    0x35,
    0xb1,
    "6",
    "T",
    "NQDJrKGP3TNhKhKzaHMdg1Wk9FWCT4Nx3q"
  ),
  createCurrency(
    "Novacoin",
    0x08,
    0x88,
    "5",
    "M",
    "4EZMrEA5LnmwtcK5b2JfCq9k5YS4ZVZrtT"
  ),
  createCurrency(
    "Nubits",
    0x19,
    0xbf,
    "7",
    "V",
    "BPWCkyaVqWdaf3uqahrgdTjB2QTnRZzPMM"
  ),
  createCurrency(
    "Nyancoin",
    0x2d,
    0xad,
    "6",
    "S",
    "KHRsf8ofFYqGm4XoeHuFakKPLs5CH2dhK3"
  ),
  createCurrency(
    "Ocupy",
    0x73,
    0xf3,
    "9",
    "[cd]",
    "ocLKVPkQRFtKn5mFygrd4QJG9eZd1sKTyi"
  ),
  createCurrency(
    "Omnicoin",
    0x73,
    0xf3,
    "9",
    "[cd]",
    "oMesh62joeab2yMoJUH28mGE8h2suDzcYc"
  ),
  createCurrency(
    "Onyxcoin",
    0x73,
    0xf3,
    "9",
    "[cd]",
    "odRRCGXooJvKs7cn7sax1bJv9EJwwEy94Z"
  ),
  createCurrency("PacCoin", 0x18, 0x98, "6", "P", ""),
  createCurrency("Particl", 0x38, 0x6c, "4", "[HG]", ""),
  createCurrency(
    "Paycoin",
    0x37,
    0xb7,
    "7",
    "U",
    "PV2t9zzj9rQm81c9VJqqL8edj1ndpcW9HD"
  ),
  createCurrency(
    "Pandacoin",
    0x37,
    0xb7,
    "7",
    "U",
    "PT6guZjCgsrBkqCUhTnG1NNBYBqgzo8gVv"
  ),
  createCurrency(
    "ParkByte",
    0x37,
    0xb7,
    "7",
    "U",
    "PCLozfQ5cBinqdRFGEf6DkuC56YU1jWzMQ"
  ),
  createCurrency(
    "Peercoin",
    0x37,
    0xb7,
    "7",
    "U",
    "PSnwUwknbmqUU1GCcM1DNxcANqihpdt3tW"
  ),
  createCurrency(
    "Pesetacoin",
    0x2f,
    0xaf,
    "6",
    "[ST]",
    "L6qoz2SQN6U9vGNoST35QP85PQbg4s5rDn"
  ),
  createCurrency(
    "PHCoin",
    0x37,
    0xb7,
    "7",
    "U",
    "P9e6c714JUHUfuBVHSS36eqaxGCN6X8nyU"
  ),
  createCurrency(
    "PhoenixCoin",
    0x38,
    0xb8,
    "7",
    "U",
    "PsaaD2mLfAPUJXhMYdC1DBavkJhZj14k6X"
  ),
  createCurrency(
    "PiggyCoin",
    0x76,
    0xf6,
    "9",
    "d",
    "pqXotCKo6mmtYtLY5mi9uEW22mPFgKoLvx"
  ),
  createCurrency(
    "Pinkcoin",
    0x3,
    0x83,
    "[RQP]",
    "L",
    "2Xgy8K2n5cVmnm8Se2rDojQ1GdfHdktx8r"
  ),
  createCurrency(
    "PIVX",
    0x1e,
    0xd4,
    "8",
    "Y",
    "DSiCurCzgdzqSP1urFg3VZJfrpyhMWjEAp"
  ),
  createCurrency(
    "Peercoin",
    0x37,
    0xb7,
    "7",
    "U",
    "PSnwUwknbmqUU1GCcM1DNxcANqihpdt3tW"
  ),
  createCurrency(
    "Potcoin",
    0x37,
    0xb7,
    "7",
    "U",
    "PQcMNuCdeooMcS5H3DGwxXnSE2kmyVMU39"
  ),
  createCurrency(
    "Primecoin",
    0x17,
    0x97,
    "6",
    "P",
    "AbXChfoHyFESePFuVh1xLZdn7Rj1mfD2a4"
  ),
  createCurrency(
    "ProsperCoinClassic",
    0x3a,
    0xba,
    "7",
    "Q",
    "QXLqozFHKP1fdvx4LKMYmtEHWciEZ9pD2F"
  ),
  createCurrency(
    "Quark",
    0x3a,
    0xba,
    "7",
    "U",
    "QNGJBwRApKKwEevTvDwpeoSgmo6w6wv8yQ"
  ),
  createCurrency(
    "Qubitcoin",
    0x26,
    0xe0,
    "8",
    "a",
    "GeNTNSwEh5ZCRCE6LtnMwHCk8VU2Lu8QE7"
  ),
  createCurrency(
    "Reddcoin",
    0x3d,
    0xbd,
    "7",
    "[UV]",
    "RmAB99NsX6Wbjk5WdqNeEab83y72d7zkqZ"
  ),
  createCurrency(
    "Riecoin",
    0x3c,
    0x80,
    "5",
    "[LK]",
    "RUsNQFds88sdWszMUVKwfdBhE9PtzLTK6N"
  ),
  createCurrency(
    "Rimbit",
    0x3c,
    0xbc,
    "7",
    "U",
    "RJNYNAafwKmkGf1hb3LDXiL1gRhSPPrXxN"
  ),
  createCurrency("Ringo", 0x3c, 0x80, "5", "[LK]", ""), // WIF UNKNOWN
  createCurrency(
    "ROIcoin",
    0x3c,
    0x80,
    "5",
    "[LK]",
    "RKUwWKMfwoq2trvQ4Q3a529U7KZq3Pq6gw"
  ),
  createCurrency(
    "Rubycoin",
    0x3c,
    0xbc,
    "7",
    "U",
    "RNsGHZnnr4pa3nYSp5NsuPtqTAGHT6XWqb"
  ),
  createCurrency(
    "Rupaya",
    0x3c,
    0xbc,
    "7",
    "U",
    "RENYagTnHvczPgFYaAhfVqh9y6B1yaMaij"
  ),
  createCurrency("SanDeGo", 0x3f, 0x80, "5", "[LK]", ""), // WIF UNKNOWN
  createCurrency(
    "Sambacoin",
    0x3e,
    0xbe,
    "7",
    "V",
    "SJdiAgazqtum79HzGbNDxi879NzSDjtH5P"
  ),
  createCurrency(
    "SecKCoin",
    0x3f,
    0xbf,
    "7",
    "V",
    "Se1aaa5T1HRpMEfyBPGswVUgTQoZUst9jA"
  ),
  createCurrency("SELN", 0x3f, 0x4b, "3", "C", ""),
  createCurrency(
    "SibCoin",
    0x3f,
    0x80,
    "5",
    "[LK]",
    "SY7GAzvFVS8bUA89e7hosPMxqMS482ecsp"
  ),
  createCurrency(
    "SixEleven",
    0x34,
    0x80,
    "5",
    "[LK]",
    "NGPimZxoZMmAsoF4eJME8TkG7UW8vqoJQJ"
  ),
  createCurrency(
    "SmileyCoin",
    0x19,
    0x99,
    "6",
    "P",
    "BEaZDZ8gCbbP1y3t2gPNKwqZa76rUDfR73"
  ),
  createCurrency(
    "SongCoin",
    0x3f,
    0xbf,
    "7",
    "V",
    "SSK9MXormZXgF5ZfV599okJRXYh3g9RXGN"
  ),
  createCurrency(
    "SpreadCoin",
    0x3f,
    0xbf,
    "7",
    "V",
    "SjPkh7V2KkySjL52wsD2CpEj4quTtjiaVW"
  ),
  createCurrency("Sprouts", 0x3f, 0x80, "5", "[LK]", ""), // WIF UNKNOWN
  createCurrency(
    "StealthCoin",
    0x3e,
    0xbe,
    "7",
    "V",
    "SJJGGq7UyoUH1TExGJCQ6ee49ztJr2quF8"
  ),
  createCurrency(
    "Stratis",
    0x3f,
    0xbf,
    "7",
    "V",
    "ScMNGH91SpNwbRDeK8vYXXJ3aYpwBr9Pen"
  ),
  createCurrency("Susucoin", 0x3f, 0x80, "5", "[LK]", ""),
  createCurrency(
    "SwagBucks",
    0x3f,
    0x99,
    "6",
    "P",
    "SJJGGq7UyoUH1TExGJCQ6ee49ztJr2quF8"
  ),
  createCurrency(
    "Syscoin",
    0x00,
    0x80,
    "5",
    "[LK]",
    "133miKEHohCR5qnbEZ64MFZkCzFM2HpeAd"
  ),
  createCurrency(
    "Tajcoin",
    0x41,
    0x6f,
    "6",
    "H",
    "TWYZCoBw6Kd5fKZ5wWpqgJaeNAbuRF9Qg8"
  ),
  createCurrency(
    "Terracoin",
    0x00,
    0x80,
    "5",
    "[LK]",
    "1BQH6gBzkxxyMQG3VSJCHnmVGfWu64nbPL"
  ),
  createCurrency(
    "Titcoin",
    0x00,
    0x80,
    "5",
    "[LK]",
    "1CHAo7muicsLHdPk5q4asrEbh6aUeSPpdC"
  ),
  createCurrency(
    "TittieCoin",
    0x41,
    0xc1,
    "7",
    "V",
    "TYrdtLy9irV4u1yo2YQVCkS27RzDzBqWwJ"
  ),
  createCurrency(
    "Topcoin",
    0x42,
    0xc2,
    "7",
    "V",
    "TmDTsQqqv1LWGw4xjGNiJ7ABwdCenf2BFF"
  ),
  createCurrency(
    "TransferCoin",
    0x42,
    0x99,
    "6",
    "P",
    "TbnW6ih8314ksuutJpRjwUbc2mAkz64Tij"
  ),
  createCurrency(
    "TreasureHuntCoin",
    0x32,
    0xb2,
    "6",
    "T",
    "MKnC2upgCNfVMS2phkV8SqGaXUGkn39EaX"
  ),
  createCurrency(
    "TrezarCoin",
    0x42,
    0xc2,
    "7",
    "V",
    "Tw1jsLJKfmcosUCkJuMevdLLJob9wD7PSE"
  ),
  createCurrency(
    "Unobtanium",
    0x82,
    0xe0,
    "8",
    "a",
    "uZ8Gq61NGJ2wz3PLybXyXKLYC1FhRpz8Kq"
  ),
  createCurrency(
    "USDe",
    0x26,
    0xa6,
    "6",
    "R",
    "GQTeNSfx6xPbBNsUfqoZNrrCBQXeY5Dtdu"
  ),
  createCurrency(
    "Vcash",
    0x47,
    0xc7,
    "7",
    "W",
    "VoaKH8ndxJoFfM3XJ7DK3P6g7kxASpCf5g"
  ),
  createCurrency(
    "Versioncoin",
    0x46,
    0xc6,
    "7",
    "W",
    "VRYmn3ABchWK7ZSx2V3VD6TzxmqCLsxJSH"
  ),
  createCurrency(
    "VergeCoin",
    0x1e,
    0x9e,
    "6",
    "Q",
    "DJvyiaUdFAH7zmn23SaWzSj9FT5X9a3pSS"
  ),
  createCurrency(
    "Vertcoin",
    0x47,
    0x80,
    "5",
    "[LK]",
    "VkmBz8JJWLP1sVH9sGwc1Fz7o5RtXLW4J5"
  ),
  createCurrency(
    "Viacoin",
    0x47,
    0xc7,
    "7",
    "W",
    "VeJMvqvsZFoTkYfitzEG8fYy7bC7hxMfT1"
  ),
  createCurrency(
    "VikingCoin",
    0x46,
    0x56,
    "3",
    "D",
    "VJXz1cD1mDGQmu52aDdd7Q2G5ejqA6mcqw"
  ),
  createCurrency("VIPSTARCOIN", 0x46, 0x80, "5", "[LK]", ""),
  createCurrency(
    "W2Coin",
    0x49,
    0xc9,
    "7",
    "W",
    "Wa3AvKUP5J3BpEa93nwKHPAAQ2P1XdTCeU"
  ),
  createCurrency("WACoins", 0x49, 0xc9, "7", "W", ""),
  createCurrency(
    "WankCoin",
    0x00,
    0x80,
    "5",
    "[LK]",
    "1CnEFZZxJQkNAvgFGdRV5JEKShkNj1LRWL"
  ),
  createCurrency(
    "WeAreSatoshiCoin",
    0x87,
    0x97,
    "6",
    "P",
    "wSEgPsCGqQESLDyzBJkwCXvMP1z3e1Qi3X"
  ),
  createCurrency(
    "WorldCoin",
    0x49,
    0xc9,
    "7",
    "W",
    "WNmGkn2WQZKS6xKHEsj5AqSbuE4sh9Upyb"
  ),
  createCurrency(
    "XP",
    0x4b,
    0xcb,
    "7",
    "X",
    "XLRykcGjFMpBDQ7PHfamR2DR4Z21qTUBHG"
  ),
  createCurrency("XPChain", 0x4c, 0x80, "5", "[LK]", ""),
  createCurrency(
    "Yenten",
    0x4e,
    0x7b,
    "5",
    "K",
    "YStuCpv1U9iT3L1VqBr52B9nBxrNgt4Fpj"
  ),
  createCurrency("Yajucoin", 0x4e, 0x80, "5", "[LK]", ""), // WIF UNKNOWN
  createCurrency(
    "Zcash",
    0x1cb8,
    0x80,
    "5",
    "[LK]",
    "t1XA64Hw47QaCxCUEgZbc4FVdH811RMd1xp"
  ),
  createCurrency(
    "Zetacoin",
    0x50,
    0xe0,
    "8",
    "a",
    "ZRU6TP8NLzoyey4DPPaa3uCCgDNDc96PXJ"
  ),

  createCurrency("Testnet Bitcoin", 0x6f, 0xef, "9", "c", null, 0xc4, "tb"),
  createCurrency("Testnet BitZeny", 111, 239, "9", "c", null, 196, "tz"),
  createCurrency("Testnet Dogecoin", 0x71, 0xf1, "9", "c", null),
  createCurrency("Testnet MonetaryUnit", 0x26, 0x40, "3", "A", null),
  createCurrency("Testnet Monacoin", 111, 239, "9", "c", null, 196, "tmona"),
  createCurrency("Testnet PIVX", 0x8b, 0xef, "9", "c", null),
  createCurrency("Testnet WACoins", 0x51, 0xd1, "8", "[XY]", null)
];
