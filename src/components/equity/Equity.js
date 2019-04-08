import React, { Component } from 'react'

import EquityChart from './EquityChart'

class Equity extends Component {
  state ={
    data: {
      borderColor: 'rgb(255,255,255,1)',
      lineColor: 'rgb(255,255,255,1)',
      labels: [],
      datasets: [{
            label: '',
            // backgroundColor: 'rgb(255, 205, 86)',
            borderColor: 'rgb(255, 205, 86)',
            pointBorderColor: 'rgb(255,255,255,1)',
            // pointBackgroundColor: 'rgb(255,255,255,1)',
            lineColor: 'rgb(255,255,255,1)',
            data: []
        }]
    },
    legend: {
      display: false,
    },
    options: {
      borderColor: 'rgb(255,255,255,1)',
      scales: {
        xAxes: [{
          ticks: {
            fontColor: 'rgba(255,255,255,1)'
          },
          gridLines: {
            display: false,
            color: 'rgba(255,255,255,0.5)'
          }
        }],
        yAxes: [{
          ticks: {
            fontColor: 'rgba(255,255,255,1)'
          },
          gridLines: {
            display: false,
            color: 'rgba(255,255,255,0.5)'
          }
        }]
      }
    },
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
      console.log(json);
      // this.setState({ data: json.data })
      // let datapoints = []
      let datapoints = json.data.map( d => {
        if (d.average > -1) {
          return d.average
        } else if (d.marketAverage > -1){
          return d.marketAverage
        }
      })

      let labels = json.data.map( d => d.label)

      console.log("fetch intraday data", datapoints, labels)

      this.setState({
        data: {
          labels: labels,
          datasets: [{
                label: '',
                backgroundColor: 'rgb(0,0,0,0)',
                borderColor: 'rgb(255, 99, 132)',
                data: datapoints
            }]
        }
      })
    })
  }

  fetchStatsData() {
    fetch(`https://api.iextrading.com/1.0/stock/${this.props.ticker}/quote`)
    .then(res => res.json())
    .then( json => {
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
    console.log(this.state.data);
    return (
      <div className="equity-card">
        <h5>{this.props.ticker} - {this.props.companyName}</h5>
        <EquityChart
          ticker={this.props.ticker}
          data={this.state.data}
          legend={this.state.legend}
          options={this.state.options}
        />
        <h6>sector: {this.state.stats.sector}</h6>
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
