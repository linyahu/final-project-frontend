import React, { Component, Fragment } from 'react'

import Newsfeed from './Newsfeed'
import Equity from '../equity/Equity'

import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';

class EditDashboard extends Component {
  state = {
    currentDashboardEquities: [], // this is all the dashboard-equity joins that belong to this dashboard we're editing
    search: "",
    sector: "",
    searchResults: [],
    addedEquities: [], // just the IDS
    deletedEquities: [], // just the IDS
    dashboard: {},
    noResults: false,
  }

  /**********************************************
                EVENT / STATE FUNCTIONS
  **********************************************/
  deleteEquity = (ticker, id) => {
    if( window.confirm("are you sure you want to delete?")) {
      let currentIds = this.props.dashboardEquities.map(eq => eq.id)

      if (currentIds.includes(id)){ // if the current dashboard equities include this one
        // remove it from the dashboard and add it to the deleted equities array
        // those will be used to do FETCH DELETE requests
        this.setState( prevState => {
          return {
            dashboard: {...prevState.dashboard, equities: prevState.dashboard.equities.filter( e => e.symbol !== ticker )},
            deletedEquities: [...prevState.deletedEquities, id]
          }
        })
      } else {
        // otherwise, it'll be removed from the "added equities" array
        this.setState( prevState => {
          return {
            dashboard: {...prevState.dashboard, equities: prevState.dashboard.equities.filter( e => e.symbol !== ticker )},
            addedEquities: prevState.addedEquities.filter(i => i !== id)
          }
        })
      }
    }
  }

  addEquity = (equity) => {
    this.setState(prevState => {
      return {
        addedEquities: [...prevState.addedEquities, equity.id],
        dashboard: {...prevState.dashboard, equities: [...prevState.dashboard.equities, equity]}
      }
    })
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value })
  }

  handleNameChange = (e) => {
    let name = e.target.value.replace(/[^\w\s]/gi, '')
    this.setState( prevState => {
      return { dashboard: {...prevState.dashboard, name }}
    })
  }

  deleteNewsfeed = () => {
    if( window.confirm("are you sure you want to delete?")) {
      this.setState( prevState => {
        return { dashboard: {...prevState.dashboard, newsfeed: false} }
      })
    }
  }

  addNewsfeed = () => {
    this.setState( prevState => {
      return { dashboard: {...prevState.dashboard, newsfeed: true} }
    })
  }

  /**********************************************
                LIFECYCLE FUNCTIONS
  **********************************************/
  componentDidMount() {
    this.fetchDashboardEquities()
  }

  /**********************************************
                FETCH FUNCTIONS
  **********************************************/
  fetchDashboardEquities = () => {
    fetch("http://localhost:3000/api/v1/equity_dashboards")
    .then(res => res.json())
    .then(json => {
      let dashboard = this.props.dashboards.find(d => d.name === this.props.match.params.name)
      let currentDashboardEquities = json.filter( d => {
        if (!!dashboard) {
          return d.dashboard_id === dashboard.id
        }
      })
      this.setState({ dashboard, currentDashboardEquities })
    })
  }

  searchEquities = (e) => {
    e.preventDefault()
    fetch("http://localhost:3000/api/v1/equities")
    .then(res => res.json())
    .then(json => {
       let searchResults = json.filter( eq => eq.symbol.toLowerCase().includes(this.state.search) || eq.company_name.toLowerCase().includes(this.state.search) )
       let filteredResults = searchResults.filter( eq => {
         if (!!eq.sector) {
           return eq.sector === this.state.sector
         }
       })

       if (searchResults == "") {
         this.setState({ noResults: true })
       } else if (filteredResults == "" && this.state.sector != "") {
         this.setState({ searchResults: [], noResults: true })
       } else if (filteredResults != "") {
         this.setState({ searchResults: filteredResults, noResults: false })
       } else {
         this.setState({ searchResults: searchResults, noResults: false})
       }
    })
  }
  /**********************************************
                RENDER FUNCTIONS
  **********************************************/
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
              activeStyle={{ fontWeight: "bold", color: "rgba(192, 247, 244, 1)"}}
              to={`/dashboards/${dashboard.name}`}>{dashboard.name}</NavLink>
            )
          })
        }
        </div>
      )
    }
  }

  renderEditForm = () => {
    return (
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
          <input type="checkbox" value={this.state.dashboard.newsfeed} onChange={this.addNewsfeed} />
          <label>add newsfeed</label>
        </div>
      )
    }
  }

  renderCurrentDashboardEquities = () => {
    return (
      <div className="dashboard-equities grey-border">
      {
        this.state.dashboard.equities.map( equity => {
        return (
          <Equity
            key={equity.id}
            id={equity.id}
            ticker={equity.symbol}
            companyName={equity.company_name}
            showProfile={false}
            delete={this.deleteEquity}
          />
        )
      })}
      </div>
    )
  }

  renderSearchForm = () => {
    return (
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
    )
  }

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
               <h6>[ already added ]</h6>
             }
           </Fragment>
         )
       })
  }

  render() {
    console.log("%c now my props", "color: orange", this.props, "state", this.state)
    return (
      <div className="dash-container">
        { this.renderDashboardNav() }
        <div className="dashboard">
        {
          !!this.state.dashboard && this.state.dashboard.constructor === Object && Object.keys(this.state.dashboard).length !== 0?
          <Fragment>
            { this.renderEditForm() }
            {this.renderNewsfeed()}
            {this.renderCurrentDashboardEquities()}
            {this.renderSearchForm()}
          </Fragment>
          :
          null
        }

        </div>
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
