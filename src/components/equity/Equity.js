import React, { Component, Fragment } from 'react'

import EquityChart from './EquityChart'

import { NavLink } from 'react-router-dom';

import { connect } from 'react-redux';

class Equity extends Component {
  state ={
    data: {
      labels: [],
      datasets: [{
            label: '',
            borderColor: 'rgba(0, 0, 0, 0.1)',
            // backgroundColor:'rgb(255,255,255,1)',
            pointBorderColor: 'rgb(255,255,255,0)',
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


  showProfile = () => {
    this.props.dispatch({ type: "SEARCH_EQUITY", payload: this.props.companyName.toLowerCase() })
  }

  /**********************************************
                LIFECYCLE FUNCTIONS
  **********************************************/
  componentDidMount() {
    // if current time is between market hours, fetch intraday
    // else fetch from /1d
    // let url = `https://api.iextrading.com/1.0/stock/${this.props.ticker}/chart/1d`
    let t = new Date().getMonth()+1 + '/' + new Date().getDate() + '/' + new Date().getFullYear()
    let open = t + ' 09:30:00 GMT-0400'
    let close = t + ' 16:00:00 GMT-0400'
    let now = new Date()

    // debugger

    if (Date.parse(now) >= Date.parse(open) && Date.parse(now) <= Date.parse(close)) {
      this.fetchIntradayData()
    } else {
      this.fetchPostCloseTradeData()
    }

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
              borderColor: '#2bcbba',
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
      console.log("%c i fetched post close data", "color: pink");
      this.setDatapoints(json)
    })
  }

  fetchIntradayData() {
    fetch(`https://api.iextrading.com/1.0/stock/${this.props.ticker}/chart/dynamic`)
    .then(res => res.json())
    .then( json => {
      console.log("%c i fetched intraday data", "color: pink");
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
          <button
            className="delete-btn"
            onClick={() => this.props.delete(this.props.ticker, this.props.id)}>X</button>
          :
          null
        }

        {
          this.props.showProfile ?
          <NavLink
          className="navlink"
          activeStyle={{ background: "rgba(92, 151, 191, 1)", color: "white"}}
          onClick={this.showProfile}
          to={`/equities/search?=${this.props.companyName.toLowerCase()}`}>show profile</NavLink>
          :
          null
        }
        {
          this.props.showProfile || this.props.delete ?
          <Fragment>
            <h5>{this.props.ticker} - {this.props.companyName}</h5>
            <h6>sector: {this.state.stats.sector}</h6>
          </Fragment>
          :
          null
        }
        <EquityChart
          ticker={this.props.ticker}
          data={this.state.data}
          legend={this.state.legend}
          options={this.state.options}
        />
        {
          this.props.noStats ?
          null
          :
          <h6>
            open: {this.state.stats.open} |
            close: {this.state.stats.close} |
            high: {this.state.stats.high} |
            low: {this.state.stats.low}
          </h6>
        }

      </div>
    )
  }

} // end of Equity component

function mapStateToProps(state) {
  return {
    search: state.search,
  }
}

const HOC = connect(mapStateToProps)

export default HOC(Equity);


  // <button onClick={this.showProfile}> show profile </button>
