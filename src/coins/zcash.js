import zcash from "bitcoinjs-lib-zcash";
import Bitcoin from "./bitcoin";

export default class Zcash extends Bitcoin {
  constructor(name, networkVersion, privateKeyPrefix, donate) {
    super(name, networkVersion, privateKeyPrefix, donate);
    this.world = zcash;
  }

  getAddressFormatNames() {
    return [
      "Compressed",
      "Uncompressed"
      // no segwit
      // no cashaddress
    ];
  }
  getAddressTitleNames() {
    return ["Public Address Compressed", "Public Address"];
  }
}
