import React, { Component, Fragment } from 'react'

import Equity from './Equity'
import Financials from './Financials'
import HistoricChart from './HistoricChart'

//gets equity as a prop
class EquityProfile extends Component {
  state = {
    showFinancials: false,
    showHistoricChart: false,
  }

  showDetails = (e) => {
    this.setState({
      [e.target.name]: true
    })
  }

  closeDetails = (e) => {
    this.setState({
      [e.target.name]: false
    })
  }

  /**********************************************
                RENDER FUNCTIONS
  **********************************************/
  renderProfile() {
    return (
      <div className="eq-profile">
        <h3>{this.props.equity.company_name}</h3>

        <div className="eq-profile-details">
          <p>Sector: {this.props.equity.sector} </p>
          <p>Industry: {this.props.equity.industry} </p>
          <p>{this.props.equity.description}</p>
        </div>

        <Equity
          ticker={this.props.equity.symbol}
          companyName={this.props.equity.company_name}
        />
        <button name="showFinancials" onClick={this.showDetails}> view financials </button>
        <button name="showHistoricChart" onClick={this.showDetails}> historic charts </button>
      </div>
    )
  }
  render() {
    console.log("%c props in equity profile?", "color: orange", this.props);
    return (
      <Fragment>
        { this.renderProfile() }
        {
          this.state.showFinancials ?
          <Financials
            ticker={this.props.equity.symbol}
            closeDetails={this.closeDetails}
          />
          :
          null
        }
        {
          this.state.showHistoricChart ?
          <HistoricChart
            ticker={this.props.equity.symbol}
            closeDetails={this.closeDetails}
          />
          :
          null
        }
      </Fragment>
    )
  }
}

export default EquityProfile

// equity profile will have Equity on clicking the card
// --> display details undermeath it in another component
// --> which will then have EquityChart
