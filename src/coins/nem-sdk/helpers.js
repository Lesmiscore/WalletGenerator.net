let isHexadecimal = function (str) {
  return str.match("^(0x|0X)?[a-fA-F0-9]+$") !== null;
};

let isPrivateKeyValid = function (privateKey) {
  if (privateKey.length !== 64 && privateKey.length !== 66) {
    return false;
  } else if (!isHexadecimal(privateKey)) {
    return false;
  } else {
    return true;
  }
};

let isPublicKeyValid = function (publicKey) {
  if (publicKey.length !== 64) {
    return false;
  } else if (!isHexadecimal(publicKey)) {
    return false;
  } else {
    return true;
  }
};

module.exports = {
  isHexadecimal,
  isPrivateKeyValid,
  isPublicKeyValid,
};
