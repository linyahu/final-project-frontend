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
    stats: {},
    showDropdown: false,
  }


  showProfile = () => {
    this.props.dispatch({ type: "SEARCH_EQUITY", payload: this.props.companyName.toLowerCase() })
  }

  /**********************************************
                LIFECYCLE FUNCTIONS
  **********************************************/
  componentDidMount() {
    // if current time is between market hours, fetch intraday
    // else fetch from post close 1d cata
    let t = new Date().getMonth()+1 + '/' + new Date().getDate() + '/' + new Date().getFullYear()
    let open = t + ' 09:30:00 GMT-0400'
    let close = t + ' 16:00:00 GMT-0400'
    let now = new Date()

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
      this.setDatapoints(json)
    })
  }

  fetchIntradayData() {
    fetch(`https://api.iextrading.com/1.0/stock/${this.props.ticker}/chart/dynamic`)
    .then(res => res.json())
    .then( json => {
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
  renderAddButton() {
    let equityIds = this.props.dashboardEquities.map( e => e.id )
    if (!equityIds.includes(this.props.id)) {
      return (
        <div className="btn-div">
          <button onClick={() => this.props.addButton(this.props.id)}>+</button>
        </div>
      )
    }
  }

  renderDropdown() {

  }

  renderStats() {
    return (
      <h6>
        open: {this.state.stats.open} |
        close: {this.state.stats.close} |
        high: {this.state.stats.high} |
        low: {this.state.stats.low}
      </h6>
    )
  }

  renderDetails() {
    return (
      <div>
      <h5> average volume: {Math.round(this.props.details.avgTotalVolume/100000)/10}m |
          market cap: ${Math.round(this.props.details.marketCap/100000)/10}m </h5>
      <h5> previous close: ${this.props.details.previousClose} |
          52 week high: ${this.props.details.week52High} |
          52 week low: ${this.props.details.week52Low}</h5>
      </div>
    )
  }

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
            to={`/equities/search?=${this.props.companyName.toLowerCase()}`}>{this.props.ticker} - {this.props.companyName}</NavLink>
          :
          <Fragment>
          {
            this.props.companyName ?
            <h4>{this.props.ticker} - {this.props.companyName}</h4>
            :
            null
          }
          </Fragment>
        }

        {
          this.props.showProfile || this.props.delete ?
          <Fragment>
            <h5>{this.state.stats.sector}</h5>
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
          this.renderStats()
        }
        {
          this.props.details ?
          this.renderDetails()
          :
          null
        }
        {/*
          this.props.addButton ?
          this.renderAddButton()
          :
          null
        */}

      </div>
    )
  }

} // end of Equity component

function mapStateToProps(state) {
  return {
    search: state.search,
    dashboardEquities: state.dashboardEquities,
  }
}

const HOC = connect(mapStateToProps)

export default HOC(Equity);
