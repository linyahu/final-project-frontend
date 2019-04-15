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
            lineTension: 0.1,
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
    showTradeForm: false,
    currentPrice: "",
    quantity: 0,
    addEquityId: 0,
    addDashboardId: 0,
    addedToDashboard: false,
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
    window.setInterval(this.fetchCurrentPrice, 5000)
  }

  /**********************************************
            EVENT / CHANGE STATE FUNCTIONS
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

  showProfile = () => {
    this.props.dispatch({ type: "SEARCH_EQUITY", payload: this.props.companyName.toLowerCase() })
  }

  trade = () => {
    this.setState({ showTradeForm: true })
  }

  closeTradeForm = () => {
    this.setState({ showTradeForm: false })
  }

  handleTrade = (e) => {
    this.setState({ [e.target.name]: e.target.value })
  }

  handleDirection = (e) => {
    if (e.target.value === "sell") {
      this.setState( prevState => {
        return { quantity: -prevState.quantity }
      })
    } else {
      this.setState( prevState => {
        return { quantity: Math.abs(prevState.quantity) }
      })
    }
  }

  addEquityId = (e) => {
    this.setState({ addEquityId: this.props.id, addDashboardId: e.target.value })
  }

  addToDashboard = () => {
    let data = {
      dashboard_id: parseInt(this.state.addDashboardId),
      equity_id: this.state.addEquityId
    }
    fetch("http://localhost:3000/api/v1/equity_dashboards", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accepts": "application/json"
      },
      body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then( json => {
      this.setState({
        addEquityId: 0,
        addDashboardId: 0,
        showTradeForm: false,
        addedToDashboard: true,
      })
    })
  }

  addToPortfolio = () => {
    let data = {
      portfolio_id: this.props.portfolio.id,
      equity_id: this.props.id,
      initial_px: parseFloat(this.state.currentPrice),
      date_bought: (new Date().getFullYear() + "-" + (new Date().getMonth()+1) + "-" + new Date().getDate()),
      quantity: parseFloat(this.state.quantity),
      initial_value: parseFloat(Math.round(this.state.quantity * this.state.currentPrice * 100)/100)
    }

    fetch("http://localhost:3000/api/v1/subportfolios", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accepts": "application/json"
      },
      body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then( json => {
      console.log("after creating subportfolio", json);
      this.updateAccountBalance(json.initial_value)
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

  fetchCurrentPrice = () => {
    // console.log("will fetch price?");
    fetch(`https://api.iextrading.com/1.0/stock/${this.props.ticker}/price`)
    .then(res => res.json())
    .then(json => {
      this.setState({ currentPrice: json })
    })
  }

  updateAccountBalance = (value) => {

  }

  /**********************************************
                RENDER FUNCTIONS
  **********************************************/
  renderTradeForm(id) {
    let dashboardIds = this.props.dashboardEquities.map( e => e.id )
    let portfolioIds = this.props.portfolioEquities.map( e => e.id )
    // console.log("my id", id);
    return (
      <div className="modal">
        <div className="modal-content-sm">
          <button onClick={this.closeTradeForm} className="close">X</button>
          <h4>{this.props.ticker} - ${this.state.currentPrice}</h4>
          {
            dashboardIds.includes(id) || this.state.addedToDashboard ?
            null
            :
            <div>
              <h5> add to a dashboard </h5>
              <select onChange={this.addEquityId}>
              {
                this.props.dashboards.map( dashboard => {
                  if (dashboard.name === "main") {
                    return <option value="">Select</option>
                  } else {
                    return <option value={dashboard.id}>{dashboard.name}</option>
                  }
                })
              }
              </select>
              <button onClick={this.addToDashboard}> add to dashboard </button>
            </div>
          }
          <h6> trading fee: $5 </h6>
          <h6> account balance: {this.props.accountBalance} </h6>
          <label> quantity </label>
          <input name="quantity" onChange={this.handleTrade} value={this.state.quantity} type="text" /><br />
          <label> buy/sell </label>
            <select onChange={this.handleDirection} value={this.state.direction}>
              <option value="buy">buy</option>
              <option value="sell">sell</option>
            </select><br />
          {
            (this.state.quantity * this.state.currentPrice + 5)> this.props.accountBalance ?
            <h5> you don't have anough in your account to cover this trade </h5>
            :
            null
          }
          {
            this.state.quantity < 0 && !portfolioIds.includes(id) ?
            <h5> warning: you don't currently have this stock
            <br />
            in your portfolio, please proceed only if you
            <br />
            understand the risks of short-selling
           </h5>
            :
            null
          }
          <button onClick={this.addToPortfolio}> trade </button>
        </div>
      </div>
    )
  }


  renderStats() {
    return (
      <div>
      <h6>
        open: {this.state.stats.open} |
        close: {this.state.stats.close} |
        high: {this.state.stats.high} |
        low: {this.state.stats.low}
      </h6>
      <h6>current price: {this.state.currentPrice}</h6>
      </div>
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
    // console.log("what are my props in equity", this.props);
    console.log("state stuff", this.state);
    return (
      <div className="eq-card">
        {
          !!this.props.trade ?
          <button onClick={this.trade}>+</button>
          :
          null
        }
        {
          this.state.showTradeForm ?
          this.renderTradeForm(this.props.id)
          :
          null
        }
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
            <h5>{this.state.stats.sector} </h5>
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

      </div>
    )
  }

} // end of Equity component

function mapStateToProps(state) {
  return {
    search: state.search,
    dashboards: state.dashboards,
    dashboardEquities: state.dashboardEquities,
    portfolio: state.portfolio,
    portfolioEquities: state.portfolioEquities,
    accountBalance: state.accountBalance
  }
}

const HOC = connect(mapStateToProps)

export default HOC(Equity);
