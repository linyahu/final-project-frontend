import React, { Component, Fragment } from 'react';

import Home from './Home'
import Login from './Login'
import DashboardContainer from './dashboard/DashboardContainer'
// import Dashboard from './dashboard/Dashboard'
import EditDashboard from './dashboard/EditDashboard'

import EquityContainer from './equity/EquityContainer'

import PortfolioContainer from './portfolio/PortfolioContainer'

import { connect } from 'react-redux';
import { Route, NavLink, Switch } from 'react-router-dom';

import '../assets/App.css';


class App extends Component {

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
            this.props.dispatch({ type: "SET_USER", payload: response.id })
            this.fetchPortfolioEquities()
            this.fetchDashboards()
          }
        })
    }


  }

  // we need to set the current user and the token
  setCurrentUser = (response) => {
    localStorage.setItem("jwt", response.jwt)
    this.props.dispatch({ type: "SET_USER", payload: response })
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


  fetchPortfolioEquities() {
    fetch("http://localhost:3000/api/v1/portfolios")
    .then(res => res.json())
    .then( json => {
      let portfolio = json.find(p => p.user_id === this.props.user_id)

      if (!!portfolio) {
        let equities = portfolio.subportfolios.map( s => s.equity )
        // console.log("app component did mount", portfolio, equities);

        this.props.dispatch({ type: "SET_PORTFOLIO", payload: portfolio })
        this.props.dispatch({ type: "SET_PORTFOLIO_EQUITIES", payload: equities })
      }
    })
  }

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
          <Route exact path="/dashboards/:name/edit" component={EditDashboard} />
          <Route path="/dashboards/:name" component={DashboardContainer} />
          <Route path="/dashboards" component={DashboardContainer} />

          <Route path="/equities/:view" component={ props => <EquityContainer {...props}/>} />
          <Route path="/equities" component={ props => <EquityContainer {...props} view="top"/>} />

          <Route path="/portfolio" component={ props => <PortfolioContainer {...props}/>} />

        </Switch>
      </Fragment>
    )
  }

  render() {
    // console.log("%c props in App", "color: orange", this.props);
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
    portfolio: state.portfolio,
    portfolioEquities: state.portfolioEquities,
  }
}

const HOC = connect(mapStateToProps)

export default HOC(App);
