module.exports = (async function () {
  const Coin = await import("../coin");
  const zWallet = await import("./_z-wallet");
  const bs58check = await import("bs58check");

  return class ZcashZ extends Coin {
    constructor(name, spendingKey, viewingKey, address, donate) {
      super(name, donate);
      this.network = {
        spendingKey: Buffer.from(spendingKey),
        viewingKey: Buffer.from(viewingKey),
        address: Buffer.from(address),
      };
    }

    /**
     * Create a keypair from specific scalar
     * @param {bigi} d Scalar value from "bigi" package
     * @param {null} Q Unused, used to be public key
     * @param {object} opts Options to be passed
     *  */
    create(d, Q, opts) {
      return zWallet.createSpendingKeyFromBuffer(this.network, d.toBuffer());
    }
    /**
     * Create a random keypair
     * @param {object} opts Options to be passed
     *  */
    makeRandom(opts) {
      return zWallet.createSpendingKey(this.network);
    }

    /**
     * Check if a given key is a valid private key string
     * @param {string} key Possible private key
     *  */
    isPrivateKey(key) {
      return true;
    }

    /**
     * Decode private key string into keypair
     * @param {string} key Private key string
     *  */
    decodePrivateKey(key) {
      return key;
    }

    // correspond to getAddressFormatNames, getAddressTitleNames
    /**
     * Calculate an address from keypair
     * Mode number correspond to index of arrays returned from getAddressFormatNames and getAddressTitleNames
     * @param {object} key Keypair
     * @param {number} mode Mode number
     *  */
    getAddressWith(key, mode) {
      switch (mode || 0) {
        default:
        case 0: // Address
          return zWallet.convertSpendingKeyToAddress(key, this.network);
        case 1: // Viewing Key
          return zWallet.convertSpendingKeyToViewingKey(key, this.network);
      }
    }

    // correspond to getAddressFormatNames, getAddressTitleNames
    /**
     * Convert private key string from keypair
     * Mode number correspond to index of arrays returned from getAddressFormatNames and getAddressTitleNames
     * @param {object} key Keypair
     * @param {number} mode Mode number
     *  */
    getWIFForAddress(key, mode) {
      return key;
    }

    // correspond to getWIFTitleNames
    /**
     * Convert private key string from keypair
     * Mode number correspond to index of arrays returned from getWIFTitleNames
     * @param {object} key Keypair
     * @param {number} mode Mode number
     *  */
    getWIFByType(key, mode) {
      return key;
    }

    /**
     * Used at address mode dropdown
     * */
    getAddressFormatNames() {
      return ["Address", "Viewing Key"];
    }

    /**
     * Used at Single Wallet tab and public part of Detail Wallet tab
     * */
    getAddressTitleNames() {
      return ["Address", "Viewing Key"];
    }

    /**
     * Used at private part of Detail Wallet tab
     * */
    getWIFTitleNames() {
      return ["Spending Key"];
    }

    /**
     * Get public key from keypair
     * @param {object} key Keypair
     * @param {boolean} compressed Is a compressed public key?
     * */
    getPublicKey(key, compressed) {
      return Buffer.allocUnsafe(0);
    }
    /**
     * Get private key Buffer value from keypair
     * @param {object} key Keypair
     * */
    getPrivateKeyBuffer(key) {
      return bs58check.decode(key).slice(2);
    }
    /**
     * Does the keypair has private key?
     * @param {object} key Keypair
     * */
    havePrivateKey(key) {
      return true;
    }

    /**
     * Check patten is valid for vanitygen, return true if pattern can be a beginning of any address.
     * @param {string} pattern Possible partial address
     * @param {number} mode Mode number corresponding to index of arrays returned from getAddressFormatNames and getAddressTitleNames
     * */
    isVanitygenPossible(pattern, mode) {
      return false;
    }
  };
})();
module.exports.__esModule = true;
