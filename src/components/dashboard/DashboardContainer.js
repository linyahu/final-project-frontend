import React, { Component, Fragment } from 'react'

import Dashboard from './Dashboard'

import { connect } from 'react-redux';

class DashboardContainer extends Component {
  state = {
    currentDash: "main",
  }

  /**********************************************
              CHANGE STATE FUNCTIONS
  **********************************************/
  changeDashboard = (e) => {
    this.setState({ currentDash: e.target.value })
  }

  /**********************************************
                LIFECYCLE FUNCTIONS
  **********************************************/
  componentDidMount() {
    this.fetchDashboards()
  }

  /**********************************************
                FETCH FUNCTIONS
  **********************************************/
  // fetch dashboards that belong to the user
  // // pass it up through dispatch
  fetchDashboards() {
    fetch("http://localhost:3000/api/v1/dashboards")
    .then(res => res.json())
    .then( json => {
      let dashboards = json.filter( d => d.user_id === this.props.user_id)
      // console.log('%c in fetchDashboards', 'color: blue', dashboards);
      this.props.dispatch({ type: "SET_DASHBOARDS", payload: dashboards})
    })
  }

  /**********************************************
                RENDER FUNCTIONS
  **********************************************/
  renderDashboardNav = () => {
    if (!!this.props.dashboards) {
      return (
        <Fragment>
        {
          this.props.dashboards.map( dashboard => {
            return (
              <button onClick={this.changeDashboard} value={dashboard.name}>{dashboard.name}</button>
            )
          })
        }
        <button>create new</button>
        </Fragment>
      )
    }
  }

  renderDashboards = () => {
    if (this.props.dashboards != "") {
      let dashboard = this.props.dashboards.find( d => d.name === this.state.currentDash)
      return (
        <Dashboard
          dashboard={dashboard}
          allDashboards={this.props.dashboards}
        />
      )
    }
  }

  render() {
    return (
      <div className="dash-container">
        {this.renderDashboardNav()}
        {this.renderDashboards()}
      </div>
    )
  }
} // end of DashboardContainer component


function mapStateToProps(state) {
  return {
    user_id: state.user_id,
    dashboards: state.dashboards
  }
}

const HOC = connect(mapStateToProps)

export default HOC(DashboardContainer);
