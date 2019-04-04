import React, { Component, Fragment } from 'react'

import SummaryCard from "./SummaryCard"

class Dashboard extends Component {

  /**********************************************
                RENDER FUNCTIONS
  **********************************************/
  renderMain = () => {
    if (this.props.dashboard.name === "main") {
      let otherDashes = this.props.allDashboards.filter(d => d.name !== "main")
      // console.log(otherDashes);
      return (
        <Fragment>
          <div className="newsfeed">
            <h4> newsfeed list </h4>
          </div>
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

  }

  render() {
    return (
      <div className="dashboard">
        <h3>{this.props.dashboard.name} dashboard</h3>
        {
          this.renderMain()
        }
      </div>
    )
  }

}

export default Dashboard
