// this sets "bitcoinjs-lib" as "bitcoin" variable.
const toExport = {
    bitcoin: require('bitcoinjs-lib'),
    bigi: require('bigi')
};
try {
    Object.assign(window, toExport);
} catch (e) {
    Object.assign(global, toExport);
}