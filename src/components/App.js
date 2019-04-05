import React, { Component, Fragment } from 'react';

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
    return (
      <nav className="navbar">
        <p><NavLink to="/dashboards">Dashboards</NavLink></p>
        <p><NavLink to="/equities">Equities</NavLink></p>
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
        {
          this.props.navbar
          ?
          this.renderNavbar()
          :
          null
        }
        <button onClick={this.showNavbar}>{this.props.navbar ? "^" : "v"}</button>
        <h4>App Component</h4>

        <Switch>
          <Route path="/dashboards" render={() => <DashboardContainer />} />
          <Route path="/equities" render={() => <EquityContainer />} />
        </Switch>

      </Fragment>
    )
  }

  render() {
    return (
      <div className="App">

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
