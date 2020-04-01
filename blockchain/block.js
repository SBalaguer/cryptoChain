const hexToBinary = require("hex-to-binary");
const { GENESIS_DATA, MINE_RATE } = require("../config");
const {cryptoHash} = require("../util");

class Block {
  constructor({ timestamp, lastHash, hash, data, difficulty, nonce }) {
    //so that we do not remember the order of the arguments
    this.timestamp = timestamp;
    this.lastHash = lastHash;
    this.hash = hash;
    this.data = data;
    this.nonce = nonce;
    this.difficulty = difficulty;
  }

  static genesis() {
    return new this(GENESIS_DATA);
  } //factory method: creates an instance of a class.

  static mineBlock({ lastBlock, data }) {
    let hash;
    let timestamp;
    //timestamp = Date.now();
    const lastHash = lastBlock.hash;
    let { difficulty } = lastBlock;
    //console.log(difficulty);
    let nonce = 0;

    //the idea is that the hash needs to be such that it adjusts to the level of difficulty and, hence, the block production rate.
    do {
      nonce++;
      timestamp = Date.now();
      difficulty = Block.adjustDifficulty({
        originalBlock: lastBlock,
        timestamp
      });
      hash = cryptoHash(timestamp, lastHash, data, nonce, difficulty);
    } while (
      hexToBinary(hash).substring(0, difficulty) !== "0".repeat(difficulty)
    );

    return new this({
      timestamp,
      lastHash,
      data,
      nonce,
      difficulty,
      hash
      //hash: cryptoHash(timestamp, lastHash, data, nonce, difficulty)
    }); // creates a new block with the last block and the data.
  }

  static adjustDifficulty({ originalBlock, timestamp }) {
    const { difficulty } = originalBlock;
    if (difficulty < 1) return 1;
    const difference = timestamp - originalBlock.timestamp;
    if (difference > MINE_RATE) {
      return difficulty - 1;
    }
    return difficulty + 1;
  }
}

module.exports = Block;
