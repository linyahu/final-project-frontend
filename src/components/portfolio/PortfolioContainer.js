import React, { Component, Fragment } from 'react';

import Breakdown from './Breakdown'
import Details from './Details'
import Summary from './Summary'
import SubportfolioContainer from './SubportfolioContainer'

import { connect } from 'react-redux';

class PortfolioContainer extends Component {

  componentDidMount() {
    this.fetchPortfolioData()
  }

  fetchPortfolioData() {

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
      <div>
        <h3> here's your portfolio </h3>
        <Summary
          subportfolios={this.props.portfolio.subportfolios}
        />
        <Details
          subportfolios={this.props.portfolio.subportfolios}
        />
        <Breakdown
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
    // console.log("what are my props", this.props);
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
  // console.log('%c mapStateToProps', 'color: yellow', state);
  // maps the state from the store to the props
  return {
    portfolio: state.portfolio,
    portfolioEquities: state.portfolioEquities,
  }
}

const HOC = connect(mapStateToProps)

export default HOC(PortfolioContainer);
