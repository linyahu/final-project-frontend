import React, { Component, Fragment } from 'react';

import Home from './Home'
import Login from './Login'
import DashboardContainer from './dashboard/DashboardContainer'
// import Dashboard from './dashboard/Dashboard'
import EditDashboard from './dashboard/EditDashboard'
import EquityContainer from './equity/EquityContainer'
import PortfolioContainer from './portfolio/PortfolioContainer'
import CryptoContainer from './crypto/CryptoContainer'

import { connect } from 'react-redux';
import { Route, NavLink, Switch } from 'react-router-dom';

import '../assets/App.css';


class App extends Component {

  saveDashboard = (name) => {

    window.location.reload()
  }

  showNavbar = () => {
    this.props.dispatch({ type: "TOGGLE_NAVBAR" })
  }

  componentDidMount() {
    const jwt = localStorage.getItem('jwt')
    if (jwt){
      fetch("http://localhost:3000/api/v1/auto_login", {
        headers: {
          "Authorization": jwt
        }
      })
        .then(res => res.json())
        .then((response) => {
          if (response.errors) {
            alert(response.errors)
          } else {
            // debugger
            this.props.dispatch({ type: "SET_USER", payload: response.id })
          }
        })
    }
    this.fetchDashboards()
  }

  fetchDashboards() {
    fetch("http://localhost:3000/api/v1/dashboards")
    .then(res => res.json())
    .then( json => {
      let dashboards = json.filter( d => d.user_id === this.props.user_id)
      let equities = dashboards.map( d => d.equities ).flat()

      // console.log('%c in fetchDashboards', 'color: blue', dashboards, 'equities', equities);
      this.props.dispatch({ type: "SET_DASHBOARDS", payload: dashboards })
      this.props.dispatch({ type: "SET_DASHBOARD_EQUITIES", payload: equities })
    })
  }

  // we need to set the current user and the token
  setCurrentUser = (response) => {
    // debugger
    localStorage.setItem("jwt", response.jwt)
    this.props.dispatch({ type: "SET_USER", payload: response })
    // this.setState({
    //   currentUser: response
    // })
  }

  // this is just so all of our data is as up to date as possible now that we are
  // just keep state at the top level of our application in order to correctly update
  // we must have the state be updated properly
  // updateUser = (user) => {
  //   this.props.dispatch({ type: "SET_USER", payload: user })
  // }

  // we need to reset state and remove the current user and remove the token
  logout = () => {
    localStorage.removeItem("jwt")
    // this.setState({
    //   currentUser: null
    // }, () => { this.props.history.push("/login") })
    this.props.dispatch({ type: "SET_USER", payload: null })
  }


  /**********************************************
                RENDER FUNCTIONS
  **********************************************/
  renderNavbar() {
    // the portfolio & logout nav is not currently working
    // neither is the home & login
    return (
      <nav className="navbar">
        {
          !!this.props.user_id ?
          <Fragment>
            <NavLink
              className="navlink"
              activeStyle={{ background: "rgba(92, 151, 191, 1)", color: "white"}}
              to="/dashboards">DASHBOARDS</NavLink>
            <NavLink
              className="navlink"
              activeStyle={{ background: "rgba(92, 151, 191, 1)", color: "white"}}
              to="/equities">EQUITIES</NavLink>
            <NavLink
              className="navlink"
              activeStyle={{ background: "rgba(92, 151, 191, 1)", color: "white"}}
              to="/crypto">CRYPTO</NavLink>
            <NavLink
              className="navlink"
              activeStyle={{ background: "rgba(92, 151, 191, 1)", color: "white"}}
              to="/portfolio">PORTFOLIO</NavLink>
            <NavLink
              className="navlink"
              activeStyle={{ background: "rgba(92, 151, 191, 1)", color: "white"}}
              onClick={this.logout}
              to="/home">LOGOUT</NavLink>
          </Fragment>
          :
          <Fragment>
            <NavLink
              className="navlink"
              activeStyle={{ background: "rgba(92, 151, 191, 1)", color: "white"}}
              to="/home">Home</NavLink>
            <NavLink
              className="navlink"
              activeStyle={{ background: "rgba(92, 151, 191, 1)", color: "white"}}
              to="/login">Login</NavLink>
          </Fragment>
        }
      </nav>
    )
  }

  renderNotLoggedIn() {
    return (
      <Fragment>
        <h1> This will be a landing page </h1>
        <Switch>
          <Route exact path="/home" render={() => <Home />} />

          <Route path="/login/signup" component={props => <Login {...props} view="signup" setCurrentUser={this.setCurrentUser} />} />
          <Route path="/login" component={props => <Login {...props} setCurrentUser={this.setCurrentUser} />} />

        </Switch>
      </Fragment>
    )
  }

  renderLoggedIn() {
    return (
      <Fragment>
        <Switch>
          <Route exact path="/dashboards/:name/edit" component={ props => <EditDashboard {...props} saveDashboard={this.saveDashboard}/> } />
          <Route path="/dashboards/:name" component={DashboardContainer} />
          <Route path="/dashboards" component={DashboardContainer} />

          <Route path="/equities/:view" component={ props => <EquityContainer {...props}/>} />
          <Route path="/equities" component={ props => <EquityContainer {...props} view="top"/>} />

          <Route path="/portfolio" component={ props => <PortfolioContainer {...props}/>} />

          <Route path="/crypto" component={ props => <CryptoContainer {...props}/>} />

        </Switch>
      </Fragment>
    )
  }

  render() {
    return (
      <div className="App">
        {
          this.props.navbar
          ?
          this.renderNavbar()
          :
          null
        }

        {
          !!this.props.user_id ?
          this.renderLoggedIn()
          :
          this.renderNotLoggedIn()
        }
      </div>
    );
  }
} // end of App Component


function mapStateToProps(state) {
  // console.log('%c mapStateToProps', 'color: yellow', state);
  // maps the state from the store to the props
  return {
    navbar: state.navbar,
    user_id: state.user_id,
    dashboards: state.dashboards,
    dashboardEquities: state.dashboardEquities,
    portfolioEquities: state.portfolioEquities
  }
}

const HOC = connect(mapStateToProps)

export default HOC(App);
