import React, { Component, Fragment } from 'react'

import SummaryCard from './SummaryCard'
import Newsfeed from './Newsfeed'
import Equity from '../equity/Equity'

import { NavLink } from 'react-router-dom';

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
          <Newsfeed equities={this.props.equities}/>
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
      return (
        <Newsfeed
          equities={this.props.dashboard.equities}
        />
      )
    }
  }

  renderCustom = () => {
    return (
      <Fragment>

      <NavLink
      className="navlink-dash"
      activeStyle={{ fontWeight: "bold"}}
      to={`/dashboards/${this.props.dashboard.name}/edit`}> edit </NavLink>

      <h3>{this.props.dashboard.name} dashboard</h3>
      { this.renderNewsfeed() }
      <div className="dashboard-equities">
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
      </div>
      </Fragment>
    )
  }

  render() {
    console.log("%c props in dashboard", "color: orange", this.props);
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
