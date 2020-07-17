// from crypto.js from bitgo-utxo-lib

import createHash from 'create-hash'
import { getHashes } from 'crypto'

export function ripemd160 (buffer) {
  var hash = 'rmd160'
  var supportedHashes = getHashes()
  // some environments (electron) only support the long alias
  if (supportedHashes.indexOf(hash) === -1 && supportedHashes.indexOf('ripemd160') !== -1) {
    hash = 'ripemd160'
  }

  return createHash(hash).update(buffer).digest()
}

export function sha1 (buffer) {
  return createHash('sha1').update(buffer).digest()
}

export function sha256 (buffer) {
  return createHash('sha256').update(buffer).digest()
}

export function hash160 (buffer) {
  return ripemd160(sha256(buffer))
}

export function hash256 (buffer) {
  return sha256(sha256(buffer))
}
