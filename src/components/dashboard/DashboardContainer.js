import React, { Component, Fragment } from 'react'

import Dashboard from './Dashboard'
import CreateNewDashboard from './CreateNewDashboard'

import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';

class DashboardContainer extends Component {
  state = {
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
    this.props.history.push(`/dashboards/${name}`)
    window.location.reload()
  }

  /**********************************************
                LIFECYCLE FUNCTIONS
  **********************************************/
  componentDidMount() {
    this.props.hideNavBar()
    this.fetchDashboards()
  }

  /**********************************************
                FETCH FUNCTIONS
  **********************************************/
  // fetch dashboards that belong to the user
  // // pass it up through dispatch
  fetchDashboards() {
    fetch(`${this.props.url}/api/v1/dashboards`)
    .then(res => res.json())
    .then( json => {
      let dashboards = json.filter( d => d.user_id === this.props.user_id)
      let equities = dashboards.map( d => d.equities ).flat()

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
        <div className="top-nav">
        {
          this.props.dashboards.map( dashboard => {
            return (
              <NavLink
              key={dashboard.id}
              className="top-nav-link"
              activeStyle={{ fontWeight: "bold", color: "rgba(192, 247, 244, 1)"}}
              to={`/dashboards/${dashboard.name}`}>{dashboard.name}</NavLink>
            )
          })
        }
        {
          this.props.match.params.name !== "main" ?
          <div className="edit-btn">
            <NavLink
            className="edit-btn"
            activeStyle={{ fontWeight: "bold"}}
            to={`/dashboards/${this.props.match.params.name}/edit`}> edit </NavLink>
          </div>
          :
          null
        }
          <button onClick={this.showForm} id="plus-btn">+</button>
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
            portfolio={this.props.portfolio}
            portfolioEquities={this.props.portfolioEquities}
          />
        </Fragment>
      )
    } else {
      this.props.history.push("/dashboards/main")
    }
  }

  renderNewUserPopup() {
    return (
      <div className="modal">
        <div className="modal-content-sm">
          <h3> Welcome to Stock Overflow! </h3>
          <br />
          <span>To create a new dashboard, click on the "Create New Dashboard"
          button below. Explore different equities by clicking on the "Explore Equities"
          button.</span>
          <br />
          <br />
          <br />
          <button onClick={this.showForm} className="new-user-btn">Create New Dashboard</button>
          <NavLink className="new-user-btn" to="/equities">Explore Equities</NavLink>
        </div>
      </div>
    )
  }


  render() {
    return (
      <div className="main-container">
        {this.renderDashboardNav()}
        {this.renderDashboards()}
        {
          this.props.dashboardEquities.length === 0 && this.state.showNewForm === false ?
          this.renderNewUserPopup()
          :
          null
        }
      </div>
    )
  }
} // end of DashboardContainer component


function mapStateToProps(state) {
  return {
    user_id: state.user_id,
    dashboards: state.dashboards,
    dashboardEquities: state.dashboardEquities,
    portfolioEquities: state.portfolioEquities,
    portfolio: state.portfolio,
    url: state.url
  }
}

const HOC = connect(mapStateToProps)

export default HOC(DashboardContainer);
