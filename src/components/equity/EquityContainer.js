import React, { Component, Fragment } from 'react'

import Top from './Top'
import Search from './Search'
import Sector from './Sector'

import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';

class EquityContainer extends Component {
  // this container is going to contain the equity list
  // on the equities page
  state = {
    search: "",
    equities: [],
    gainers: [],
    losers: [],
    mostactive: [],
    infocus: []
  }

  /**********************************************
            EVENT FUNCTIONS
  **********************************************/
  // showProfile = () => {
  //   this.props.history.push(`/equities/search?=${this.props.companyName.toLowerCase()}`)
  //   this.props.dispatch({ type: "SEARCH_EQUITY", payload: this.props.companyName.toLowerCase() })
  // }

  /**********************************************
            STATE-CHANGE FUNCTIONS
  **********************************************/
  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value.toLowerCase() })
  }

  handleSearch = (e) => {
    e.preventDefault()
    //old method
    // with redux doesn't really work...
    // this.props.dispatch({ type: "SEARCH_EQUITY", payload: this.state.search })
    this.props.history.push(`/equities/search?=${this.state.search}`)
    window.location.reload()
  }

  /**********************************************
                LIFECYCLE FUNCTIONS
  **********************************************/
  componentDidMount() {
    this.props.hideNavBar()

    this.fetchMostActive()
    this.fetchGainers()
    this.fetchLosers()
    // this.fetchInFocus() // actually iex volume
  }

  /**********************************************
                FETCH FUNCTIONS
  **********************************************/
  fetchMostActive() {
    fetch(`https://cloud.iexapis.com/stable/stock/market/list/mostactive?token=${this.props.api}`)
    .then(res => res.json())
    .then(json => {
      this.setState({ mostactive: json })
    })
  }

  fetchGainers() {
    fetch(`https://cloud.iexapis.com/stable/stock/market/list/gainers?token=${this.props.api}`)
    .then(res => res.json())
    .then(json => {
      this.setState({ gainers: json })
    })
  }

  fetchLosers() {
    fetch(`https://cloud.iexapis.com/stable/stock/market/list/losers?token=${this.props.api}`)
    .then(res => res.json())
    .then(json => {
      this.setState({ losers: json })
    })
  }

  // fetchInFocus() {
  //   fetch(`https://cloud.iexapis.com/stable/stock/market/list/iexvolume?token=${this.props.api}`)
  //   .then(res => res.json())
  //   .then(json => {
  //     this.setState({ infocus: json })
  //   })
  // }


  /**********************************************
                RENDER FUNCTIONS
  **********************************************/
  renderTop = () => {
    if (this.props.view === "top") {
      this.props.history.push("/equities/gainers")
    }
  }

  renderEquityNavBar = () => {
    return (
      <div className="top-nav">
        <NavLink
        className="navlink-dash"
        activeStyle={{ fontWeight: "bold", color: "rgba(192, 247, 244, 1)"}}
        to="/equities/gainers"> top gainers </NavLink>

        <NavLink
        className="navlink-dash"
        activeStyle={{ fontWeight: "bold", color: "rgba(192, 247, 244, 1)"}}
        to="/equities/losers"> top losers </NavLink>

        <NavLink
        className="navlink-dash"
        activeStyle={{ fontWeight: "bold", color: "rgba(192, 247, 244, 1)"}}
        to="/equities/mostactive"> most active </NavLink>

        <NavLink
        className="navlink-dash"
        activeStyle={{ fontWeight: "bold", color: "rgba(192, 247, 244, 1)"}}
        to="/equities/sectors"> sectors </NavLink>

        <div className="searchform">
          <form onSubmit={this.handleSearch}>
            <input
              type="text"
              className="search"
              name="search"
              value={this.state.search}
              onChange={this.handleChange}
              placeholder="search ticker or company"
              />
          </form>
        </div>
      </div>
    )
  }

  render() {
    return (
      <div className="main-container">
        { this.renderEquityNavBar() }
        { this.renderTop() }

        <div>
        {
          this.props.match.params.view === "search" ?
          <Search
            term={this.props.location.search.substring(2)}
          />
          :
          <Fragment>
          {
            this.props.match.params.view === "sectors" ?
            <Sector />
            :
            <Top
            equities={this.state[this.props.match.params.view]}
            title={this.props.match.params.view}
            />
          }
          </Fragment>
        }
        </div>
      </div>
    )
  }

} // end of EquityContainer


function mapStateToProps(state) {
  return {
    search: state.search,
    user_id: state.user_id,
    api: state.api,
  }
}

const HOC = connect(mapStateToProps)

export default HOC(EquityContainer);
