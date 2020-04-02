const Transaction = require("../wallet/transaction");

class TransactionMiner {
  constructor({ blockchain, transactionPool, wallet, pubsub }) {
    this.blockchain = blockchain;
    this.transactionPool = transactionPool;
    this.wallet = wallet;
    this.pubsub = pubsub;
  }

  mineTransactions() {
    //this will coordinate quite a few behaviours.
    //1-get transaction data from transaction pool to create block; it needs to be valid transactions!
    const validTransactions = this.transactionPool.validTransactions();
    //2-generate a reward transaction from doing this work.
    validTransactions.push(
      Transaction.rewardTransaction({ minerWallet: this.wallet })
    );
    //3-add a block consisting of these transactions to the blockchain.
    this.blockchain.addBlock({ data: validTransactions });
    //4-broadcast the updated blockchain
    this.pubsub.broadcastChain();
    //5-clear the transaction pool
    this.transactionPool.clear();
  }
}

module.exports = TransactionMiner;
