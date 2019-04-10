import React, { Component } from 'react';

// import EquityProfile from './EquityProfile'
import Equity from './Equity'

class TopSummary extends Component {


  render() {
    // debugger
    // console.log("%c top", "color: orange", this.props);
    return (
      <div className="card">
        <Equity
          ticker={this.props.equity.symbol}
          companyName={this.props.equity.companyName}
          showProfile={true}
        />
          <h5> average volume: {Math.round(this.props.equity.avgTotalVolume/100000)/10}m |
              market cap: ${Math.round(this.props.equity.marketCap/100000)/10}m </h5>
          <h5> previous close: ${this.props.equity.previousClose} |
              52 week high: ${this.props.equity.week52High} |
              52 week low: ${this.props.equity.week52Low}</h5>

      </div>
    )
  }
}

export default TopSummary
