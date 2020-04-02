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

  createTransaction({ recipient, amount, chain }) {
    if (chain) {
      this.balance = Wallet.calculateBalance({
        chain,
        address: this.publicKey
      });
    }

    if (amount > this.balance) {
      throw new Error("Amount exceeds balance");
    }

    return new Transaction({ senderWallet: this, recipient, amount });
  }

  static calculateBalance({ chain, address }) {
    let hasConductedTransaction = false;
    let outputsTotal = 0;

    for (let i = chain.length - 1; i > 0; i--) {
      const block = chain[i];
      for (let transaction of block.data) {
        if (transaction.input.address === address) {
          hasConductedTransaction = true;
        }
        const addressOutput = transaction.outputMap[address];
        if (addressOutput) {
          outputsTotal += addressOutput;
        }
      }
      if (hasConductedTransaction) {
        break;
      }
    }
    return hasConductedTransaction
      ? outputsTotal
      : STARTING_BALANCE + outputsTotal;
  }
}

module.exports = Wallet;
