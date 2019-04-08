import React, { Component, Fragment } from 'react';

import TopSummary from './TopSummary'

class Top extends Component {

  renderTenEquities = (prop) => {
    // debugger
    // console.log("%c render ten equities", "color: green", prop, this.props[prop]);
    return (
      <Fragment>
        <h3> top {prop} </h3>
        { this.props[prop].map(equity => {
          return (
            <TopSummary
              equity={equity}
            />
          )
        }) }
      </Fragment>
    )

  }

  render() {
    // debugger
    // console.log("%c top", "color: orange", this.props);
    return (
      <div>
        {
          Object.keys(this.props).map(prop => {
            return (
              <div className="eq-top">
              {this.renderTenEquities(prop) }
              </div>
            )
          })
        }
      </div>
    )
  }
}

export default Top

// will probably have an Equity component --> that also renders the equity chart

// <div>
//   <h3>top ten {prop}</h3>
//   {/*
//     this.props[prop].map( equity => {
//       return <EquityChart />
//     })
//   */}
// </div>
