// renders the details of each stock that's in your portfolio
import React, { Component, Fragment } from 'react';

import { NavLink } from 'react-router-dom';

import DetailCard from './DetailCard'

class Details extends Component {
  state = {
    viewClosedPositions: false,
  }

  viewClosedPositions = () => {
    this.setState( prevState => {
      return { viewClosedPositions: !prevState.viewClosedPositions }
    })
  }


  render() {
    // console.log("props in details", this.props);
    return (
      <div className="grey-border portfolio-card bottom">
        <h4>Current Trades</h4>
        {
          this.state.viewClosedPositions ?
          <Fragment>
          <div>
            <button onClick={this.viewClosedPositions}> view open positions </button>
          </div>
          {
            this.props.subportfolios.map(sub => {
              if (!!sub.date_sold) {
                return (
                  <DetailCard
                  key={sub.id}
                  subportfolio={sub}
                  portfolio={this.props.portfolio}
                  />
                )
              }
            })
          }
          </Fragment>
          :
          <Fragment>
          <div>
            <button onClick={this.viewClosedPositions}> view closed positions </button>
          </div>
          {
            this.props.subportfolios.map(sub => {
              if (!sub.date_sold) {
                return (
                  <DetailCard
                  key={sub.id}
                  subportfolio={sub}
                  portfolio={this.props.portfolio}
                  />
                )
              }
            })
          }
          </Fragment>
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
