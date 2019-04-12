import React, { Component, Fragment } from 'react'

import Dashboard from './Dashboard'
import CreateNewDashboard from './CreateNewDashboard'

import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';

class DashboardContainer extends Component {
  state = {
    // currentDash: "main",
    editDash: false,
    showNewForm: false,
  }

  /**********************************************
                  EVENT FUNCTIONS
  **********************************************/
  showForm = () => {
    this.setState({ showNewForm: true })
  }

  closeForm = () => {
    this.setState({ showNewForm: false })
  }

  goToNewlyCreatedDashboard = (name, equities) => {
    this.setState({ showNewForm: false })
    // this.props.dispatch({ type: "SET_DASHBOARD_EQUITIES", payload: [...this.props.dashboardEquities, equities] })
    this.props.history.push(`/dashboards/${name}`)
    window.location.reload()
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
      // console.log("do i have user id?", this.props.user_id);
      let dashboards = json.filter( d => d.user_id === this.props.user_id)
      let equities = dashboards.map( d => d.equities ).flat()

      // console.log('%c in fetchDashboards', 'color: blue', dashboards, 'equities', equities);
      this.props.dispatch({ type: "SET_DASHBOARDS", payload: dashboards })
      this.props.dispatch({ type: "SET_DASHBOARD_EQUITIES", payload: equities })
    })
  }

  /**********************************************
                RENDER FUNCTIONS
  **********************************************/
  renderNewForm = () => {
    return (
      <CreateNewDashboard
        closeForm={this.closeForm}
        goToNewDashboard={this.goToNewlyCreatedDashboard}
      />
    )
  }

  // creates the "navbar" of the different dashboards
  // maps through each of them and creates a little "tab" button
  renderDashboardNav = () => {
    if (!!this.props.dashboards) {
      return (
        <div className="navbar">
        {
          this.props.dashboards.map( dashboard => {
            return (
              <NavLink
              key={dashboard.id}
              className="navlink-dash"
              activeStyle={{ fontWeight: "bold", color: "rgba(192, 247, 244, 1)"}}
              to={`/dashboards/${dashboard.name}`}>{dashboard.name}</NavLink>
            )
          })
        }
        <button
          onClick={this.showForm}
          id="plus-btn"
          >+</button>
        </div>
      )
    }
  }

  renderDashboards = () => {

    if (!!this.props.match.params.name) {
      let dashboard = this.props.dashboards.find( d => d.name === this.props.match.params.name)
      // console.log("%c dashboard?", "color:pink", dashboard);
      return (
        <Fragment>
          {
            this.state.showNewForm ?
            this.renderNewForm()
            :
            null
          }

          <Dashboard
            equities={this.props.dashboardEquities}
            dashboard={dashboard}
            allDashboards={this.props.dashboards}
            edit={this.editDashboard}
          />
        </Fragment>
      )
    } else {
      this.props.history.push("/dashboards/main")
    }
  }


  render() {
    // console.log("%c dashboards", "color: blue", this.props.dashboards, "dashboard equities", this.props.dashboardEquities);
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
    dashboards: state.dashboards,
    dashboardEquities: state.dashboardEquities,
  }
}

const HOC = connect(mapStateToProps)

export default HOC(DashboardContainer);
