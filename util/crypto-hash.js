const crypto = require("crypto");

const cryptoHash = (...inputs) => {
  const hash = crypto.createHash("sha256");

  hash.update(
    inputs
      .map(input => JSON.stringify(input))
      .sort()
      .join(" ")
  );

  return hash.digest("hex"); //represents the result of the hash.
};

module.exports = cryptoHash;
