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
    console.log(e.target.value);
    let name = e.target.value.replace(/[^\w\s]/gi, '')

    this.setState( prevState => {
      // console.log(name);
      return { dashboard: {...prevState.dashboard, name } }
    })
  }

  handleChange = (e) => {
    // console.log(e.target.value);
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
    // let newEquities = this.state.dashboard.equities.filter( e => e.symbol !== ticker)
    // console.log("new equities", newEquities);
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
    console.log("clicked save button, will save dashboard", this.state);

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
    fetch("http://localhost:3000/api/v1/dashboards")
    .then(res => res.json() )
    .then(json => {
      // console.log("%c ***i fetched!", "color: green");
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
    fetch("http://localhost:3000/api/v1/equity_dashboards")
    .then(res => res.json() )
    .then(json => {
      let currentEquityDashoards = json.filter( a => a.dashboard_id === this.state.dashboard.id)
      console.log("%c what is happening here", "color: pink", currentEquityDashoards);
      this.setState({ currentEquityDashoards })
    })
  }

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

  fetchEditDashboard = (data) => {
    fetch(`http://localhost:3000/api/v1/dashboards/${this.state.dashboard.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Accepts": "application/json"
      },
      body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(json => {
      // console.log("edited the dashboard", json);
      this.props.history.push(`/dashboards/${json.name}`)
    })
  }

  fetchAddEquities = (equity) => {
    let data = {
      dashboard_id: this.state.dashboard.id,
      equity_id: equity.id
    }
    fetch(`http://localhost:3000/api/v1/equity_dashboards`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accepts": "application/json"
      },
      body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(json => {
      console.log("added equity to dashboard", json);
    })
  }

  fetchDeleteEquities = (id) => {
    let eqdId = this.state.currentEquityDashoards.find(a => a.equity_id === id)
    // console.log(eqdId);

    fetch(`http://localhost:3000/api/v1/equity_dashboards/${eqdId.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Accepts": "application/json"
      }
    })
  }

  fetchDeleteDashboard = () => {
    fetch(`http://localhost:3000/api/v1/dashboards/${this.state.dashboard.id}`, {
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

  renderDashboardForm = () => {
    // let dashboard = this.props.dashboards.find(d => d.name === this.props.match.params.name )
    // console.log("this is my dashboard", this.state.dashboard);
    return (
      <div className="dashboard">
        <div>

          <div>
            <button onClick={this.saveDashboard}>Save Dashboard</button>
            <button onClick={this.deleteDashboard}>Delete Dashboard</button>
          </div>

          <input
            type="text"
            onChange={this.handleNameChange}
            value={this.state.dashboard.name}
            className="edit-dashname"
            placeholder="dashboard name"
          />

        </div>

        { this.renderNewsfeed() }

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
              />
            )
          })
        :
          null
        }
        </div>

        <div className="search-form-container grey-border">
          <form onSubmit={this.searchEquities}>
            <label>filter sector </label>

            <select name="sector" onChange={this.handleChange}>
              <option value="">All</option>
              <option value="Technology">Technology</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Industrials">Industrials</option>
              <option value="Financial Services">Financial Services</option>
              <option value="Basic Materials">Basic Materials</option>
              <option value="Consumer Cyclical">Consumer Cyclical</option>
            </select>

            <br />

            <label>search for equities</label>
            <input
              onChange={this.handleChange}
              type="text"
              name="search"
              value={this.state.search}
              placeholder="type a ticker or company name" />
            <input type="submit" value="search" />
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

  renderNewsfeed = () => {
    if (this.state.dashboard.newsfeed) {
      return (
        <Newsfeed
          equities={this.state.dashboard.equities}
          delete={this.deleteNewsfeed}
        />
      )
    } else {
      return (
        <div>
          <input type="checkbox" value={this.state.dashboard.newsfeed} onChange={this.toggleNewsfeed} />
          <label>add newsfeed</label>
        </div>
      )
    }
  }

  renderDashboardNav = () => {
    if (!!this.props.dashboards) {
      return (
        <div className="navbar">
        {
          this.props.dashboards.map( dashboard => {
            return (
              <NavLink
              key={dashboard.id}
              className="navlink-dash"
              activeStyle={{ fontWeight: "bold"}}
              to={`/dashboards/${dashboard.name}`}>{dashboard.name}</NavLink>
            )
          })
        }
        {/*
        <button
          onClick={this.showForm}
          id="plus-btn"
          >+</button>
          */}
        </div>
      )
    }
  }

  render() {
    console.log("props in edit dashboard", this.props)
    return (
      <div className="dash-container">

        { this.renderDashboardNav() }
        { this.renderDashboardForm() }



        <div className="clearfix" />
      </div>
    )
  }
} // end of EditDashboard component

function mapStateToProps(state) {
  return {
    user_id: state.user_id,
    dashboards: state.dashboards,
    dashboardEquities: state.dashboardEquities
  }
}

const HOC = connect(mapStateToProps)

export default HOC(EditDashboard);
