import React, { Component, Fragment } from 'react';

import Breakdown from './Breakdown'
import Details from './Details'
import Summary from './Summary'
import EquityChart from '../equity/EquityChart'

import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';

class PortfolioContainer extends Component {
  state = {
    "Technology": 0,
    "Healthcare": 0,
    "Energy": 0,
    "Industrials": 0,
    "Financial Services": 0,
    "Basic Materials": 0,
    "Consumer Cyclical": 0,
    "Consumer Defensive": 0,
    "Real Estate": 0,
  }

  componentDidMount() {
    this.props.hideNavBar()
    if (!!this.props.portfolio.subportfolios) {
      this.props.portfolio.subportfolios.map(sub => {
        this.fetchEquityData(sub)
      })
    }
  }

  fetchEquityData(sub) {
    fetch(`https://api.iextrading.com/1.0/stock/${sub.equity.symbol}/price`)
    .then(res => res.json())
    .then(json => {
      this.setState(prevState => {
        return { [sub.equity.sector]: prevState[sub.equity.sector] + Math.round(json*sub.quantity*100)/100 }
      })
    })
  }

  getSectorData = () => {
    return {  "Technology": this.state["Technology"],
              "Healthcare": this.state["Healthcare"],
              "Energy": this.state["Energy"],
              "Industrials": this.state["Industrials"],
              "Financial Services": this.state["Financial Services"],
              "Basic Materials": this.state["Basic Materials"],
              "Consumer Cyclical": this.state["Consumer Cyclical"],
              "Consumer Defensive": this.state["Consumer Defensive"],
              "Real Estate": this.state["Real Estate"]
            }
  }

  renderDefault() {
    let data = {
      labels: ["2019-04-8", "2019-04-9", "2019-04-10", "2019-04-11", "2019-04-12", "2019-04-15", "2019-04-16", "2019-04-17", "2019-04-18", "2019-04-19"],
      datasets: [{
            label: '',
            backgroundColor: 'rgb(0,0,0,0)',
            lineTension: 0.1,
            borderColor: '#2bcbba',
            data: [
              Math.floor(Math.random() * 31) + 50,
              Math.floor(Math.random() * 31) + 50,
              Math.floor(Math.random() * 31) + 50,
              Math.floor(Math.random() * 31) + 50,
              Math.floor(Math.random() * 31) + 50,
              Math.floor(Math.random() * 31) + 50,
              Math.floor(Math.random() * 31) + 50,
              Math.floor(Math.random() * 31) + 50,
              Math.floor(Math.random() * 31) + 50,
              Math.floor(Math.random() * 31) + 50,
             ]
        }]
    }

    let legend = {
      display: false,
    }

    let options = {
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
    }

    return (
      <div className="no-portfolio">
        <h3> you currently don't have any stocks in your portfolio</h3>

        <div className="eq-chart">
        <EquityChart
          data={data}
          legend={legend}
          options={options}
        />
        </div>

        <div className="btn-div">
          <NavLink className="pf-link" to="/equities">Explore Equities</NavLink>
          <NavLink className="pf-link" to="/account">Add Account Balance</NavLink>
        </div>

      </div>
    )
  }

  renderPortfolio() {
    return (
      <div className="main-container">
        <Summary
          subportfolios={this.props.portfolio.subportfolios}
          accountBalance={this.props.accountBalance}
        />

        <Breakdown
          sectorData={this.getSectorData()}
        />

        <Details
          subportfolios={this.props.portfolio.subportfolios}
          portfolio={this.props.portfolio}
        />
      </div>
    )
  }

  render() {
    // console.log("%c state?", "color: green", this.state);
    return (
      <div>
      {
        this.props.portfolioEquities.length === 0 ?
        this.renderDefault()
        :
        this.renderPortfolio()
      }
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    user_id: state.user_id,
    portfolio: state.portfolio,
    portfolioEquities: state.portfolioEquities,
    accountBalance: state.accountBalance
  }
}

const HOC = connect(mapStateToProps)

export default HOC(PortfolioContainer);
