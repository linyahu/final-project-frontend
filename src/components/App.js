import React, { Component, Fragment } from 'react';

import Home from './Home'
import Login from './Login'
import Account from './Account'

import DashboardContainer from './dashboard/DashboardContainer'
// import Dashboard from './dashboard/Dashboard'
import EditDashboard from './dashboard/EditDashboard'

import EquityContainer from './equity/EquityContainer'

import PortfolioContainer from './portfolio/PortfolioContainer'
// import PortfolioDetailsContainer from './portfolio/PortfolioDetailsContainer'


import { connect } from 'react-redux';
import { Route, NavLink, Switch } from 'react-router-dom';

import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import '../assets/App.css';


class App extends Component {

  showNavbar = () => {
    let test = document.querySelector('#mySideNav')
    test.style.width = "200px"
  }

  hideNavBar = () => {
    let test = document.querySelector('#mySideNav')
    test.style.width = "0"
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
            this.fetchPortfolioEquities(response.id)
            // this.fetchAccountData(response.id)
            this.fetchDashboards()
          }
        })
    }


  }

  // we need to set the current user and the token
  setCurrentUser = (response) => {
    localStorage.setItem("jwt", response.jwt)
    this.props.dispatch({ type: "SET_USER", payload: response })

    this.fetchPortfolioEquities(response)
    // this.fetchAccountData(response)
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
    this.props.dispatch({ type: "SET_PORTFOLIO", payload: {} })
    this.props.dispatch({ type: "SET_PORTFOLIO_EQUITIES", payload: [] })
  }


  fetchPortfolioEquities(id) {
    fetch("http://localhost:3000/api/v1/portfolios")
    .then(res => res.json())
    .then( json => {
      let portfolio = json.find(p => p.user_id === id)

      if (!!portfolio) {
        let equities = portfolio.subportfolios.map( s => s.equity )

        this.props.dispatch({ type: "SET_PORTFOLIO", payload: portfolio })
        this.props.dispatch({ type: "SET_PORTFOLIO_EQUITIES", payload: equities })
        this.props.dispatch({ type: "SET_ACCOUNT_BALANCE", payload: portfolio.account_balance })
      }
    })
  }

  // fetchAccountData(id) {
  //   fetch("http://localhost:3000/api/v1/users")
  //   .then(res => res.json())
  //   .then(json => {
  //     let user = json.find( a => a.id === id)
  //     let accountBalance = user.account_balance
  //     this.props.dispatch({ type: "SET_ACCOUNT_BALANCE", payload: accountBalance })
  //   })
  // }

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
    return (
      <nav>
        {
          !!this.props.user_id ?
          <div id="mySideNav" className="sidenav">
            <button className="closebtn" onClick={this.hideNavBar}>&#9664;</button>
            <div className="nav">
                <NavLink className="navlink" activeStyle={{ color: "white"}}
                  to="/dashboards">DASHBOARDS</NavLink>

                <NavLink className="navlink" activeStyle={{ color: "white"}}
                  to="/equities">EQUITIES</NavLink>

                <NavLink className="navlink" activeStyle={{ color: "white"}}
                  to="/portfolio">PORTFOLIO</NavLink>

                <NavLink className="navlink" activeStyle={{ color: "white"}}
                  to="/account">ACCOUNT</NavLink>

                <NavLink className="navlink" activeStyle={{ color: "white"}}
                  onClick={this.logout}
                  to="/home">LOGOUT</NavLink>
            </div>
          </div>
          :
          <Fragment>
            <NavLink
              className="navlink"
              activeStyle={{ color: "white"}}
              to="/home">Home</NavLink>
            <NavLink
              className="navlink"
              activeStyle={{ color: "white"}}
              to="/equities">EQUITIES</NavLink>
            <NavLink
              className="navlink"
              activeStyle={{ color: "white"}}
              to="/login">Login</NavLink>
          </Fragment>
        }
      </nav>
    )
  }

  renderNotLoggedIn() {
    return (
      <Fragment>
        <Switch>
          <Route exact path="/home" render={() => <Home />} />

          <Route path="/login/signup" component={props => <Login {...props} view="signup" setCurrentUser={this.setCurrentUser} />} />
          <Route path="/login" component={props => <Login {...props} setCurrentUser={this.setCurrentUser} />} />

          <Route path="/equities/:view" component={ props => <EquityContainer {...props}/>} />
          <Route path="/equities" component={ props => <EquityContainer {...props} view="top"/>} />

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

          <Route
            path="/account"
            component={ props => <Account {...props} />} />

        </Switch>
      </Fragment>
    )
  }

  render() {
    return (
      <div className="App">
          <button className="closed-nav" onClick={this.showNavbar}>{"▶"}</button>
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
    accountBalance: state.accountBalance
  }
}

const HOC = connect(mapStateToProps)

export default HOC(App);
