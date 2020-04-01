const EC = require("elliptic").ec;
//ec = elliptic curve algorithm. Bitcoin uses SSCP256K1. Standars of eficient cryptografy 256 bits. K === koblets and 1 for being the first implementation
const cryptoHash = require("./crypto-hash");

const ec = new EC("secp256k1");

const verifySignature = ({ publicKey, data, signature }) => {
  const keyFromPublic = ec.keyFromPublic(publicKey, "hex");
  //we leverage on the verify method on ec. Basicaly we turn our hex public key into a it's original version and then we verify the signature with the publickey itself
  return keyFromPublic.verify(cryptoHash(data), signature);
};

module.exports = { ec, verifySignature, cryptoHash };
