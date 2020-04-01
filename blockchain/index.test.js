const Blockchain = require("./index");
const Block = require("./block");
const { cryptoHash } = require("../util");

describe("Blockchain", () => {
  let blockchain;
  let originalChain;
  let newChain;

  beforeEach(() => {
    blockchain = new Blockchain(); //this redefines the blockchain for every single test.
    newChain = new Blockchain(); //to test replace chain
    originalChain = blockchain.chain;
  });

  it("contains a chain array instance", () => {
    expect(blockchain.chain instanceof Array).toBe(true);
  });

  it("should start with the genesis block", () => {
    expect(blockchain.chain[0]).toEqual(Block.genesis());
  });

  it("adds a new block to the chain", () => {
    const newData = "foo Bar";
    blockchain.addBlock({ data: newData });
    expect(blockchain.chain[blockchain.chain.length - 1].data).toEqual(newData);
  });

  describe("isValidChain()", () => {
    describe("when the chain does not start with the genesis block", () => {
      it("returns false", () => {
        blockchain.chain[0] = { data: "fake-genesis-block" };
        expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
      });
    });
    describe("when the chain starts with the genesis block and has multiple blocks", () => {
      beforeEach(() => {
        blockchain.addBlock({ data: "Bears" });
        blockchain.addBlock({ data: "Beets" });
        blockchain.addBlock({ data: "Battlestar Galactica" });
      });
      describe("and a lastHash reference has changed", () => {
        it("returns false", () => {
          blockchain.chain[2].lastHash = "broken-lastHash";
          expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
        });
      });

      describe("and the chain contains a block with an invalid field", () => {
        it("returns false", () => {
          blockchain.chain[2].data = "some-bad-and-evil-data";
          expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
        });
      });

      describe("and the chain contains a block with a jumped difficulty", () => {
        it("returns false", () => {
          //we will change de the difficulty for a very low value and then make sure that this calls it out
          const lastBlock = blockchain.chain[blockchain.chain.length - 1];
          const lastHash = lastBlock.hash;
          const timestamp = Date.now;
          const nonce = 0;
          const data = [];
          const difficulty = lastBlock.difficulty - 3;

          const hash = cryptoHash({
            timestamp,
            difficulty,
            nonce,
            data,
            lastHash
          });

          const badBlock = new Block({
            timestamp,
            lastHash,
            hash,
            nonce,
            difficulty,
            data
          });

          blockchain.chain.push(badBlock);
          expect(Blockchain.isValidChain(blockchain)).toBe(false);
        });
      });

      describe("and the chain does not contain any invalid blocks", () => {
        it("returns true", () => {
          expect(Blockchain.isValidChain(blockchain.chain)).toBe(true);
        });
      });
    });
  });

  describe("replaceChain()", () => {
    let errMock, logMock;
    beforeEach(() => {
      errorMock = jest.fn();
      logMock = jest.fn();
      global.console.error = errorMock; //they only fire when we want; we changed it only for the testing purposes
      global.console.log = logMock; //they only fire when we want; we changed it only for the testing purposes
    });

    describe("when the new chain is not longer", () => {
      beforeEach(() => {
        newChain.chain[0] = { new: "chain" }; //to make it different!
        blockchain.replaceChain(newChain.chain);
      });
      it("does not replace the chain", () => {
        expect(blockchain.chain).toEqual(originalChain);
      });
      it("logs an error", () => {
        expect(errorMock).toHaveBeenCalled();
      });
    });
    describe("when the new chain is longer", () => {
      beforeEach(() => {
        newChain.addBlock({ data: "Bears" });
        newChain.addBlock({ data: "Beets" });
        newChain.addBlock({ data: "Battlestar Galactica" });
      });
      describe("and the chain is invalid", () => {
        beforeEach(() => {
          newChain.chain[2].hash = "some-fake-hash";
          blockchain.replaceChain(newChain.chain);
        });
        it("does not replace the chain", () => {
          expect(blockchain.chain).toEqual(originalChain);
        });
        it("logs an error", () => {
          expect(errorMock).toHaveBeenCalled();
        });
      });
      describe("and the chain is valid", () => {
        beforeEach(() => {
          blockchain.replaceChain(newChain.chain);
        });
        it("replaces the chain", () => {
          expect(blockchain.chain).toEqual(newChain.chain);
        });
        it("logs a new chain", () => {
          expect(logMock).toHaveBeenCalled();
        });
      });
    });
  });
});
