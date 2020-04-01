# cryptoChain

cryptoChain is my first experience building a cryptocurrency as a personal practice exercise. This Crypto has been created with express.js, node.js and React.js. Testing has been made to jest.

## Installation

Clone/fork this repository into your local machines. Online version will be posted later on.

```bash
npm i
npm start
```

## Main Characteristics

### hashFunction

hashFunction has been created using **node's crypto module** and the **SHA-256 hash**. Hashes are created also in it's **hexadecimal form**.

### Mining Method: Proof of Work

Mining method following Proof of Work schema with nonce and difficulty level. Difficulty adjusted by mining time.

### Real Time Network: PubNub

Real time network created with **PubNub** for nodes to communicate between themselves an keep the chain updated at every moment with a distributed ledger.

### Wallet Keys: Elliptic

Private and Public keys are being generated with **Elliptic secp256K1**.

## Next Steps

After mastering and understanding the in and out's of blockchain logic following a stack that I'm used to (MERN), I will be moving to learn how to code this with Solidity.

## Special Thanks

Thanks to Udemy for hosting this learning course and to David Joseph Katz for creating it.
