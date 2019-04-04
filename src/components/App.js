import React, { Component, Fragment } from 'react';

import DashboardContainer from './dashboard/DashboardContainer'

import { connect } from 'react-redux';
import { NavLink, Route, Switch } from 'react-router-dom';

import '../assets/App.css';


class App extends Component {

  showNavbar = () => {
    this.props.dispatch({ type: "TOGGLE_NAVBAR" })
  }


  /**********************************************
                RENDER FUNCTIONS
  **********************************************/
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
          <h4> Will have navbar here </h4>
          :
          null
        }
        <button onClick={this.showNavbar}>{this.props.navbar ? "hide nav" : "show nav"}</button>
        <h1>App Component</h1>
        <DashboardContainer />
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
