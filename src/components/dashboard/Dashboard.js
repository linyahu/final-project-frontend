import React, { Component, Fragment } from 'react'

import SummaryCard from './SummaryCard'
import Newsfeed from './Newsfeed'
import Equity from '../equity/Equity'

class Dashboard extends Component {


  /**********************************************
                RENDER FUNCTIONS
  **********************************************/
  renderMain = () => {
      let otherDashes = this.props.allDashboards.filter(d => d.name !== "main")
      // console.log(otherDashes);
      return (
        <Fragment>
          <h3>{this.props.dashboard.name} dashboard</h3>
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
  }

  renderNewsfeed = () => {
    if (this.props.dashboard.newsfeed) {
      return <Newsfeed />
    }
  }

  renderCustom = () => {
    return (
      <Fragment>
      <button>edit</button>
      <h3>{this.props.dashboard.name} dashboard</h3>
      { this.renderNewsfeed() }
      {
        this.props.dashboard.equities.map( equity => {
        return (
          <Equity
            key={equity.id}
            ticker={equity.symbol}
            companyName={equity.company_name}
          />
        )
      })}
      </Fragment>
    )
  }

  render() {
    return (
      <div className="dashboard">
      {
        !!this.props.dashboard ?
        <Fragment>
          {
            this.props.dashboard.name === "main" ?
            this.renderMain()
            :
            this.renderCustom()
          }
        </Fragment>
        :
        null
      }
      </div>
    )
  }

}

export default Dashboard
