import React, { Component, Fragment } from 'react'

import Dashboard from './Dashboard'

import { connect } from 'react-redux';

class DashboardContainer extends Component {
  state = {
    currentDash: "main",
    createDash: false,
  }

  /**********************************************
              CHANGE STATE FUNCTIONS
  **********************************************/
  changeDashboard = (e) => {
    if (this.state.currentDash === "create" && e.target.value !== "create") {
      // if the current dashboard is the create new
      // and you haven't saved yet, it will pop up an alert to ask
      // the user if you're sure
      let a = window.confirm("you haven't saved, are you sure you want to exit?")
      a && this.setState({ currentDash: e.target.value })
    } else {
      this.setState({ currentDash: e.target.value })
    }
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
  renderNewDashboard = () => {
    return (
      <form className="new-dash">
        <input type="text" placeholder="enter dashboard name" />
        <br />
        <button>save</button>
      </form>
    )
  }


  // creates the "navbar" of the different dashboards
  // maps through each of them and creates a little "tab" button
  renderDashboardNav = () => {
    if (!!this.props.dashboards) {
      return (
        <div className="dash-nav">
        {
          this.props.dashboards.map( dashboard => {
            return (
              <button onClick={this.changeDashboard} value={dashboard.name}>{dashboard.name}</button>
            )
          })
        }
        <button id="plus-btn" onClick={this.changeDashboard} value="create">+</button>
        </div>
      )
    }
  }

  renderDashboards = () => {
    if (this.props.dashboards != "") {
      if (this.state.currentDash === "create") {
        return this.renderNewDashboard()
      } else {
        let dashboard = this.props.dashboards.find( d => d.name === this.state.currentDash)
        return (
          <Dashboard
            dashboard={dashboard}
            allDashboards={this.props.dashboards}
          />
        )
      }
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
