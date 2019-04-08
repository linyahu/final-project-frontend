import React, { Component, Fragment } from 'react'

import Dashboard from './Dashboard'

import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';

class DashboardContainer extends Component {
  state = {
    // currentDash: "main",
    editDash: false,
    search: "",
    dashName: "",
    addNewsfeed: false,
    newEquities: [],
  }

  /**********************************************
                  EVENT FUNCTIONS
  **********************************************/
  editDashboard = () => {
    console.log("gonna edit this dashboard");
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  /**********************************************
              CHANGE STATE FUNCTIONS
  **********************************************/


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
      let dashboards = json.filter( d => d.user_id === this.props.user_id)
      // console.log('%c in fetchDashboards', 'color: blue', dashboards);
      this.props.dispatch({ type: "SET_DASHBOARDS", payload: dashboards})
    })
  }

  /**********************************************
                RENDER FUNCTIONS
  **********************************************/
  renderNewDashboard = () => {
    return (
      <div className="new-dash">
        <form>
          <input
            onChange={this.handleChange}
            type="text"
            name="dashName"
            value={this.state.dashName}
            placeholder="enter dashboard name"
          />
          <br />
          <div className="droppable">
            <h4>this elemet will be a blank dashboard to drag elements to </h4>
          </div>
          <button>save</button>

        </form>

        <div className="draggable">
          <div className="newsfeed">
            <h4> newsfeed component </h4>
          </div>

          <form>
            <label>search for equities</label>
            <input
              onChange={this.handleChange}
              type="text"
              name="search"
              value={this.state.search}
              placeholder="type a ticker or company name" />
          </form>

        </div>

      </div>
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
              className="navlink-dash"
              activeStyle={{ fontWeight: "bold"}}
              to={`/dashboards/${dashboard.name}`}>{dashboard.name}</NavLink>
            )
          })
        }
        <NavLink
        id="plus-btn"
        activeStyle={{ background: "rgba(0,153,153,0.2)", color: "white"}}
        to="/dashboards/new">+</NavLink>
        </div>
      )
    }
  }

  renderDashboards = () => {
    // console.log("props.match?", this.props.match);
    if (!!this.props.match.params.name) {
      if (this.props.match.params.name === "new") {
        return this.renderNewDashboard()
      } else {
        let dashboard = this.props.dashboards.find( d => d.name === this.props.match.params.name)
        // debugger
        // console.log("my dashboard!", dashboard);
        return (
          <Dashboard
            dashboard={dashboard}
            allDashboards={this.props.dashboards}
            edit={this.editDashboard}
          />
        )
      }
    } else {
      this.props.history.push("/dashboards/main")
    }
  }


  render() {

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
    dashboards: state.dashboards
  }
}

const HOC = connect(mapStateToProps)

export default HOC(DashboardContainer);

// OLD RENDER DASHBOARD NAV
// if (!!this.props.dashboards) {
//   return (
//     <div className="nav-dash">
//     {
//       this.props.dashboards.map( dashboard => {
//         return (
//           <button onClick={this.changeDashboard} value={dashboard.name}>{dashboard.name}</button>
//         )
//       })
//     }
//     <button id="plus-btn" onClick={this.changeDashboard} value="create">+</button>
//     </div>
//   )
// }
