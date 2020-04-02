const Transaction = require("../wallet/transaction");

class TransactionPool {
  constructor() {
    this.transactionMap = {};
  }

  clear() {
    this.transactionMap = {};
  }

  clearBlockchainTransactions({ chain }) {
    for (let i = 1; i < chain.length; i++) {
      const block = chain[i];
      //here i got all of the data in a block
      for (let transaction of block.data) {
        //here i check all the transactions inside of the data of a block
        if (this.transactionMap[transaction.id]) {
          delete this.transactionMap[transaction.id];
        }
      }
    }
  }

  setTransaction(transaction) {
    this.transactionMap[transaction.id] = transaction; // it also updates because it uses the same ID!
  }

  setMap(transactionMap) {
    this.transactionMap = transactionMap;
  }

  existingTransaction({ inputAddress }) {
    const transactions = Object.values(this.transactionMap);
    return transactions.find(
      transaction => transaction.input.address === inputAddress
    );
  }

  validTransactions() {
    return Object.values(this.transactionMap).filter(transaction =>
      Transaction.validTransaction(transaction)
    );
  }
}

module.exports = TransactionPool;
