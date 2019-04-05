import React, { Component, Fragment } from 'react'

import SummaryCard from './SummaryCard'
import Newsfeed from './Newsfeed'
import Equity from '../equity/Equity'

class Dashboard extends Component {





  /**********************************************
                RENDER FUNCTIONS
  **********************************************/
  renderMain = () => {
    // if (this.props.dashboard.name === "main") {
      let otherDashes = this.props.allDashboards.filter(d => d.name !== "main")
      // console.log(otherDashes);
      return (
        <Fragment>
          <Newsfeed />
          {
            otherDashes.map( dashboard => {
              return (
                <SummaryCard
                  key={dashboard.id}
                  dashboard={dashboard}
                />
              )
            })
          }
        </Fragment>
      )
    // }

  }

  renderNewsfeed = () => {
    if (this.props.dashboard.newsfeed) {
      return <Newsfeed />
    }
  }

  renderCustom = () => {
    return (
      <Fragment>
      { this.renderNewsfeed() }
      {
        this.props.dashboard.equities.map( equity => {
        return (
          <Equity
            key={equity.id}
            ticker={equity.symbol}
          />
        )
      })}
      </Fragment>
    )
  }

  render() {
    // console.log("props in dashboard", this.props.dashboard);
    return (
      <div className="dashboard">
        <h3>{this.props.dashboard.name} dashboard</h3>
        {
          this.props.dashboard.name === "main" ?
          this.renderMain()
          :
          this.renderCustom()
        }

      </div>
    )
  }

}

export default Dashboard
