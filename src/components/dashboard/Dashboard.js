import React, { Component, Fragment } from 'react'

import SummaryCard from './SummaryCard'
import Newsfeed from './Newsfeed'
import Equity from '../equity/Equity'

import { NavLink } from 'react-router-dom';

class Dashboard extends Component {

  renderMain = () => {
      let otherDashes = this.props.allDashboards.filter(d => d.name !== "main")
      let newPortfolio = {name: "portfolio", equities: this.props.portfolioEquities }
      // console.log(otherDashes);
      return (
        <Fragment>
          <Newsfeed
            equities={this.props.equities}
          />
          <div className="summary-card-container grey-border">
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
          {
            this.props.portfolioEquities.length === 0 ?
            null
            :
            <SummaryCard
              key={this.props.portfolio.name}
              dashboard={newPortfolio}
            />
          }
          </div>
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
        { this.renderNewsfeed() }
        <div className="dashboard-equities grey-border">
        {
          this.props.dashboard.equities.map( equity => {
          return (
            <Equity
              key={equity.id}
              ticker={equity.symbol}
              companyName={equity.company_name}
              showProfile={true}
            />
          )
        })}
        </div>
        <div className="edit-btn">
          <NavLink
          className="navlink-dash"
          activeStyle={{ fontWeight: "bold"}}
          to={`/dashboards/${this.props.dashboard.name}/edit`}> edit </NavLink>
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
