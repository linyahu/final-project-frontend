import React, { Component } from 'react'

import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';

class SimpleEquity extends Component {

  showProfile = () => {
    this.props.dispatch({ type: "SEARCH_EQUITY", payload: this.props.companyName.toLowerCase() })
  }

  render() {
    return (
      <div className="simple-equity">
        <NavLink
          className="eq-navlink"
          activeStyle={{ background: "rgba(92, 151, 191, 1)", color: "white"}}
          onClick={this.showProfile}
          to={`/equities/search?=${this.props.equity.company_name.toLowerCase()}`}>{this.props.equity.symbol} - {this.props.equity.company_name}</NavLink>
        <br />
        <p> CEO: {this.props.equity.ceo} </p>
        <p> Industry: {this.props.equity.industry} </p>
        <p> Website: <a className="sm-link" href={this.props.equity.website}>{this.props.equity.website}</a> </p>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    search: state.search,
  }
}

const HOC = connect(mapStateToProps)

export default HOC(SimpleEquity);
