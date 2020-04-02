import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";

import Block from "./Block";

class Blocks extends Component {
  state = {
    blocks: [],
    paginatedId: 1,
    blocksLength: 0
  };
  componentDidMount() {
    this.fetchPaginatedBlocks(this.state.paginatedId)();
    this.fetchBlocksLength();
  }

  fetchPaginatedBlocks = paginatedId => () => {
    fetch(`${document.location.origin}/api/blocks/${paginatedId}`)
      .then(response => response.json())
      .then(json => this.setState({ blocks: json }))
      .catch(error => console.log(error));
  };

  fetchBlocksLength = () => {
    fetch(`${document.location.origin}/api/blocks/length`)
      .then(response => response.json())
      .then(json => this.setState({ blocksLength: json }))
      .catch(error => console.log(error));
  };

  render() {
    //console.log("this.state", this.state);
    return (
      <div>
        <h3>Blocks</h3>
        <div>
          {[...Array(Math.ceil(this.state.blocksLength / 5)).keys()].map(key => {
            //this creates an array y despues .keys nos da el i del array
            const paginatedId = key + 1;
            return (
              <span key={key} onClick={this.fetchPaginatedBlocks(paginatedId)}>
                <Button bsSize="small" bsStyle="danger">
                  {paginatedId}
                </Button>{" "}
              </span>
            );
          })}
        </div>
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
