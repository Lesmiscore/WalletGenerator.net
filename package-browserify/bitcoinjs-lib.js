// this sets "bitcoinjs-lib" as "bitcoin" variable.
try {
    window.bitcoin = require('bitcoinjs-lib');
} catch (e) {
    global.bitcoin = require('bitcoinjs-lib');
}