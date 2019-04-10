import React, { Component } from 'react'

import Equity from './Equity'

//gets equity as a prop
class EquityProfile extends Component {

  render() {
    // console.log("%c props in equity profile?", "color: orange", this.props);
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
        <button> view financials </button>
        <button> some other thing? check API </button>
      </div>
    )
  }
}

export default EquityProfile

// equity profile will have Equity on clicking the card
// --> display details undermeath it in another component
// --> which will then have EquityChart
