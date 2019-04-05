import React, { Component, Fragment } from 'react';

import DashboardContainer from './dashboard/DashboardContainer'
import EquityContainer from './equity/EquityContainer'

import { connect } from 'react-redux';
import { BrowserRouter as Router, Route, Link} from 'react-router-dom'
import { NavLink, Switch } from 'react-router-dom';

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
        <Link to="/dashboards">Dashboards</Link>
        <Link to="/equities">Equities</Link>
        <Link to="/profile">Profile</Link>
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
        <button onClick={this.showNavbar}>{this.props.navbar ? "hide nav" : "show nav"}</button>
        <h4>App Component</h4>

        <Route path="/dashboards" component={() => <DashboardContainer />} />
        <Route path="/equities" component={() => <EquityContainer />} />

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
