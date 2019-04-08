import React, { Component } from 'react'

import EquityChart from './EquityChart'

class Equity extends Component {
  state ={
    data: [],
    stats: {}
  }

  /**********************************************
                LIFECYCLE FUNCTIONS
  **********************************************/
  componentDidMount() {
    this.fetchIntradayData()
    this.fetchStatsData()
  }

  /**********************************************
                  FETCH FUNCTIONS
  **********************************************/
  fetchIntradayData() {
    fetch(`https://api.iextrading.com/1.0/stock/${this.props.ticker}/chart/dynamic`)
    .then(res => res.json())
    .then( json => {
      // this.setState({ data: json.data })
      let datapoints = json.data.map( d => d.average)
      // console.log("my component did mount", datapoints)
    })
  }

  fetchStatsData() {
    fetch(`https://api.iextrading.com/1.0/stock/${this.props.ticker}/quote`)
    .then(res => res.json())
    .then( json => {
      console.log(json);
      this.setState({
        stats: {
          open: json.open,
          close: json.close,
          high: json.high,
          low: json.low,
          changeUSD: json.change,
          changePercent: json.changePercent,
          prevClose: json.previousClose,
          sector: json.sector,
        }
      })
    })
  }

  /**********************************************
                RENDER FUNCTIONS
  **********************************************/

  render() {
    // console.log("setting state with stats", this.state.stats);
    // console.log("what are props again", this.props);
    return (
      <div className="equity-card">
        <h5>{this.props.ticker} - {this.props.companyName}</h5>
        <EquityChart
          ticker={this.props.ticker}
          equityData={this.state.data}
        />
        <h6>
          open: {this.state.stats.open} |
          close: {this.state.stats.close} |
          high: {this.state.stats.high} |
          low: {this.state.stats.low}
        </h6>
      </div>
    )
  }

} // end of Equity component

export default Equity
