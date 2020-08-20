// https://github.com/howardwu/zcash-wallet/blob/master/src/z-wallet.js
const bs58check = require("bs58check");
const crypto = require("crypto");
const nacl = require("tweetnacl");
const sha256 = require("./_sha256");

// Validates the prefix of the given key.
function validateKey(key) {
  if (key === undefined || key === null) {
    return false;
  } else if ((key[0] & 0xf0) !== 0) {
    return false;
  } else {
    return true;
  }
}

// Generates the SHA256 hash of a formatted key.
function PRF(key, t) {
  if (!Buffer.isBuffer(key)) {
    throw new Error("Invalid key instance");
  }

  if (key.length < 32) {
    throw new Error("Invalid key length");
  }

  const buffer = Buffer.concat([key, Buffer.alloc(32, 0)]);
  buffer[0] |= 0xc0;
  buffer[32] = t;

  return sha256(buffer, { noPreprocess: true, asBytes: true });
}

// Generates the SHA256 hash of a formatted spending key and encoded
// using the x-coordinate of the generator for Curve25519 with NaCl.
function encodedPRF(key) {
  const address = PRF(key, 1);

  return nacl.scalarMult.base(Uint8Array.from(address));
}

// Creates a spending key.
function createSpendingKey(network) {
  const header = network;

  const buffer = crypto.randomBytes(32);
  buffer[0] &= 0x0f;

  const bufferHeader = Buffer.from(header.spendingKey);
  return bs58check.encode(Buffer.concat([bufferHeader, buffer]));
}

// Creates a spending key.
function createSpendingKeyFromBuffer(network, buffer) {
  const header = network;

  buffer[0] &= 0x0f;

  const bufferHeader = Buffer.from(header.spendingKey);
  return bs58check.encode(Buffer.concat([bufferHeader, buffer]));
}

function convertSpendingKeyToViewingKey(key, network) {
  if (!validateKey(key)) {
    throw new Error("Invalid spending key");
  }

  const header = network;

  const decode = bs58check.decode(key);
  const prefix = decode.slice(0, 2);
  const payload = decode.slice(2);

  if (!prefix[0] === header.spendingKey[0] || prefix[1] !== header.spendingKey[1]) {
    throw new Error("Invalid spending key header");
  }

  const keyA = PRF(payload, 0);
  const keyB = PRF(payload, 1);
  keyB[0] &= 248;
  keyB[31] &= 127;
  keyB[31] |= 64;

  const bufferH = Buffer.from(header.viewingKey);
  const bufferA = Buffer.from(keyA);
  const bufferB = Buffer.from(keyB);

  const bufferViewingKey = Buffer.concat([bufferH, bufferA, bufferB]);

  const viewingKey = bs58check.encode(bufferViewingKey);
  if (viewingKey.length !== 97) {
    throw new Error("Invalid viewingKey length");
  }
  return viewingKey;
}

// Converts a provided spending key string to a address string.
function convertSpendingKeyToAddress(key, network) {
  if (!validateKey(key)) {
    throw new Error("Invalid spending key");
  }

  const header = network;

  const decode = bs58check.decode(key);
  const prefix = decode.slice(0, 2);
  const payload = decode.slice(2);

  if (!prefix[0] === header.spendingKey[0] || prefix[1] !== header.spendingKey[1]) {
    throw new Error("Invalid spending key header");
  }

  const addrA = PRF(payload, 0);
  const addrB = encodedPRF(payload);

  const bufferH = Buffer.from(header.address);
  const bufferA = Buffer.from(addrA);
  const bufferB = Buffer.from(addrB);

  const bufferAddr = Buffer.concat([bufferH, bufferA, bufferB]);

  const address = bs58check.encode(bufferAddr);
  if (address.length !== 95) {
    throw new Error("Invalid address length");
  }
  return address;
}

module.exports = {
  createSpendingKey,
  createSpendingKeyFromBuffer,
  convertSpendingKeyToViewingKey,
  convertSpendingKeyToAddress,
};
