import React, { Component, Fragment } from 'react'

import { connect } from 'react-redux';

class CreateNewDashboard extends Component {
  state = {
    search: "",
    dashName: "",
    addNewsfeed: false,
    searchResults: [],
    addedEquities: [],
  }

  /**********************************************
                  EVENT FUNCTIONS
  **********************************************/
  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  toggleNewsfeed = (e) => {
    this.setState(prevState => {
      return { addNewsfeed: !prevState.addNewsfeed }
    })
  }

  addEquity = (equity) => {
    // console.log("adding this equity", equity);
    this.setState(prevState => {
      return { addedEquities: [...prevState.addedEquities, equity] }
    })
  }

  removeFromAddedEquities = (equity) => {
    this.setState(prevState => {
      return {
        addedEquities: prevState.addedEquities.filter( eq => eq.id !== equity.id)
      }
    })
  }

  /**********************************************
                  FETCH FUNCTIONS
  **********************************************/
  searchEquities = (e) => {
    e.preventDefault()
    fetch("http://localhost:3000/api/v1/equities")
    .then(res => res.json())
    .then(json => {
      // finding equities that match search
      // either ticker or company name includes search
      let searchResults = json.filter( eq => eq.symbol.toLowerCase().includes(this.state.search) || eq.company_name.toLowerCase().includes(this.state.search))
      // console.log("these are my search results", searchResults);
      this.setState({ searchResults })
    })
  }

  createNewDashboard = (e) => {
    e.preventDefault()

    let data = {
      user_id: this.props.user_id,
      name: this.state.dashName.replace(/[^\w\s]/gi, '').replace(/^\s+/g, '').replace(/\s+$/g, ''),
      newsfeed: this.state.addNewsfeed
    }

    // console.log("does this work, what is data?", data);
    fetch("http://localhost:3000/api/v1/dashboards", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accepts": "application/json"
      },
      body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then( dashboard => {
      this.createNewDashboardEquities(dashboard)

      // let newDashboards = [...this.props.]

      this.props.dispatch({ type: "SET_DASHBOARDS", payload: [...this.props.dashboards, dashboard] })
    })
  }

  createNewDashboardEquities = (dashboard) => {
    this.state.addedEquities.map( equity => {
      let data = {
        dashboard_id: dashboard.id,
        equity_id: equity.id
      }
      fetch("http://localhost:3000/api/v1/equity_dashboards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accepts": "application/json"
        },
        body: JSON.stringify(data)
      })
      .then(res => res.json())
      .then( json => {
        // console.log(json, this.state.addedEquities);
        if (json.equity_id === this.state.addedEquities[this.state.addedEquities.length - 1].id) {
          this.props.goToNewDashboard(dashboard.name, this.state.addedEquities)
        }
      })
    })
  }

  /**********************************************
                RENDER FUNCTIONS
  **********************************************/
  renderAddedEquities = () => {
    return (
      <Fragment>
        {
          this.state.addedEquities.map( equity => {
            return (
              <span key={equity.id}>
                <h5>{equity.symbol} - {equity.company_name}</h5>
                <button onClick={() => this.removeFromAddedEquities(equity)}>remove</button>
              </span>
            )
          })
        }
      </Fragment>
    )
  }

  renderSearchResults = () => {
    // if the search results already exist on a dashboard
    // won't have the ability to add the equity
    let currentIds = [this.state.addedEquities.map(eq => eq.id), this.props.dashboardEquities.map(eq => eq.id)].flat()

    return this.state.searchResults.map(equity => {
      return (
        <Fragment key={equity.id}>
          <h5>{equity.symbol} - {equity.company_name}</h5>
          {
            !currentIds.includes(equity.id) ?
            <button onClick={() => this.addEquity(equity)}>add</button>
            :
            <h6>[cannot add: already existing on another dashboard]</h6>
          }
        </Fragment>
      )
    })
  }

  render() {
    console.log("%c what is my current state", "color: green", this.state);
    // console.log("%c what are my props", "color: green", this.props);
    return (
      <div className="modal">
        <div className="modal-content">
          <button onClick={this.props.closeForm} className="close">X</button>
          <h4>create new dashboard</h4>

          <form onSubmit={this.createNewDashboard} className="new-dash">
            <input
              onChange={this.handleChange}
              type="text"
              name="dashName"
              value={this.state.dashName}
              placeholder="enter dashboard name"
            />
            <br />
            <br />
            <label>add newsfeed</label>
            <input
              onChange={this.toggleNewsfeed}
              type="checkbox"
              name="addNewsfeed"
              value={this.state.addNewsfeed}
            />
            <div>
              {
                this.state.addedEquities == "" ?
                <h5>search for equities</h5>
                :
                this.renderAddedEquities()
              }

            </div>
            <input type="submit" value="create dashboard" />
          </form>

          <form onSubmit={this.searchEquities}>
            <label>search for equities</label>
            <input
              onChange={this.handleChange}
              type="text"
              name="search"
              value={this.state.search}
              placeholder="type a ticker or company name" />
          </form>

          {
            this.state.searchResults != "" ?
            this.renderSearchResults()
            :
            null
          }

        </div>
      </div>
    )
  }
} // end of CreateNewDashboard Component

function mapStateToProps(state) {
  // console.log('%c mapStateToProps', 'color: yellow', state);
  // maps the state from the store to the props
  return {
    user_id: state.user_id,
    dashboards: state.dashboards,
    dashboardEquities: state.dashboardEquities
  }
}

const HOC = connect(mapStateToProps)

export default HOC(CreateNewDashboard)
