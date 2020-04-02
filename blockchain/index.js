const Block = require("./block");
const Transaction = require("../wallet/transaction");
const Wallet = require("../wallet");
const { cryptoHash } = require("../util");
const { REWARD_INPUT, MINING_REWARD } = require("../config");

class Blockchain {
  constructor() {
    this.chain = [Block.genesis()];
  }

  addBlock({ data }) {
    const newBlock = Block.mineBlock({
      lastBlock: this.chain[this.chain.length - 1],
      data
    });
    this.chain.push(newBlock);
  }

  replaceChain(chain, validateTransactions, onSuccess) {
    //validateTransactions only for testing purposes because in the test of replaceChain() we have dummy data
    if (chain.length <= this.chain.length) {
      console.error("The incoming chain must be longer");
      return;
    }

    if (!Blockchain.isValidChain(chain)) {
      console.error("The incoming chain must be valid");
      return;
    }

    if (validateTransactions && !this.validTransactionData(chain)) {
      console.error("The incoming chain has invalid transacion data");
      return;
    }

    if (onSuccess) onSuccess(); //this is how you pass a callback function!

    console.log("Replaicing chain with", chain);
    this.chain = chain;
  }

  validTransactionData({ chain }) {
    //not static because it is going to be on this same chain
    for (let i = 1; i < chain.length; i++) {
      const block = chain[i];
      const transactionSet = new Set();
      let rewardTransactionCount = 0;

      for (let transaction of block.data) {
        if (transaction.input.address === REWARD_INPUT.address) {
          rewardTransactionCount += 1;
          if (rewardTransactionCount > 1) {
            console.error("Miner rewards exceed limit");
            return false;
          }
          if (Object.values(transaction.outputMap)[0] !== MINING_REWARD) {
            console.error("Miner reward amount is invalid");
            return false;
          }
        } else {
          if (!Transaction.validTransaction(transaction)) {
            console.error("Invalid Transaction");
            return false;
          }
          const trueBalance = Wallet.calculateBalance({
            chain: this.chain,
            address: transaction.input.address
          });
          if (transaction.input.amount !== trueBalance) {
            console.error("Invalid input amount");
            return false;
          }

          if (transactionSet.has(transaction)) {
            console.error(
              "An identical transaction appears more than once in the block"
            );
            return false;
          } else {
            transactionSet.add(transaction);
          }
        }
      }
    }
    return true;
  }

  static isValidChain(chain) {
    //first thing: genesis block is correct
    if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) {
      //chain in [0] and Block.genesis() are different instances, so it will always be different
      return false;
    }
    for (let i = 1; i < chain.length; i++) {
      //last hash references should be correct
      const actualLastHash = chain[i - 1].hash;
      const { timestamp, lastHash, hash, data, difficulty, nonce } = chain[i];
      const lastDifficulty = chain[i - 1].difficulty;
      if (lastHash !== actualLastHash) {
        return false;
      }
      //hash should be correct
      const validatedHash = cryptoHash(
        timestamp,
        lastHash,
        data,
        difficulty,
        nonce
      );
      if (hash !== validatedHash) {
        return false;
      }
      if (Math.abs(lastDifficulty - difficulty) > 1) return false;
    }
    return true;
  }
}

module.exports = Blockchain;
