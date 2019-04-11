import React, { Component } from 'react'

import { connect } from 'react-redux';

import { NavLink } from 'react-router-dom';

class PortfolioContainer extends Component {
  renderEmptyPortfolio() {
    return (
      <div>
        <h3>you currently don't have any stocks in your portfolio</h3>
        <button> start trading! </button>
      </div>
    )
  }

  render() {
    return (
      <div>
        <h2>Portfolio</h2>
        { this.props.portfolioEquities == "" ? this.renderEmptyPortfolio() : null }
      </div>
    )
  }

} // end of PortfolioContainer component

function mapStateToProps(state) {
  return {
    user_id: state.user_id,
    portfolioEquities: state.portfolioEquities
  }
}

const HOC = connect(mapStateToProps)

export default HOC(PortfolioContainer);
