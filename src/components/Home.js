import React, { Component } from 'react';

import { NavLink } from 'react-router-dom';

class Home extends Component {

  render() {
    return (
      <div className="landing">
        <div className="blurb">
          build customized watchlists for your stocks
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
