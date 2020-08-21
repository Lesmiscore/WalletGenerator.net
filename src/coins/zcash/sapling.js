module.exports = (async function () {
  // DO NOT EDIT WHEN YOU ADD A NEW COIN
  const Coin = await import("../coin");

  return class ZcashSapling extends Coin {
    constructor(name, donate) {
      super(name, donate);
    }

    /**
     * Create a keypair from specific scalar
     * @param {bigi} d Scalar value from "bigi" package
     * @param {null} Q Unused, used to be public key
     * @param {object} opts Options to be passed
     *  */
    create(d, Q, opts) {}
    /**
     * Create a random keypair
     * @param {object} opts Options to be passed
     *  */
    makeRandom(opts) {}

    /**
     * Check if a given key is a valid private key string
     * @param {string} key Possible private key
     *  */
    isPrivateKey(key) {}

    /**
     * Decode private key string into keypair
     * @param {string} key Private key string
     *  */
    decodePrivateKey(key) {}

    // correspond to getAddressFormatNames, getAddressTitleNames
    /**
     * Calculate an address from keypair
     * Mode number correspond to index of arrays returned from getAddressFormatNames and getAddressTitleNames
     * @param {object} key Keypair
     * @param {number} mode Mode number
     *  */
    getAddressWith(key, mode) {}

    // correspond to getAddressFormatNames, getAddressTitleNames
    /**
     * Convert private key string from keypair
     * Mode number correspond to index of arrays returned from getAddressFormatNames and getAddressTitleNames
     * @param {object} key Keypair
     * @param {number} mode Mode number
     *  */
    getWIFForAddress(key, mode) {}

    // correspond to getWIFTitleNames
    /**
     * Convert private key string from keypair
     * Mode number correspond to index of arrays returned from getWIFTitleNames
     * @param {object} key Keypair
     * @param {number} mode Mode number
     *  */
    getWIFByType(key, mode) {}

    /**
     * Used at address mode dropdown
     * */
    getAddressFormatNames() {
      return [];
    }

    /**
     * Used at Single Wallet tab and public part of Detail Wallet tab
     * */
    getAddressTitleNames() {
      return [];
    }

    /**
     * Used at private part of Detail Wallet tab
     * */
    getWIFTitleNames() {
      return [];
    }

    /**
     * Get public key from keypair
     * @param {object} key Keypair
     * @param {boolean} compressed Is a compressed public key?
     * */
    getPublicKey(key, compressed) {}
    /**
     * Get private key Buffer value from keypair
     * @param {object} key Keypair
     * */
    getPrivateKeyBuffer(key) {}
    /**
     * Does the keypair has private key?
     * @param {object} key Keypair
     * */
    havePrivateKey(key) {}

    /**
     * Check patten is valid for vanitygen, return true if pattern can be a beginning of any address.
     * @param {string} pattern Possible partial address
     * @param {number} mode Mode number corresponding to index of arrays returned from getAddressFormatNames and getAddressTitleNames
     * */
    isVanitygenPossible(pattern, mode) {}

    shouldAddCoinList() {
      return false;
    }
  };
})();
module.exports.__esModule = true;
