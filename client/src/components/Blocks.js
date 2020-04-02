import React, { Component } from "react";
import { Link } from "react-router-dom";

import Block from "./Block";

class Blocks extends Component {
  state = { blocks: [] };
  componentDidMount() {
    fetch(`${document.location.origin}/api/blocks`)
      .then(response => response.json())
      .then(json => this.setState({ blocks: json }))
      .catch(error => console.log(error));
  }
  render() {
    //console.log("this.state", this.state);
    return (
      <div>
        <h3>Blocks</h3>
        <div>
          <Link to="/">Home</Link>
        </div>
        {this.state.blocks.map(block => {
          return <Block key={block.hash} {...block} />;
        })}
      </div>
    );
  }
}

export default Blocks;
