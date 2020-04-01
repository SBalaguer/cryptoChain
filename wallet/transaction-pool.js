class TransactionPool {
  constructor() {
    this.transactionMap = {};
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
}

module.exports = TransactionPool;
