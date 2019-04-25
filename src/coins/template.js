// DO NOT EDIT WHEN YOU ADD A NEW COIN
import Coin from "./coin.jsx";

export default class Bitcoin extends Coin {
  constructor(name, donate) {
    super(name, donate);
  }

  create(d, Q, opts) {}
  makeRandom(opts) {}

  isPrivateKey(key) {}

  decodePrivateKey(key) {}

  // correspond to getAddressFormatNames, getAddressTitleNames
  getAddressWith(key, mode) {}

  // correspond to getAddressFormatNames, getAddressTitleNames
  getWIFForAddress(key, mode) {}

  // correspond to getWIFTitleNames
  getWIFByType(key, mode) {}

  getAddressFormatNames() {
    return [];
  }
  getAddressTitleNames() {
    return [];
  }

  getWIFTitleNames() {
    return [];
  }

  getPublicKey(key, compressed) {}
  getPrivateKeyBuffer(key) {}
  havePrivateKey(key) {}
}
