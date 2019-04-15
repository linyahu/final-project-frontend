import React, { Component, Fragment } from 'react';

class SubportfolioContainer extends Component {
  render() {
    console.log("props in subportfolio container", this.props);
    return (
      <div className="grey-border">
        <h4>SubportfolioContainer Component </h4>
      </div>
    )
  }
}

export default SubportfolioContainer
