import React, { Component, Fragment } from 'react'

import { connect } from 'react-redux';

class CreateNewDashboard extends Component {
  state = {
    search: "",
    noResults: false,
    sector: "",
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
      let searchResults = json.filter( eq => eq.symbol.toLowerCase().includes(this.state.search) || eq.company_name.toLowerCase().includes(this.state.search) )

      if (this.state.sector !== "") {
        let filteredResults = searchResults.filter( eq => {
          if (!!eq.sector) {
            return eq.sector === this.state.sector
          }
        })
        if (filteredResults == "") {
          this.setState({ searchResults: [], noResults: true })
        } else {
          this.setState({ searchResults: filteredResults, noResults: false })
        }

      } else {
        if (searchResults == "") {
          this.setState({ searchResults: [], noResults: true })
        } else {
          this.setState({ searchResults, noResults: false })
        }

      }

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
        { this.state.addedEquities.map( equity => {
            return (
              <div className="modal-equity-block" onClick={() => this.removeFromAddedEquities(equity)} >
                <h5>{equity.symbol} - {equity.company_name}</h5>
              </div>
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
          <Fragment>
          {
            !currentIds.includes(equity.id) ?
            <div onClick={() => this.addEquity(equity)} className="modal-equity-block" key={equity.id}>
              <h5>{equity.symbol} - {equity.company_name}</h5>
            </div>
            :
            <div className="modal-equity-block-added" key={equity.id}>
              <h5>{equity.symbol} - {equity.company_name}</h5>
            </div>
          }
          </Fragment>
        )
      })

  }

  render() {
    return (
      <div className="modal">
        <div className="modal-content">
          <button onClick={this.props.closeForm} className="close">X</button>

          <div className="modal-create-new">
            <form onSubmit={this.createNewDashboard} className="new-dash">
              <label>enter dashboard name</label>
              <input
                className="light-input"
                onChange={this.handleChange}
                type="text"
                name="dashName"
                value={this.state.dashName}
              />
              <br />
              <span>add newsfeed</span>
              <input
                onChange={this.toggleNewsfeed}
                type="checkbox"
                name="addNewsfeed"
                value={this.state.addNewsfeed}
              />



            <div className="modal-new-equities">
              {
                this.state.addedEquities == "" ?
                <Fragment>
                  <br />
                  <br />
                  <br />
                  <br />
                  <br />
                  <br />
                  <p> search for equities on the right  </p>
                  <p> by entering a ticker or company name. </p>
                  <p> click on the equity to add or remove </p>
                  <p> from your dashboard </p>
                </Fragment>
                :
                this.renderAddedEquities()
              }
            </div>

            <input className="search-btn" type="submit" value="create dashboard" />
          </form>
          </div>

          <div className="modal-search">
          <form onSubmit={this.searchEquities}>

            <label>filter sector </label>

            <select name="sector" onChange={this.handleChange}>
              <option value="">All</option>
              <option value="Technology">Technology</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Energy">Energy</option>
              <option value="Industrials">Industrials</option>
              <option value="Financial Services">Financial Services</option>
              <option value="Basic Materials">Basic Materials</option>
              <option value="Consumer Cyclical">Consumer Cyclical</option>
              <option value="Consumer Defensive">Consumer Defensive</option>
              <option value="Real Estate">Real Estate</option>
            </select>
            <br />
            <label>search for equities</label>
            <input
              className="light-input"
              onChange={this.handleChange}
              type="text"
              name="search"
              value={this.state.search}
            />
            <br />
            <input className="search-btn" type="submit" value="search" />
          </form>

            <div className="modal-results">
            { this.renderSearchResults() }
            { this.state.noResults ? <h5> no results </h5> : null }
            </div>
          </div>
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
