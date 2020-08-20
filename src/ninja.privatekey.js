module.exports = (async function () {
  const bitcoin = await import("bitgo-utxo-lib");
  const bigi = await import("bigi");
  const bip38 = await import("bip38");
  const wif = await import("wif");
  const elliptic = await import("elliptic");
  const randombytes = (await import("randombytes")).default;
  const scrypt = await import("scryptsy");
  const base58 = await import("base58");
  const bnjs = await import("bn.js");
  const aes = await import("browserify-aes");

  const janin = await import("./janin.currency.js");
  const translator = await import("./ninja.translator.js");

  const isPrivateKey = function (key) {
    return janin.selectedCurrency.isPrivateKey(key);
  };
  const decodePrivateKey = function (key) {
    if (!isPrivateKey(key)) {
      return null;
    }
    return janin.selectedCurrency.decodePrivateKey(key);
  };
  const getAddressWith = function (btcKey, mode) {
    return janin.selectedCurrency.getAddressWith(btcKey, mode);
  };
  const getWIFForAddress = function (btcKey, mode) {
    return janin.selectedCurrency.getWIFForAddress(btcKey, mode);
  };
  const isVanitygenPossible = function (p, m) {
    return janin.selectedCurrency.isVanitygenPossible(p, m);
  };
  const testVanitygenMatch = function (p, a, m) {
    return janin.selectedCurrency.testVanitygenMatch(p, a, m);
  };
  // 58 base58 characters starting with 6P
  const isBIP38Format = function (key) {
    key = key.toString();
    return /^6P[1-9A-HJ-NP-Za-km-z]{56}$/.test(key);
  };
  const BIP38EncryptedKeyToByteArrayAsync = function (base58Encrypted, passphrase, callback) {
    // we're decrypting BIP38-encryped key
    try {
      const decryptedKey = bip38.decrypt(base58Encrypted, passphrase, function (status) {
        console.log(status.percent);
      });
      callback(decryptedKey.privateKey);
    } catch (e) {
      callback(new Error(translator.get("detailalertnotvalidprivatekey")));
    }
  };
  const BIP38PrivateKeyToEncryptedKeyAsync = function (base58Key, passphrase, compressed, callback) {
    // encrypt
    const decoded = wif.decode(base58Key);
    let encryptedKey = bip38.encrypt(decoded.privateKey, compressed, passphrase);
    callback(encryptedKey);
  };
  const BIP38GenerateIntermediatePointAsync = function (passphrase, lotNum, sequenceNum, callback) {
    const noNumbers = lotNum === null || sequenceNum === null;
    let ownerEntropy, ownerSalt;

    if (noNumbers) {
      ownerSalt = ownerEntropy = randombytes(8);
    } else {
      // 1) generate 4 random bytes
      ownerSalt = randombytes(4);

      // 2)  Encode the lot and sequence numbers as a 4 byte quantity (big-endian):
      // lotnumber * 4096 + sequencenumber. Call these four bytes lotsequence.
      const lotSequence = new bigi(4096 * lotNum + sequenceNum).toByteArrayUnsigned();

      // 3) Concatenate ownersalt + lotsequence and call this ownerentropy.
      ownerEntropy = ownerSalt.concat(lotSequence);
    }

    // 4) Derive a key from the passphrase using scrypt
    const prefactor = scrypt(passphrase, ownerSalt, 16384, 8, 8, 32);
    // Take SHA256(SHA256(prefactor + ownerentropy)) and call this passfactor
    const passfactorBytes = noNumbers ? prefactor : bitcoin.crypto.hash256(prefactor.concat(ownerEntropy));
    const passfactor = new bnjs(passfactorBytes);

    // 5) Compute the elliptic curve point G * passfactor, and convert the result to compressed notation (33 bytes)
    const ellipticCurve = elliptic.curves.secp256k1.curve;
    const passpoint = ellipticCurve.g.mul(passfactor).encodeCompressed();

    // 6) Convey ownersalt and passpoint to the party generating the keys, along with a checksum to ensure integrity.
    // magic bytes "2C E9 B3 E1 FF 39 E2 51" followed by ownerentropy, and then passpoint
    const magicBytes = [0x2c, 0xe9, 0xb3, 0xe1, 0xff, 0x39, 0xe2, 0x51];
    if (noNumbers) magicBytes[7] = 0x53;

    let intermediate = magicBytes.concat(ownerEntropy).concat(passpoint);

    // base58check encode
    intermediate = intermediate.concat(bitcoin.crypto.hash256(intermediate).slice(0, 4));
    callback(base58.encode(intermediate));
  };
  const BIP38GenerateECAddressAsync = function (intermediate, compressed, callback) {
    // decode IPS
    const x = base58.decode(intermediate);
    //if(x.slice(49, 4) !== bitcoin.crypto.hash256(x.slice(0,49)).slice(0,4)) {
    //	callback({error: 'Invalid intermediate passphrase string'});
    //}
    const noNumbers = x[7] === 0x53;
    const ownerEntropy = x.slice(8, 8 + 8);
    const passpoint = x.slice(16, 16 + 33);

    // 1) Set flagbyte.
    // set bit 0x20 for compressed key
    // set bit 0x04 if ownerentropy contains a value for lotsequence
    const flagByte = (compressed ? 0x20 : 0x00) | (noNumbers ? 0x00 : 0x04);

    // 2) Generate 24 random bytes, call this seedb.
    const seedB = randombytes(24);

    // Take SHA256(SHA256(seedb)) to yield 32 bytes, call this factorb.
    const factorB = bitcoin.crypto.hash256(seedB);

    // 3) ECMultiply passpoint by factorb. Use the resulting EC point as a public key and hash it into a Bitcoin
    // address using either compressed or uncompressed public key methodology (specify which methodology is used
    // inside flagbyte). This is the generated Bitcoin address, call it generatedaddress.
    const ellipticCurve = elliptic.curves.secp256k1.curve;
    const generatedPoint = ellipticCurve.decodePoint(Buffer.from(passpoint));
    const generatedBytes = generatedPoint.mul(new bnjs(factorB)).getEncoded(compressed);
    const generatedAddress = bitcoin.address.toBase58Check(bitcoin.crypto.hash160(generatedBytes), 0);

    // 4) Take the first four bytes of SHA256(SHA256(generatedaddress)) and call it addresshash.
    const addressHash = bitcoin.crypto.hash256(generatedAddress).slice(0, 4);

    // 5) Now we will encrypt seedb. Derive a second key from passpoint using scrypt
    const derivedBytes = scrypt(passpoint, addressHash.concat(ownerEntropy), 1024, 1, 1, 64);
    // 6) Do AES256Encrypt(seedb[0...15]] xor derivedhalf1[0...15], derivedhalf2), call the 16-byte result encryptedpart1
    for (let i = 0; i < 16; ++i) {
      seedB[i] ^= derivedBytes[i];
    }
    const decipher1 = aes.createDecipher("aes-256-ecb", seedB.slice(0, 16));
    decipher1.setAutoPadding(false);
    decipher1.end(derivedBytes.slice(16, 32));
    const encryptedPart1 = decipher1.read();

    // 7) Do AES256Encrypt((encryptedpart1[8...15] + seedb[16...23]) xor derivedhalf1[16...31], derivedhalf2), call the 16-byte result encryptedseedb.
    const message2 = encryptedPart1.slice(8, 8 + 8).concat(seedB.slice(16, 16 + 8));
    for (let i = 0; i < 16; ++i) {
      message2[i] ^= derivedBytes[i + 16];
    }
    const decipher2 = aes.createDecipheriv("aes-256-ecb", derivedBytes.slice(32));
    decipher2.setAutoPadding(false);
    decipher2.end(message2);
    const encryptedSeedB = decipher2.read();

    // 0x01 0x43 + flagbyte + addresshash + ownerentropy + encryptedpart1[0...7] + encryptedpart2
    let encryptedKey = [0x01, 0x43, flagByte].concat(addressHash).concat(ownerEntropy).concat(encryptedPart1.slice(0, 8)).concat(encryptedSeedB);

    // base58check encode
    encryptedKey = encryptedKey.concat(bitcoin.crypto.hash256(encryptedKey).slice(0, 4));
    callback(generatedAddress, base58.encode(encryptedKey));
  };
  const create = function (d, Q, opts) {
    return janin.selectedCurrency.create(d, Q, opts);
  };
  const makeRandom = function (opts) {
    return janin.selectedCurrency.makeRandom(opts);
  };

  return {
    isPrivateKey,
    decodePrivateKey,
    getAddressWith,
    getWIFForAddress,
    isBIP38Format,
    BIP38EncryptedKeyToByteArrayAsync,
    BIP38PrivateKeyToEncryptedKeyAsync,
    BIP38GenerateIntermediatePointAsync,
    BIP38GenerateECAddressAsync,
    create,
    makeRandom,
    isVanitygenPossible,
    testVanitygenMatch,
  };
})();
module.exports.__esModule = true;
