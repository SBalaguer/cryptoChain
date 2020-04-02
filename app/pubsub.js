const PubNub = require("pubnub");

const credentials = {
  publishKey: "pub-c-a59a12d7-f4f9-40f2-8e4d-aaad7b7bb708",
  subscribeKey: "sub-c-a725d7ae-7401-11ea-bfe6-8e6b20fb8710",
  secretKey: process.env.PUBNUB_SECRET_KEY
};

const CHANNELS = {
  TEST: "TEST",
  BLOCKCHAIN: "BLOCKCHAIN",
  TRANSACTION: "TRANSACTION"
};

class PubSub {
  constructor({ blockchain, transactionPool, wallet }) {
    this.blockchain = blockchain;
    this.transactionPool = transactionPool;
    this.wallet = wallet;

    this.pubnub = new PubNub(credentials);

    this.pubnub.subscribe({ channels: Object.values(CHANNELS) }); //This is the SUBSCRIPTION TO ALL CHANNELS

    this.pubnub.addListener(this.listener());
  }

  listener() {
    //THIS IS THE MESSAGE THAT WILL BE SENT. MESSAGE HAS THE MESSAGE, TIMESTAMP, WHI SENT IT, ETC.

    return {
      message: messageObject => {
        const { channel, message } = messageObject;
        const parsedMessage = JSON.parse(message);

        console.log(
          `Message recieved. Channel ${channel}. Message: ${message}`
        );

        switch (channel) {
          case CHANNELS.BLOCKCHAIN:
            this.blockchain.replaceChain(parsedMessage, true, () => {
              //we will clean the local pool of any transaction included in the parse message
              this.transactionPool.clearBlockchainTransactions({
                chain: parsedMessage
              });
            });
            break;
          case CHANNELS.TRANSACTION:
            if (
              !this.transactionPool.existingTransaction({
                inputAddress: this.wallet.publicKey
              })
            ) {
              this.transactionPool.setTransaction(parsedMessage);
            }
            break;
          default:
            return;
        }
      }
    };
  }

  publish({ channel, message }) {
    //this is to publish into the network.
    this.pubnub.publish({ channel, message });
  }

  broadcastChain() {
    this.publish({
      channel: CHANNELS.BLOCKCHAIN,
      message: JSON.stringify(this.blockchain.chain)
    });
  }

  broadcastTransaction(transaction) {
    this.publish({
      channel: CHANNELS.TRANSACTION,
      message: JSON.stringify(transaction)
    });
  }
}

module.exports = PubSub;
