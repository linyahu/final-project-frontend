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
              FETCH FUNCTIONS
**********************************************/

  componentDidMount() {
    fetch("http://localhost:3000/api/v1/dashboards")
    .then(res => res.json())
    .then( json => {
      console.log(json);
    })
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
        <button onClick={this.showNavbar}>show nav</button>

        <h1>App Component</h1>
        <DashboardContainer />
      </Fragment>
    )
  }

  render() {
    console.log("app render", this.props);
    return (
      <div className="App">
        {
          !!this.props.user_id ?
          this.renderLoggedIn()
          :
          null
        }
      </div>
    );
  }
} // end of App Component


function mapStateToProps(state) {
  console.log('%c mapStateToProps', 'color: yellow', state);
  // maps the state from the store to the props
  return {
    navbar: state.navbar,
    user_id: state.user_id,
    dashboards: state.dashboards
  }
}

const HOC = connect(mapStateToProps)

export default HOC(App);
