import React, { Component } from "react";
import logo from "../assets/logo.png";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";

class App extends Component {
  state = {
    walletInfo: {}
  };

  componentDidMount() {
    fetch(`${document.location.origin}/api/wallet-info`)
      .then(response => response.json())
      .then(json => this.setState({ walletInfo: json }))
      .catch(error => console.log(error));
  }

  render() {
    const { address, balance } = this.state.walletInfo;
    return (
      <div className="container">
        <Navbar page="home" />
        <br />
        <h1>CyrptoChain</h1>
        <h6>
          Creating my very first Blockchain & Crypto to deeply understand in and out's of it's logic
        </h6>
        <br />
        <div className="card">
          <div className="card-header">Wallet Information</div>
          <div className="card-body">
            <blockquote className="blockquote mb-0">
              <div style={{ marginBottom: "1em" }}>
                <div style={{ color: "#f12d4b" }}>Address</div>
                <div>{address}</div>
                <div style={{ color: "#f12d4b" }}>Current Balance:</div>
                <div>{balance} $SBC</div>
              </div>
              <footer className="blockquote-footer">
                You can share you address with peers so that they can transfer $SBCoin's to you.
              </footer>
            </blockquote>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
