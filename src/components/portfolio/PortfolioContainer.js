import React, { Component, Fragment } from 'react';

import Breakdown from './Breakdown'
import Details from './Details'
import Summary from './Summary'
import SubportfolioContainer from './SubportfolioContainer'

import { connect } from 'react-redux';

class PortfolioContainer extends Component {
  state = {
    "Technology": 0,
    "Healthcare": 0,
    "Industrials": 0,
    "Financial Services": 0,
    "Basic Materials": 0,
    "Consumer Cyclical": 0
  }

  componentDidMount() {
    if (!!this.props.portfolio.subportfolios) {
      this.props.portfolio.subportfolios.map(sub => {
        this.fetchEquityData(sub)
      })
    }
  }

  fetchEquityData(sub) {
    // console.log(sub);
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
              "Industrials": this.state["Industrials"],
              "Financial Services": this.state["Financial Services"],
              "Basic Materials": this.state["Basic Materials"],
              "Consumer Cyclical": this.state["Consumer Cyclical"]}
  }

  renderDefault() {
    return (
      <div className="grey-border">
        <h3> no portfolio </h3>
      </div>
    )
  }

  renderPortfolio() {
    return (
      <div className="portfolio-container">
        <Summary
          subportfolios={this.props.portfolio.subportfolios}
          accountBalance={this.props.accountBalance}
        />

        <Breakdown
          sectorData={this.getSectorData()}

        />

        <Details
          subportfolios={this.props.portfolio.subportfolios}
        />


        <h3> subportfolios here </h3>
        <SubportfolioContainer
          subportfolios={this.props.portfolio.subportfolios}
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
