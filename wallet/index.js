const { STARTING_BALANCE } = require("../config");
const { ec, cryptoHash } = require("../util");
const Transaction = require("./transaction");

class Wallet {
  constructor() {
    this.balance = STARTING_BALANCE;

    this.keyPair = ec.genKeyPair(); //this will have a private key and a public key

    this.publicKey = this.keyPair.getPublic().encode("hex");
  }

  //wallets need to verify signatures and to provide signatures as well

  sign(data) {
    //sign method is already provided in the ec model
    //the method works better if the data is inside of a cryptograpic hash
    return this.keyPair.sign(cryptoHash(data));
  }

  createTransaction({ recipient, amount }) {
    if (amount > this.balance) {
      throw new Error("Amount exceeds balance");
    }

    return new Transaction({ senderWallet: this, recipient, amount });
  }
}

module.exports = Wallet;
