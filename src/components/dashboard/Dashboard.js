import React, { Component, Fragment } from 'react'

import SummaryCard from './SummaryCard'
import Newsfeed from './Newsfeed'
import Equity from '../equity/Equity'

import { NavLink } from 'react-router-dom';

class Dashboard extends Component {

  renderMain = () => {
      let otherDashes = this.props.allDashboards.filter(d => d.name !== "main")
      if (this.props.portfolioEquities.length !== 0) {
        let subportfolios = this.props.portfolio.subportfolios.filter( s => !s.date_sold)
        let equities = subportfolios.map( s => s.equity )
        let newPortfolio = {name: "portfolio", equities: equities }

        return (
          <Fragment>
            <Newsfeed
              equities={this.props.equities}
              class="newsfeed grey-border"
            />
            <div className="summary-card-container grey-border">
            {
              this.props.portfolioEquities.length === 0 ?
              null
              :
              <SummaryCard
                key={this.props.portfolio.name}
                dashboard={newPortfolio}
              />
            }
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
            </div>
          </Fragment>
        )
      } else {
        return (
          <Fragment>
            <Newsfeed
              equities={this.props.equities}
              class="newsfeed grey-border"
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
            </div>
          </Fragment>
        )
      }

  }

  renderNewsfeed = () => {
    if (this.props.dashboard.newsfeed) {
      return (
        <Newsfeed
          equities={this.props.dashboard.equities}
          class="newsfeed grey-border"
        />
      )
    }
  }

  renderCustom = () => {
    return (
      <Fragment>
        { this.renderNewsfeed() }

        {
          this.props.dashboard.newsfeed ?
          <div className="dashboard-equities grey-border">
          {
            this.props.dashboard.equities.map( equity => {
            return (
              <Equity
                key={equity.id}
                ticker={equity.symbol}
                companyName={equity.company_name}
                showProfile={true}
                class="dash-eq-card"
              />
            )
          })}
          </div>
          :
          <div className="dashboard-equities-full grey-border">
          {
            this.props.dashboard.equities.map( equity => {
            return (
              <Equity
                key={equity.id}
                ticker={equity.symbol}
                companyName={equity.company_name}
                showProfile={true}
                class="dash-eq-card"
              />
            )
          })}
          </div>
        }



      </Fragment>
    )
  }

  render() {
    // console.log("%c props in dashboard", "color: orange", this.props);
    return (
      <div className="inner-container">
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
