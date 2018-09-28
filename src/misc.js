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