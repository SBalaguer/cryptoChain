import React, { Component } from "react";
import { FormGroup, FormControl, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import history from "../history";

class ConductTransaction extends Component {
  state = {
    recipient: "",
    amount: 0
  };

  updateRecipient = event => {
    event.preventDefault();
    const value = event.target.value;
    this.setState({ recipient: value });
  };

  updateAmount = event => {
    event.preventDefault();
    const value = event.target.value;
    this.setState({ amount: Number(value) });
  };

  ConductTransaction = () => {
    const { recipient, amount } = this.state;
    fetch(`${document.location.origin}/api/transact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ recipient, amount })
    })
      .then(response => response.json())
      .then(json => {
        alert(json.message || json.type);
        history.push("/transaction-pool");
      })
      .catch(error => console.log(error));
  };

  render() {
    return (
      <div className="ConductTransaction">
        <Link to="/">Home</Link>
        <h3>Conduct Transaction</h3>
        <FormGroup>
          <FormControl
            input="text"
            placehholder="Recipient"
            value={this.state.recipient}
            onChange={this.updateRecipient}
          />
        </FormGroup>
        <FormGroup>
          <FormControl
            input="number"
            placehholder="Amount"
            value={this.state.amount}
            onChange={this.updateAmount}
          />
        </FormGroup>
        <div>
          <Button bsStyle="danger" onClick={this.ConductTransaction}>
            Submit Transaction
          </Button>
        </div>
      </div>
    );
  }
}

export default ConductTransaction;
