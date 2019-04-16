import React, { Component } from 'react'
// import { NavLink, Switch } from 'react-router-dom';

// import Equity from './Equity'
// import EquityProfile from './EquityProfile'
import Top from './Top'
import Search from './Search'

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
    this.fetchMostActive()
    this.fetchGainers()
    this.fetchLosers()
    this.fetchInFocus()
  }

  /**********************************************
                FETCH FUNCTIONS
  **********************************************/
  fetchMostActive() {
    fetch("https://api.iextrading.com/1.0/stock/market/list/mostactive")
    .then(res => res.json())
    .then(json => {
      this.setState({ mostactive: json })
    })
  }

  fetchGainers() {
    fetch("https://api.iextrading.com/1.0/stock/market/list/gainers")
    .then(res => res.json())
    .then(json => {
      this.setState({ gainers: json })
    })
  }

  fetchLosers() {
    fetch("https://api.iextrading.com/1.0/stock/market/list/losers")
    .then(res => res.json())
    .then(json => {
      this.setState({ losers: json })
    })
  }

  fetchInFocus() {
    fetch("https://api.iextrading.com/1.0/stock/market/list/infocus")
    .then(res => res.json())
    .then(json => {
      this.setState({ infocus: json })
    })
  }


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
      <div>
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
        to="/equities/infocus"> in focus </NavLink>

      </div>
    )
  }

  renderSearchBar = () => {
    return (
      <form onSubmit={this.handleSearch}>
        <button className="searchbar-btn">Q</button>
        <input
          type="text"
          className="searchbar"
          name="search"
          value={this.state.search}
          onChange={this.handleChange}
          placeholder="search ticker or company"
          />
      </form>
    )
  }

  render() {
    console.log("%c props in equity container", "color: pink", this.props);
    return (
      <div className="eq-container">
        { this.renderTop() }
        { this.renderSearchBar() }
        { this.renderEquityNavBar() }
        <div>
        {
          this.props.match.params.view === "search" ?
          <Search
            term={this.props.location.search.substring(2)}
          />
          :
          <Top
          equities={this.state[this.props.match.params.view]}
          title={this.props.match.params.view}
          />
        }
        </div>
      </div>
    )
  }

} // end of EquityContainer


function mapStateToProps(state) {
  return {
    search: state.search,
    user_id: state.user_id
  }
}

const HOC = connect(mapStateToProps)

export default HOC(EquityContainer);
