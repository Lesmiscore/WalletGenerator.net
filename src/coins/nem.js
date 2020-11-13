module.exports = (async function () {
  const nem = (await import("./nem-sdk")).default;
  const randomBytes = (await import("randombytes")).default;
  const Coin = await import("./coin");

  const result = class NEM extends Coin {
    constructor(name, donate, network) {
      super(name, donate);
      this.network = network || nem.network.data.mainnet.id;
    }

    _create(pk) {
      const kp = nem.keyPair.create(pk);
      return kp;
    }

    create(d, Q, opts) {
      return this._create(d.toBuffer().toString("hex"));
    }
    makeRandom(opts) {
      return this._create(randomBytes(32).toString("hex"));
    }

    isPrivateKey(key) {
      key = `${key}`.toLowerCase();
      if (key.startsWith("0x")) {
        key = key.slice(2);
      }
      return /^[0-9a-f]{64}$/.test(key);
    }

    decodePrivateKey(key) {
      key = `${key}`.toLowerCase();
      if (key.startsWith("0x")) {
        key = key.slice(2);
      }
      return this._create(key);
    }

    // correspond to getAddressFormatNames, getAddressTitleNames
    getAddressWith(key, mode) {
      switch (mode) {
        default:
          //console.log(nem.address.toAddress(Buffer.from("9DBF2EF1AA678759CFF2F2C4D57BEAA8E7DA198A7E14B68F2A22ABBB5675AF8A","hex"), this.network));
          return nem.address.toAddress(key.publicKey, this.network);
      }
    }

    // correspond to getAddressFormatNames, getAddressTitleNames
    getWIFForAddress(key, mode) {
      switch (mode) {
        default:
          return key.secretKey.toString("hex");
      }
    }

    // correspond to getWIFTitleNames
    getWIFByType(key, mode) {
      switch (mode) {
        default:
          return key.secretKey.toString("hex");
      }
    }

    getAddressFormatNames() {
      return ["Normal"];
    }
    getAddressTitleNames() {
      return ["Public Address"];
    }

    getWIFTitleNames() {
      return ["Private Key"];
    }

    getPublicKey(key, compressed) {
      return key.publicKey;
    }
    getPrivateKeyBuffer(key) {
      return key.secretKey;
    }
    havePrivateKey(key) {
      return true;
    }

    isVanitygenPossible(pattern, mode) {
      if (!pattern) return true;
      pattern = pattern.toUpperCase();
      const prefix = nem.network.id2Char(this.network);
      const regex = new RegExp(`^${prefix}[ABCDEFGHIJKLMNOPQRSTUVWXYZ234567]{0,39}$`);
      return regex.test(pattern);
    }
    testVanitygenMatch(pattern, address, mode) {
      pattern = pattern.toUpperCase();
      address = address.toUpperCase();
      return address.startsWith(pattern);
    }

    isUnsure() {
      return "nem";
    }
  };

  result.mainnet = nem.network.data.mainnet.id;
  result.testnet = nem.network.data.testnet.id;
  result.mijin = nem.network.data.mijin.id;
  return result;
})();
module.exports.__esModule = true;
