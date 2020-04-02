import React, { Component } from "react";
import { Button } from "react-bootstrap";
import Transaction from "./Transaction";

class Block extends Component {
  state = {
    displayTransaction: false
  };

  toggleTransaction = () => {
    this.setState({ displayTransaction: !this.state.displayTransaction });
  };

  get displayTransaction() {
    const { data } = this.props;
    const stringifiedData = JSON.stringify(data);

    if (this.state.displayTransaction) {
      return (
        <div className="Transaction">
          {data.map(transaction => (
            <div key={transaction.id}>
              <hr />
              <Transaction transaction={transaction} />
            </div>
          ))}
        </div>
      );
    }
  }

  render() {
    const { timestamp, hash } = this.props;
    return (
      <div className="card text-center" style={{ margin: "1em auto", width: "60%" }}>
        <div className="card-header">{hash}</div>
        <div className="card-body">
          <h5 className="card-title">Block Details</h5>
          <p className="card-text">{this.displayTransaction}</p>
          <Button bsStyle="danger" bsSize="small" onClick={this.toggleTransaction}>
            {(this.displayTransaction && "Show Less") || "Show More"}
          </Button>
        </div>
        <div className="card-footer text-muted">{new Date(timestamp).toLocaleString()}</div>
      </div>
    );
  }
}

export default Block;

// <div className="Block">
//   <div></div>
//   <div>Timestamp: {new Date(timestamp).toLocaleString()}</div>
//
// </div>;
