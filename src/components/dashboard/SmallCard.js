import React, { Component, Fragment } from 'react'

import Equity from '../equity/Equity'

class SmallCard extends Component {
  state = {
    summary: [],
  }

  componentDidMount() {
    this.fetchStats()
  }

  fetchStats = () => {
    fetch(`https://api.iextrading.com/1.0/stock/${this.props.ticker}/quote`)
    .then(res => res.json())
    .then(summary => {
      this.setState({ summary })
    })
  }

  renderDetails() {
    return (
      <div className="back">

        <h6>
          Avg Volume: {Math.round(this.state.summary.avgTotalVolume/100000)/10}m
          <br />
          Change: {this.state.summary.change} | {Math.round(this.state.summary.changePercent*1000)/10}%
          <br />
          Last px: {this.state.summary.latestPrice}
          <br />
          High: {this.state.summary.high} | Low: {this.state.summary.low}
          <br />
          52 wk high: {this.state.summary.week52High} | 52 wk low: {this.state.summary.week52Low}
          <br />
          Ytd Change: {Math.round(this.state.summary.ytdChange*1000)/10}%
        </h6>
      </div>
    )
  }

  render() {
    console.log("state in small card", this.state.summary);
    return (
      <div className="sm-card">
        <h5>{this.props.name}</h5>
        {
          this.renderDetails()
        }

        <div className="front">
          <Equity
            ticker={this.props.ticker}
            noStats={true}
          />
        </div>

      </div>
    )
  }


}

export default SmallCard
