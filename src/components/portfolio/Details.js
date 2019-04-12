// renders the details of each stock that's in your portfolio
import React, { Component, Fragment } from 'react';

import { NavLink } from 'react-router-dom';

import DetailCard from './DetailCard'

class Details extends Component {


  render() {
    // console.log("props in details", this.props);
    return (
      <div className="grey-border portfolio-card">
        <h4>Portfolio Details</h4>
        {
          this.props.subportfolios.map(sub => {
            return (
              <DetailCard
                subportfolio={sub}
              />
            )
          })
        }
      </div>
    )
  }
}

export default Details

// <NavLink
//   className="navlink"
//   activeStyle={{ background: "rgba(92, 151, 191, 1)", color: "white"}}
//   to="/portfolio/details">Portfolio Details</NavLink>
