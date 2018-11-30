function printMany() {
    var i = 10;

    function exec() {
        ninja.wallets.paperwallet.build(document.getElementById('paperpassphrase').value);
        setTimeout(function () {
            window.print();
            if (--i > 0) {
                exec();
            }
        }, 100);
    }

    exec();
}

function escapeRegExp(string) {
    return string.replace(/[.*+?^=!:${}()|[\]\/\\]/g, Buffer.from("5c2426", 'hex').toString('utf8'));
}