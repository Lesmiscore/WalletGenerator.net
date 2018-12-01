ninja.wallets.detailwallet = {
	qrscanner: {
		scanner: null,

		start: function () {
			document.getElementById('paperqrscanner').className = 'show';
			ninja.wallets.detailwallet.qrscanner.showError(null);
			var supported = ninja.wallets.detailwallet.qrscanner.scanner.isSupported();
			if (!supported) {
				document.getElementById('paperqrnotsupported').className = '';
			} else {
				ninja.wallets.detailwallet.qrscanner.scanner.start();
			}
		},

		stop: function () {
			ninja.wallets.detailwallet.qrscanner.scanner.stop();
			document.getElementById('paperqrscanner').className = '';
		},

		showError: function (error) {
			if (error) {
				if (error == 'PERMISSION_DENIED' || error == 'PermissionDeniedError') {
					document.getElementById('paperqrerror').innerHTML = '';
					document.getElementById('paperqrpermissiondenied').className = '';
				} else {
					document.getElementById('paperqrerror').innerHTML = error;
					document.getElementById('paperqrpermissiondenied').className = 'hide';
				}
			} else {
				document.getElementById('paperqrerror').innerHTML = '';
				document.getElementById('paperqrpermissiondenied').className = 'hide';
			}
		}
	},

	open: function () {
		document.getElementById("detailarea").style.display = "block";
		document.getElementById("detailprivkey").focus();
		if (!ninja.wallets.detailwallet.qrscanner.scanner) {
			ninja.wallets.detailwallet.qrscanner.scanner = new QRCodeScanner(320, 240, 'paperqroutput',
				function (data) {
					document.getElementById('detailprivkey').value = data;
					document.getElementById('paperqrscanner').className = '';
					ninja.wallets.detailwallet.viewDetails();
				},
				function (error) {
					ninja.wallets.detailwallet.qrscanner.showError(error);
				});
		}
	},

	close: function () {
		document.getElementById("detailarea").style.display = "none";
	},

	openCloseFaq: function (faqNum) {
		// do close
		if (document.getElementById("detaila" + faqNum).style.display == "block") {
			document.getElementById("detaila" + faqNum).style.display = "none";
			document.getElementById("detaile" + faqNum).setAttribute("class", "more");
		}
		// do open
		else {
			document.getElementById("detaila" + faqNum).style.display = "block";
			document.getElementById("detaile" + faqNum).setAttribute("class", "less");
		}
	},

	viewDetails: function () {
		var bip38 = false;
		var key = document.getElementById("detailprivkey").value.toString().replace(/^\s+|\s+$/g, ""); // trim white space
		document.getElementById("detailprivkey").value = key;
		var bip38CommandDisplay = document.getElementById("detailbip38commands").style.display;
		ninja.wallets.detailwallet.clear();
		if (key == "") {
			return;
		}
		if (ninja.privateKey.isBIP38Format(key)) {
			document.getElementById("detailbip38commands").style.display = bip38CommandDisplay;
			if (bip38CommandDisplay != "block") {
				document.getElementById("detailbip38commands").style.display = "block";
				document.getElementById("detailprivkeypassphrase").focus();
				return;
			}
			var passphrase = document.getElementById("detailprivkeypassphrase").value.toString().replace(/^\s+|\s+$/g, ""); // trim white space
			if (passphrase == "") {
				alert(ninja.translator.get("bip38alertpassphraserequired"));
				return;
			}
			document.getElementById("busyblock").className = "busy";
			// show Private Key BIP38 Format
			document.getElementById("detailprivbip38").innerHTML = key;
			document.getElementById("detailbip38").style.display = "block";
			ninja.privateKey.BIP38EncryptedKeyToByteArrayAsync(key, passphrase, function (btcKeyOrError) {
				document.getElementById("busyblock").className = "";
				if (btcKeyOrError.message) {
					alert(btcKeyOrError.message);
					ninja.wallets.detailwallet.clear();
				} else {
					ninja.wallets.detailwallet.populateKeyDetails(ninja.ecpair.create(btcKeyOrError));
				}
			});
		} else {
			var btcKey = ninja.privateKey.decodePrivateKey(key);
			if (!btcKey) {
				// enforce a minimum passphrase length
				if (key.length >= ninja.wallets.brainwallet.minPassphraseLength) {
					// Deterministic Wallet confirm box to ask if user wants to SHA256 the input to get a private key
					var usePassphrase = confirm(ninja.translator.get("detailconfirmsha256"));
					if (usePassphrase) {
						var bytes = bitcoin.crypto.sha256(key);
						btcKey = ninja.ecpair.create(bigi.fromBuffer(bytes), null);
					} else {
						ninja.wallets.detailwallet.clear();
					}
				} else {
					alert(ninja.translator.get("detailalertnotvalidprivatekey"));
					ninja.wallets.detailwallet.clear();
				}
			} else {
				ninja.wallets.detailwallet.populateKeyDetails(btcKey);
			}
		}
	},

	populateKeyDetails: function (btcKey) {
		if (btcKey.d) {
			document.getElementById("detailprivhex").innerHTML = btcKey.d.toBuffer().toString("hex").toUpperCase();
			document.getElementById("detailprivb64").innerHTML = btcKey.d.toBuffer().toString("base64");
			var wif = ninja.privateKey.getWIFWith(btcKey, 1);
			var wifComp = ninja.privateKey.getWIFWith(btcKey, 0);
			document.getElementById("detailprivwif").innerHTML = wif;
			document.getElementById("detailprivwifcomp").innerHTML = wifComp;
			ninja.qrCode.showQrCode({
				"detailqrcodeprivate": wif,
				"detailqrcodeprivatecomp": wifComp
			}, 4);
		}
		var bitcoinAddress = ninja.privateKey.getAddressWith(btcKey, 1);
		var bitcoinAddressComp = ninja.privateKey.getAddressWith(btcKey, 0);
		var pubKeyCompressed = btcKey.Q.getEncoded(true);

		document.getElementById("detailpubkey").innerHTML = btcKey.Q.getEncoded(false).toString("hex").toUpperCase();
		document.getElementById("detailaddress").innerHTML = bitcoinAddress;
		document.getElementById("detailpubkeycomp").innerHTML = pubKeyCompressed.toString("hex").toUpperCase();
		document.getElementById("detailaddresscomp").innerHTML = bitcoinAddressComp;

		if (janin.selectedCurrency.bech32) {
			// pubKey for SegWit addresses must be compressed form
			var redeemScript = bitcoin.script.witnessPubKeyHash.output.encode(bitcoin.crypto.hash160(pubKeyCompressed));
			var bitcoinAddressSegWit = bitcoin.address.toBech32(bitcoin.script.compile(redeemScript).slice(2, 22), 0, janin.selectedCurrency.bech32);
			var scriptPubKey = bitcoin.crypto.hash160(redeemScript);
			var bitcoinAddressSegWitP2SH = bitcoin.address.toBase58Check(scriptPubKey, janin.selectedCurrency.scriptHash);
			document.getElementById("detailaddresssegwit").innerHTML = bitcoinAddressSegWit;
			document.getElementById("detailaddresssegwitp2sh").innerHTML = bitcoinAddressSegWitP2SH;
			ninja.qrCode.showQrCode({
				"detailqrcodesegwit": bitcoinAddressSegWit,
				"detailqrcodesegwitp2sh": bitcoinAddressSegWitP2SH
			}, 4);
		}

		ninja.qrCode.showQrCode({
			"detailqrcodepublic": bitcoinAddress,
			"detailqrcodepubliccomp": bitcoinAddressComp
		}, 4);
	},

	clear: function () {
		document.getElementById("detailpubkey").innerHTML = "";
		document.getElementById("detailpubkeycomp").innerHTML = "";
		document.getElementById("detailaddress").innerHTML = "";
		document.getElementById("detailaddresscomp").innerHTML = "";
		document.getElementById("detailaddresssegwit").innerHTML = "";
		document.getElementById("detailaddresssegwitp2sh").innerHTML = "";
		document.getElementById("detailprivwif").innerHTML = "";
		document.getElementById("detailprivwifcomp").innerHTML = "";
		document.getElementById("detailprivhex").innerHTML = "";
		document.getElementById("detailprivb64").innerHTML = "";
		document.getElementById("detailprivb6").innerHTML = "";
		document.getElementById("detailprivmini").innerHTML = "";
		document.getElementById("detailprivbip38").innerHTML = "";
		document.getElementById("detailqrcodepublic").innerHTML = "";
		document.getElementById("detailqrcodepubliccomp").innerHTML = "";
		document.getElementById("detailqrcodeprivate").innerHTML = "";
		document.getElementById("detailqrcodeprivatecomp").innerHTML = "";
		document.getElementById("detailqrcodesegwit").innerHTML = "";
		document.getElementById("detailqrcodesegwitp2sh").innerHTML = "";
		document.getElementById("detailb6").style.display = "none";
		document.getElementById("detailmini").style.display = "none";
		document.getElementById("detailbip38commands").style.display = "none";
		document.getElementById("detailbip38").style.display = "none";
	}
};