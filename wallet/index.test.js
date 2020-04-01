const Wallet = require("./index");
const { verifySignature } = require("../util");
const Transaction = require("./transaction");

describe("Wallet", () => {
  let wallet;
  beforeEach(() => {
    wallet = new Wallet();
  });

  //wallet should have a couple of key properties: balance, public key and private key.
  it("has a `balance`", () => {
    expect(wallet).toHaveProperty("balance");
  });
  it("has a `publicKey`", () => {
    //console.log(wallet.publicKey);
    expect(wallet).toHaveProperty("publicKey");
  });

  describe("signing data", () => {
    const data = "foobar";

    it("verifies a signature", () => {
      expect(
        verifySignature({
          publicKey: wallet.publicKey,
          data,
          signature: wallet.sign(data)
        })
      ).toBe(true);
    });

    it("does not verify invalid signature", () => {
      expect(
        verifySignature({
          publicKey: wallet.publicKey,
          data,
          signature: new Wallet().sign(data)
        })
      ).toBe(false);
    });
  });

  describe("createTransaction()", () => {
    //I need a sender wallet, an amount and a recipient
    describe("and the amount exceeds the balance", () => {
      it("throws and error", () => {
        expect(() =>
          wallet.createTransaction({
            amount: 999999,
            recipient: "foo-recipient"
          })
        ).toThrow("Amount exceeds balance");
      });
    });

    describe("and the amount is valid", () => {
      let transaction, amount, recipient;

      beforeEach(() => {
        amount = 50;
        recipient = "foo-recipient";
        transaction = wallet.createTransaction({ amount, recipient });
      });

      it("creates and instance of `Transaction`", () => {
        expect(transaction instanceof Transaction).toBe(true);
      });

      it("matches the transaction input with the wallet", () => {
        expect(transaction.input.address).toEqual(wallet.publicKey);
      });

      it("outputs the amount to the recipient", () => {
        expect(transaction.outputMap[recipient]).toEqual(amount);
      });
    });
  });
});
