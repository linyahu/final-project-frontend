import React, { Component } from 'react';

// import EquityProfile from './EquityProfile'
import Equity from './Equity'

class TopSummary extends Component {


  render() {
    // debugger
    return (
      <div className="card">
        <Equity
          ticker={this.props.equity.symbol}
          companyName={this.props.equity.companyName}
          showProfile={true}
          noStats={true}
          details={this.props.equity}
        />
      </div>
    )
  }
}

export default TopSummary
