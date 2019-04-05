import React, { Component } from 'react'

class SummaryCard extends Component {

  render() {
    // console.log(this.props);
    return (
      <div className="summary-card">
        <h4> summary card for {this.props.dashboard.name}</h4>
      </div>
    )
  }

}

export default SummaryCard
