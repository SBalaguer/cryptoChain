const TransactionPool = require("./transaction-pool");
const Transaction = require("./transaction");
const Wallet = require("./index");
const Blockchain = require("../blockchain");

describe("TransactionPool", () => {
  let transactionPool, transaction, senderWallet;

  beforeEach(() => {
    transactionPool = new TransactionPool();
    senderWallet = new Wallet();
    transaction = new Transaction({
      senderWallet,
      recipient: "fale-recipient",
      amount: 50
    });
  });

  describe("setTransaction()", () => {
    it("adds a transaction", () => {
      transactionPool.setTransaction(transaction);
      expect(transactionPool.transactionMap[transaction.id]).toBe(transaction); //tobe checks that is the exact same thing, not another object with the same values.
    });
  });

  describe("existingTransaction()", () => {
    it("returns an existing transaction given an input address", () => {
      transactionPool.setTransaction(transaction);
      expect(
        transactionPool.existingTransaction({
          inputAddress: senderWallet.publicKey
        })
      ).toBe(transaction);
    });
  });

  describe("validTransactions()", () => {
    let validTransactions, errorMock;
    beforeEach(() => {
      validTransactions = [];
      errorMock = jest.fn();
      global.console.error = errorMock;
      for (let i = 0; i < 10; i++) {
        transaction = new Transaction({
          senderWallet,
          recipient: "any-recipient",
          amount: 30
        });
        if (i % 3 === 0) {
          transaction.input.amount = 999999; //we mess up with the amount
        } else if (i % 3 === 1) {
          transaction.input.signature = new Wallet().sign("foo"); //we mess up with the signature
        } else {
          validTransactions.push(transaction); // we only push the valid ones!
        }
        transactionPool.setTransaction(transaction);
      }
    });

    it("returns a valid transaction", () => {
      expect(transactionPool.validTransactions()).toEqual(validTransactions);
    });
    it("logs and error for the invalid transactions", () => {
      transactionPool.validTransactions();
      expect(errorMock).toHaveBeenCalled();
    });
  });

  describe("clearTransactions()", () => {
    it("clears the transactions", () => {
      transactionPool.clear();

      expect(transactionPool.transactionMap).toEqual({});
    });
  });

  describe("clearBlockchainTransactions()", () => {
    it("clears the pool of any existing blockchain transactions", () => {
      const blockchain = new Blockchain();
      let expectedTransactionMap = {};

      for (let i = 0; i < 6; i++) {
        const transaction = new Wallet().createTransaction({
          recipient: "foo",
          amount: 20
        });
        //we create 6 transactions, all of them go to the transaction pool.
        //half of the transactions go to the blockchain, and therefore are not in the 'expected pool'.
        //the other half are not in the blockchain and thus still in the loop.

        if (i % 2 === 0) {
          blockchain.addBlock({ data: [transaction] });
        } else {
          expectedTransactionMap[transaction.id] = transaction;
        }

        transactionPool.setTransaction(transaction);
      }

      transactionPool.clearBlockchainTransactions({ chain: blockchain.chain });
      expect(transactionPool.transactionMap).toEqual(expectedTransactionMap);
    });
  });
});
