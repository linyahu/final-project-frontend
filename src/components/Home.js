import React, { Component } from 'react';

import { NavLink } from 'react-router-dom';

class Home extends Component {

  componentDidMount() {
    this.props.hideNavBar()
  }

  render() {
    return (
      <div className="landing">
        <div className="blurb">
          a modular financial dashboard to monitor <br /> trends, trade equities, and track performance
        </div>

        <div className="landing-buttons">
        <NavLink className="landing-link" activeStyle={{ color: "white"}}
          to="/login">ENTER ACCOUNT</NavLink>
        <NavLink className="landing-link" activeStyle={{ color: "white"}}
          to="/equities">EXPLORE EQUITIES</NavLink>
        </div>
      </div>
    )
  }
}

export default Home
