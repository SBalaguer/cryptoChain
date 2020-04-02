import React, { Component, Fragment } from "react";
import { FormGroup, FormControl, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import history from "../history";
import Navbar from "./Navbar";

class ConductTransaction extends Component {
  state = {
    recipient: "",
    amount: 0,
    knownAdresses: []
  };

  componentDidMount() {
    fetch(`${document.location.origin}/api/known-addresses`)
      .then(response => response.json())
      .then(json => this.setState({ knownAdresses: json }));
  }
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
    const show = !this.state.knownAdresses.length ? false : true;
    return (
      <div className="container">
        <Navbar page="ct" />
        {show && (
          <Fragment>
            <h4>List of Known Addresses in the Chain</h4>
            <ul className="list-group list-group-flush" style={{ marginBottom: "1em" }}>
              {this.state.knownAdresses.map(knownAdress => {
                return (
                  <li key={knownAdress} className="list-group-item list-group-item-light">
                    {knownAdress}
                  </li>
                );
              })}
            </ul>
          </Fragment>
        )}
        <h4>Create Transaction</h4>
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
