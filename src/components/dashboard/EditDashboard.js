import React, { Component, Fragment } from 'react'

import Newsfeed from './Newsfeed'
import Equity from '../equity/Equity'

import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';

class EditDashboard extends Component {
  state = {
    dashboard: {},
    search: "",
    sector: "",
    noResults: false,
    searchResults: [],
    addedEquities: [],
    removedEquityIds: [],
    currentEquityDashoards: [], // the equity_dashboard join
  }

  /**********************************************
                EVENT FUNCTIONS
  **********************************************/
  toggleNewsfeed = () => {
    this.setState( prevState => {
      return { dashboard: {...prevState.dashboard, newsfeed: !prevState.dashboard.newsfeed }}
    })
  }

  handleNameChange = (e) => {
    let name = e.target.value.replace(/[^\w\s]/gi, '')

    this.setState( prevState => {
      return { dashboard: {...prevState.dashboard, name } }
    })
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value })
  }

  deleteNewsfeed = () => {
    if( window.confirm("are you sure you want to delete?")) {
      this.setState( prevState => {
        return { dashboard: {...prevState.dashboard, newsfeed: false} }
      })
    }
  }

  deleteEquity = (ticker, id) => {
    if( window.confirm("are you sure you want to delete?")) {
      let currentIds = this.props.dashboardEquities.map(eq => eq.id)
      if (currentIds.includes(id)){
        this.setState( prevState => {
          return {
            dashboard: {...prevState.dashboard, equities: prevState.dashboard.equities.filter( e => e.symbol !== ticker )},
            addedEquities: prevState.addedEquities.filter(e => e.id !== id),
            removedEquityIds: [...prevState.removedEquityIds, id]
          }
        })
      } else {
        this.setState( prevState => {
          return {
            dashboard: {...prevState.dashboard, equities: prevState.dashboard.equities.filter( e => e.symbol !== ticker )},
            addedEquities: prevState.addedEquities.filter(e => e.id !== id)
          }
        })
      }
    }
  }

  addEquity = (equity) => {
    this.setState(prevState => {
      return {
        addedEquities: [...prevState.addedEquities, equity],
        dashboard: {...prevState.dashboard, equities: [...prevState.dashboard.equities, equity]}
      }
    })
  }

  saveDashboard = () => {

    let data = {
      name: this.state.dashboard.name.replace(/^\s+/g, '').replace(/\s+$/g, ''),
      newsfeed: this.state.dashboard.newsfeed
    }

    this.fetchEditDashboard(data)

    if (this.state.addedEquities != "") {
      this.state.addedEquities.map( equity => {
        this.fetchAddEquities(equity)
      })
    }

    if (this.state.removedEquityIds != "") {
      this.state.removedEquityIds.map( id => {
        this.fetchDeleteEquities(id)
      })
    }
  }

  deleteDashboard = () => {
    if ( window.confirm("are you sure you want to delete this dashboard?")) {
      this.fetchDeleteDashboard()
    }
  }


  /**********************************************
                LIFECYCLE FUNCTIONS
  **********************************************/
  componentDidMount() {
    if (this.props.dashboards == "") {
      this.fetchDashboards()
    } else {
      let dashboard = this.props.dashboards.find(d => d.name === this.props.match.params.name )
      this.setState({ dashboard })
      this.fetchEquityDashboards()
    }

  }

  /**********************************************
                FETCH FUNCTIONS
  **********************************************/
  fetchDashboards() {
    fetch(`${this.props.url}/api/v1/dashboards`)
    .then(res => res.json() )
    .then(json => {

      let dashboards = json.filter( d => d.user_id === this.props.user_id)
      let equities = dashboards.map( d => d.equities ).flat()
      let dashboard = dashboards.find(d => d.name === this.props.match.params.name )

      this.props.dispatch({ type: "SET_DASHBOARDS", payload: dashboards })
      this.props.dispatch({ type: "SET_DASHBOARD_EQUITIES", payload: equities })

      this.setState({ dashboard })

      this.fetchEquityDashboards()
    })
  }

  fetchEquityDashboards() {
    fetch(`${this.props.url}/api/v1/equity_dashboards`)
    .then(res => res.json() )
    .then(json => {
      let currentEquityDashoards = json.filter( a => a.dashboard_id === this.state.dashboard.id)
      this.setState({ currentEquityDashoards })
    })
  }

  searchEquities = (e) => {
    e.preventDefault()

    fetch(`${this.props.url}/api/v1/equities`)
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

  fetchEditDashboard = (data) => {
    fetch(`${this.props.url}/api/v1/dashboards/${this.state.dashboard.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Accepts": "application/json"
      },
      body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(json => {
      this.props.history.push(`/dashboards/${json.name}`)
    })
  }

  fetchAddEquities = (equity) => {
    let data = {
      dashboard_id: this.state.dashboard.id,
      equity_id: equity.id
    }
    fetch(`${this.props.url}/api/v1/equity_dashboards`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accepts": "application/json"
      },
      body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(json => {
      // console.log("added equity to dashboard", json);
    })
  }

  fetchDeleteEquities = (id) => {
    let eqdId = this.state.currentEquityDashoards.find(a => a.equity_id === id)

    fetch(`${this.props.url}/api/v1/equity_dashboards/${eqdId.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Accepts": "application/json"
      }
    })
  }

  fetchDeleteDashboard = () => {
    fetch(`${this.props.url}/api/v1/dashboards/${this.state.dashboard.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Accepts": "application/json"
      }
    })
    .then( res => console.log(res))
    .then( () => {
      this.props.history.push("/dashboards/main")
    })
  }

  /**********************************************
                RENDER FUNCTIONS
  **********************************************/
  renderSearchResults = () => {
    let currentIds = [this.state.addedEquities.map(eq => eq.id), this.props.dashboardEquities.map(eq => eq.id)].flat()
    return this.state.searchResults.map(equity => {
      return (
        <div className="search-result" key={equity.id}>
          {
            !currentIds.includes(equity.id) ?
            <span className="available" onClick={() => this.addEquity(equity)}>{equity.symbol} - {equity.company_name}</span>
            :
            <span className="unavailable">{equity.symbol} - {equity.company_name}</span>
          }
        </div>
      )
    })
  }

  renderSearchForm = () => {
    return (
      <div className="search-form-container grey-border">
        <div>
          <button className="simple-btn" onClick={this.saveDashboard}>Save Dashboard</button>
          <button className="simple-btn" onClick={this.deleteDashboard}>Delete Dashboard</button>
        </div>

        <div className="edit-dashboard">
          <br />
          <label> edit dashboard name </label>
          <input
            type="text"
            onChange={this.handleNameChange}
            value={this.state.dashboard.name}
            className="edit-dashname"
            placeholder="dashboard name"
          />
          {
            this.state.dashboard.newsfeed ?
            null
            :
            <div>
              <input type="checkbox" value={this.state.dashboard.newsfeed} onChange={this.toggleNewsfeed} />
              <label>add newsfeed</label>
            </div>
          }

        </div>

        <div className="search-form">

        <div>search for equities to add</div>

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

          <input
            className="input-field"
            onChange={this.handleChange}
            type="text"
            name="search"
            value={this.state.search}
            placeholder="type a ticker or company name" />
            <div>
              <input className="search-btn" type="submit" value="search" />
            </div>
        </form>

        {
          this.state.searchResults != "" ?
          this.renderSearchResults()
          :
          null
        }

        { this.state.noResults ? <h5> no results found </h5> : null }
        </div>

      </div>
    )
  }

  renderDashboardForm = () => {
    // let dashboard = this.props.dashboards.find(d => d.name === this.props.match.params.name )

    return (
      <div className="inner-container">
        { this.renderNewsfeed() }
        {
          this.state.dashboard.newsfeed ?
          <div className="dashboard-equities-edit grey-border">
          {
            !!this.state.dashboard.equities ?
            this.state.dashboard.equities.map( equity => {
              return (
                <Equity
                  key={equity.id}
                  ticker={equity.symbol}
                  companyName={equity.company_name}
                  delete={this.deleteEquity}
                  id={equity.id}
                  class="sm-eq-edit"
                />
              )
            })
          :
            null
          }
          </div>
          :
          <div className="dashboard-equities grey-border">
          {
            !!this.state.dashboard.equities ?
            this.state.dashboard.equities.map( equity => {
              return (
                <Equity
                  key={equity.id}
                  ticker={equity.symbol}
                  companyName={equity.company_name}
                  delete={this.deleteEquity}
                  id={equity.id}
                  class="lg-eq-edit"
                />
              )
            })
          :
            null
          }
          </div>
        }

        { this.renderSearchForm() }


      </div>
    )
  }

  renderNewsfeed = () => {
    if (this.state.dashboard.newsfeed) {
      return (
        <Newsfeed
          equities={this.state.dashboard.equities}
          delete={this.deleteNewsfeed}
          class="newsfeed grey-border"
        />
      )
    }
  }

  renderDashboardNav = () => {
    if (!!this.props.dashboards) {
      return (
        <div className="top-nav">
        {
          this.props.dashboards.map( dashboard => {
            return (
              <NavLink
              key={dashboard.id}
              className="top-nav-link"
              activeStyle={{ fontWeight: "bold", color: "rgba(192, 247, 244, 1)"}}
              to={`/dashboards/${dashboard.name}`}>{dashboard.name}</NavLink>
            )
          })
        }
        </div>
      )
    }
  }

  render() {

    return (
      <div className="main-container">
        { this.renderDashboardNav() }
        { this.renderDashboardForm() }
      </div>
    )
  }
} // end of EditDashboard component

function mapStateToProps(state) {
  return {
    user_id: state.user_id,
    dashboards: state.dashboards,
    dashboardEquities: state.dashboardEquities,
    url: state.url,
  }
}

const HOC = connect(mapStateToProps)

export default HOC(EditDashboard);
