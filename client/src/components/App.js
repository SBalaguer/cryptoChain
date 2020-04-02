import React, { Component } from "react";
import logo from "../assets/logo.png";
import { Link } from "react-router-dom";

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
      <div>
        <img className="logo" src={logo} alt="" />
        <br />
        <div>Welcome to the blockchain...</div>
        <br />
        <div>
          <Link to="/blocks">Blocks</Link>
          <Link to="/conduct-transaction">Conduct Transaction</Link>
          <Link to="/transaction-pool">Transaction Pool</Link>
        </div>
        <div className="WalletInf">
          <div>Address: {address}</div>
          <div>Balance: {balance}</div>
        </div>
      </div>
    );
  }
}

export default App;
