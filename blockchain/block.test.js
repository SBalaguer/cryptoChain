const hexToBinary = require("hex-to-binary");
const Block = require("./block");
const { GENESIS_DATA, MINE_RATE } = require("../config");
const {cryptoHash} = require("../util");

describe("Block", () => {
  // the name for the actual group of test, then the tests
  const timestamp = 2000;
  const lastHash = "foo-hash";
  const hash = "bar-hash";
  const data = ["blockchain", "data"];
  const nonce = 1;
  const difficulty = 1;
  const block = new Block({
    timestamp,
    lastHash,
    hash,
    data,
    nonce,
    difficulty
  });

  //fist test: ensure all blocks have the data that we want
  it("has a timestamp, a lastHash, hash, and data property", () => {
    expect(block.timestamp).toEqual(timestamp); //what i'm expecting; it's nice to have one expect per function
    expect(block.lastHash).toEqual(lastHash);
    expect(block.hash).toEqual(hash);
    expect(block.data).toEqual(data);
    expect(block.nonce).toEqual(nonce);
    expect(block.difficulty).toEqual(difficulty);
  });

  describe("genesis()", () => {
    const genesisBlock = Block.genesis(); //static function on the block.

    it("returns a Block instance", () => {
      expect(genesisBlock instanceof Block).toBe(true);
    });
    it("returns the genes data", () => {
      expect(genesisBlock).toEqual(GENESIS_DATA);
    });
  });

  describe("mineBlock()", () => {
    const lastBlock = Block.genesis(); //it could be any block, so we are using this one
    const data = "mined data";
    const minedBlock = Block.mineBlock({ lastBlock, data });

    it("returns a Block instance", () => {
      expect(minedBlock instanceof Block).toBe(true);
    });
    it("sets the `lastHash` to be the `hash` of the lastBlock", () => {
      expect(minedBlock.lastHash).toEqual(lastBlock.hash);
    });
    it("sets the `data`", () => {
      expect(minedBlock.data).toEqual(data);
    });
    it("sets the `timestamp`", () => {
      expect(minedBlock.timestamp).not.toEqual(undefined);
    });

    it("creates a SHA-256 `hash` based on the proper inputs", () => {
      //previoushash, timestamp and data as proper inputs
      expect(minedBlock.hash).toEqual(
        cryptoHash(
          minedBlock.timestamp,
          minedBlock.nonce,
          minedBlock.difficulty,
          lastBlock.hash,
          data
        )
      );
    });

    it("sets a `hash` that matches the difficulty criteria", () => {
      expect(
        hexToBinary(minedBlock.hash).substring(0, minedBlock.difficulty)
      ).toEqual("0".repeat(minedBlock.difficulty));
    });

    it("adjusts the `difficulty`", () => {
      const possibleResults = [
        lastBlock.difficulty + 1,
        lastBlock.difficulty - 1
      ];
      expect(possibleResults.includes(minedBlock.difficulty)).toBe(true);
    });
  });

  describe("adjustDifficulty()", () => {
    //console.log(block.difficulty);
    it("raises the difficulty for a quickly mined block", () => {
      expect(
        Block.adjustDifficulty({
          originalBlock: block,
          timestamp: block.timestamp + MINE_RATE - 100
        })
      ).toEqual(block.difficulty + 1);
    });

    it("lowers the difficulty for a slowly mined block", () => {
      expect(
        Block.adjustDifficulty({
          originalBlock: block,
          timestamp: block.timestamp + MINE_RATE + 100
        })
      ).toEqual(block.difficulty - 1);
    });
    it("has a lower limit of one", () => {
      block.difficulty = -1;
      expect(Block.adjustDifficulty({ originalBlock: block })).toEqual(1);
    });
  });
});
