import React, { Component } from 'react'

import EquityChart from './EquityChart'

class Equity extends Component {
  state ={
    data: {
      labels: [],
      datasets: [{
            label: '',
            borderColor: 'rgba(0, 0, 0, 0.1)',
            // backgroundColor:'rgb(255,255,255,1)',
            pointBorderColor: 'rgb(255,255,255,0)',
            // pointBackgroundColor:'rgb(255,255,255,1)',
            lineTension: 1,
            data: []
        }]
    },
    legend: {
      display: false,
    },
    options: {
      scales: {
        xAxes: [{
          ticks: {
            display: false, // show label
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
                EVENT FUNCTIONS
  **********************************************/


  /**********************************************
                LIFECYCLE FUNCTIONS
  **********************************************/
  componentDidMount() {
    // if current time is between market hours, fetch intraday
    // else fetch from /1d
    // let url = `https://api.iextrading.com/1.0/stock/${this.props.ticker}/chart/1d`

    // this.fetchIntradayData()

    this.fetchPostCloseTradeData()

    this.fetchStatsData()
  }

  /**********************************************
              CHANGE STATE FUNCTIONS
  **********************************************/
  setDatapoints = (json) => {
    // debugger
    let datapoints = json.map( d => {
      if (d.average > -1) {
        return d.average
      } else if (d.marketAverage > -1){
        return d.marketAverage
      }
    })

    let labels = json.map( d => d.label)

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
  }

  /**********************************************
                  FETCH FUNCTIONS
  **********************************************/
  fetchPostCloseTradeData() {
    fetch(`https://api.iextrading.com/1.0/stock/${this.props.ticker}/chart/1d`)
    .then(res => res.json())
    .then( json => {
      // console.log(json);
      this.setDatapoints(json)
    })
  }

  fetchIntradayData() {
    fetch(`https://api.iextrading.com/1.0/stock/${this.props.ticker}/chart/dynamic`)
    .then(res => res.json())
    .then( json => {
      // console.log(json);
      if(!!json.data) {
        this.setDatapoints(json.data)
      }
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
    return (
      <div className="eq-card">
        {
          !!this.props.delete ?
          <button onClick={() => this.props.delete(this.props.ticker, this.props.id)}>X</button>
          :
          null
        }

        <button onClick={() => this.props.showProfile(this.props.ticker)}>show profile</button>

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
