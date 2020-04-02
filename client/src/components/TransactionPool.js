import React, { Component } from "react";
import { Link } from "react-router-dom";
import Transaction from "./Transaction";
import { Button } from "react-bootstrap";
import history from "../history";
import Navbar from "./Navbar";
import { Toast } from "react-bootstrap";

const POLL_INTERVAL_MS = 10000;

class TransactionPool extends Component {
  state = {
    transactionPoolMap: {},
    success: false
  };

  fetchTransactionMap = () => {
    fetch(`${document.location.origin}/api/transaction-pool-map`)
      .then(response => response.json())
      .then(json => this.setState({ transactionPoolMap: json }))
      .catch(error => console.log(error));
  };

  fetchMineTransactions = () => {
    fetch(`${document.location.origin}/api/mine-transactions`)
      .then(response => {
        if (response.status === 200) {
          alert("success");
          history.push("/blocks");
        } else {
          alert("the mine-transactions block request did not complete");
        }
      })
      .catch(error => console.log(error));
  };

  get successToast() {}

  componentDidMount() {
    this.fetchTransactionMap();
    this.fetchPoolMapInterval = setInterval(() => {
      this.fetchTransactionMap();
    }, POLL_INTERVAL_MS);
  }

  componentWillUnmount() {
    clearInterval(this.fetchPoolMapInterval);
  }

  render() {
    return (
      <div className="container">
        <Navbar page="tpm" />
        <h3>Transaction Pool</h3>
        {Object.values(this.state.transactionPoolMap).map(transaction => {
          return (
            <div key={transaction.id}>
              <hr />
              <Transaction transaction={transaction} />
            </div>
          );
        })}
        <hr />
        <Button bsStyle="danger" onClick={this.fetchMineTransactions}>
          Mine the Transactions
        </Button>
      </div>
    );
  }
}

export default TransactionPool;
