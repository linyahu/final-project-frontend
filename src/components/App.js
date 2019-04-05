import React, { Component, Fragment } from 'react';

import Home from './Home'
import DashboardContainer from './dashboard/DashboardContainer'
import EquityContainer from './equity/EquityContainer'

import { connect } from 'react-redux';
import { Route, NavLink, Switch } from 'react-router-dom';

import '../assets/App.css';


class App extends Component {

  showNavbar = () => {
    this.props.dispatch({ type: "TOGGLE_NAVBAR" })
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
            <NavLink className="navlink" activeStyle={{ background: "rgba(92, 151, 191, 1)", color: "white"}} to="/dashboards">Dashboards</NavLink>
            <NavLink className="navlink" activeStyle={{ background: "rgba(92, 151, 191, 1)", color: "white"}} to="/equities">Equities</NavLink>
            <NavLink className="navlink" activeStyle={{ background: "rgba(92, 151, 191, 1)", color: "white"}} to="/portfolio">Portfolio</NavLink>
            <NavLink className="navlink" activeStyle={{ background: "rgba(92, 151, 191, 1)", color: "white"}} to="/home">Logout</NavLink>
          </Fragment>
          :
          <Fragment>
            <NavLink className="navlink" activeStyle={{ background: "rgba(92, 151, 191, 1)", color: "white"}} to="/home">Home</NavLink>
            <NavLink className="navlink" activeStyle={{ background: "rgba(92, 151, 191, 1)", color: "white"}} to="/login">Login</NavLink>
          </Fragment>
        }
      </nav>
    )
  }

  renderLandingPage() {
    return (
      <Fragment>
        <h1> This will be a landing page </h1>
      </Fragment>
    )
  }

  renderLoggedIn() {
    return (
      <Fragment>

        <button onClick={this.showNavbar}>{this.props.navbar ? "^" : "v"}</button>
        <h4>App Component</h4>

        <Switch>
          <Route exact path="/dashboards" render={() => <DashboardContainer />} />

          <Route exact path="/equities" render={() => <EquityContainer />} />
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
          this.renderLandingPage()
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
    dashboards: state.dashboards
  }
}

const HOC = connect(mapStateToProps)

export default HOC(App);
