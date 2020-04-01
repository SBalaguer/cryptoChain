const Block = require("./block");
const {cryptoHash} = require("../util");
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

  replaceChain(chain) {
    if (chain.length <= this.chain.length) {
      console.error("The incoming chain must be longer");
      return;
    }

    if (!Blockchain.isValidChain(chain)) {
      console.error("The incoming chain must be valid");
      return;
    }

    console.log("Replaicing chain with", chain);
    this.chain = chain;
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
