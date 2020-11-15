const nem = require("../../src/coins/nem-sdk/index.js");
const Keccak = require("keccak");

const privKey = "0001020300010203000102030001020300010203000102030001020300010203";
console.log(`privateKey: ${privKey}`);

const kp = nem.keyPair.create(privKey);
const pk = kp.publicKey;
const sk = kp.secretKey;

const rSK = Buffer.from(sk).reverse();

const scalar = Buffer.from(Keccak("keccak512").update(rSK).digest()).slice(0, 32);
scalar[0] &= 248;
scalar[31] &= 127;
scalar[31] |= 64;
console.log(`scalar: ${scalar.toString("hex")}`);

console.log(`publicKey: ${pk.toString("hex")}`);

const addr = nem.address.toAddress(pk, 104);
console.log(`address: ${addr}`);
