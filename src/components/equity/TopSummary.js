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
        />
          {/* <h6> sector: {this.props.equity.sector}</h6> */}
          <h6> average volume: {Math.round(this.props.equity.avgTotalVolume/100000)/10}m</h6>
          <h6> market cap: ${Math.round(this.props.equity.marketCap/100000)/10}m</h6>
          {/* <h6> PE ratio: {this.props.equity.peRatio}</h6> */}
          <h6> previous close: {this.props.equity.previousClose}</h6>
          <h6> 52 week high: {this.props.equity.week52High}</h6>
          <h6> 52 week low: {this.props.equity.week52Low}</h6>

      </div>
    )
  }
}

export default TopSummary
