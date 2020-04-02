import React, { Component } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

class Navbar extends Component {
  render() {
    return (
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <img className="navbar-brand" src={logo} alt="" />
        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
          <div className="navbar-nav">
            <Link
              className={(this.props.page === "home" && "nav-link active") || "nav-link"}
              to="/"
            >
              Home
            </Link>
            <Link
              to="/blocks"
              className={(this.props.page === "blocks" && "nav-link active") || "nav-link"}
            >
              Blocks
            </Link>
            <Link
              to="/conduct-transaction"
              className={(this.props.page === "ct" && "nav-link active") || "nav-link"}
            >
              Conduct Transaction
            </Link>
            <Link
              to="/transaction-pool"
              className={(this.props.page === "tpm" && "nav-link active") || "nav-link"}
            >
              Transaction Pool & Mining
            </Link>
          </div>
        </div>
      </nav>
    );
  }
}

export default Navbar;
