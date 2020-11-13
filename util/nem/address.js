const nem = require("../../src/coins/nem-sdk/index.js");

const privKey = "0001020300010203000102030001020300010203000102030001020300010203";
console.log(`privateKey: ${privKey}`);

const kp = nem.keyPair.create(privKey);
const pk = kp.publicKey;
const sk = kp.secretKey;

console.log(`publicKey: ${pk.toString("hex")}`);

const addr = nem.address.toAddress(pk, 104);
console.log(`address: ${addr}`);
