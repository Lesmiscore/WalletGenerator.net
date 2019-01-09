const bitcoin = require('bitcoinjs-lib');

const network = Object.assign({}, bitcoin.networks.bitcoin);

const realArgs = process.argv.slice(2);


const header = parseInt(realArgs[0]);
// allowed: c, u, a (compressed, uncompressed, address)
const type = realArgs[1] || "c";

Object.assign(network, {
    pubKeyHash: header,
    wif: header
});

for (let i = 0; i < 10; i++) {
    const pair = bitcoin.ECPair.makeRandom({
        compressed: type !== "u",
        network
    });
    switch (type) {
        case "c":
        case "u":
        default:
            console.log(pair.toWIF());
            break;
        case "a":
            console.log(pair.getAddress());
            break;
    }
}
