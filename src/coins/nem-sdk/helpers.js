function isHexadecimal(str) {
  return str.match("^(0x|0X)?[a-fA-F0-9]+$") !== null;
}

function isPrivateKeyValid(privateKey) {
  if (privateKey.length !== 64 && privateKey.length !== 66) {
    return false;
  } else if (!isHexadecimal(privateKey)) {
    return false;
  } else {
    return true;
  }
}

function isPublicKeyValid(publicKey) {
  if (publicKey.length !== 64) {
    return false;
  } else if (!isHexadecimal(publicKey)) {
    return false;
  } else {
    return true;
  }
}

module.exports = {
  isHexadecimal,
  isPrivateKeyValid,
  isPublicKeyValid,
};
