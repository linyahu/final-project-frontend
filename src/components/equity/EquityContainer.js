import React, { Component, Fragment } from 'react'
// import { NavLink, Switch } from 'react-router-dom';

// import Equity from './Equity'
import EquityProfile from './EquityProfile'
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
    // topEquities: [],
    gainers: [],
    losers: [],
    mostactive: [],
    infocus: [],
    showDropdown: false,
  }

  /**********************************************
          STATE-CHANGE / EVENT FUNCTIONS
  **********************************************/
  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value.toLowerCase() })
  }

  handleSearch = (e) => {
    e.preventDefault()
    this.props.history.push(`/equities/search?=${this.state.search}`)
    window.location.reload()
  }

  showSectorDropdown = () => {
    this.setState( prevState => {
      return { showDropdown: !prevState.showDropdown}
    })
  }

  addEquityToDashboard = () => {
    this.props.history.push("dashboards/main")
  }

  /**********************************************
                LIFECYCLE FUNCTIONS
  **********************************************/
  componentDidMount() {
    console.log("%c does this hit?", "color: orange");
    // this.props.history.push("/equities/top")
    this.fetchMostActive()
    this.fetchGainers()
    this.fetchLosers()
    this.fetchInFocus()
    // console.log("%c does this go every time?", "color: yellow");
    // this.fetchTop()
  }

  /**********************************************
                FETCH FUNCTIONS
  **********************************************/
  fetchEquitiesFromDatabase(search) {
    fetch("http://localhost:3000/api/v1/equities")
    .then(res => res.json())
    .then(json => {
      // console.log(json);
      // finding equities that match search
      // either ticker or company name includes search
      let equities = json.filter( eq => eq.symbol.toLowerCase().includes(search) || eq.company_name.toLowerCase().includes(search))
      console.log("%c after fetching", "color: blue", equities);
      // this.setState({ equities })
    })
  }


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
  renderSearch = () => {
    // console.log("state", this.state, "props", this.props);
    let searchTerm = this.props.location.search.substring(2)
    this.fetchEquitiesFromDatabase(searchTerm)
  }

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
        activeStyle={{ fontWeight: "bold"}}
        to="/equities/gainers"> top gainers </NavLink>

        <NavLink
        className="navlink-dash"
        activeStyle={{ fontWeight: "bold"}}
        to="/equities/losers"> top losers </NavLink>

        <NavLink
        className="navlink-dash"
        activeStyle={{ fontWeight: "bold"}}
        to="/equities/mostactive"> most active </NavLink>

        <NavLink
        className="navlink-dash"
        activeStyle={{ fontWeight: "bold"}}
        to="/equities/infocus"> in focus </NavLink>

        <NavLink
        className="navlink-dash"
        activeStyle={{ fontWeight: "bold"}}
        to="/equities/sector"> sector </NavLink>

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
    // console.log("%c props", "color: pink", this.props);
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
            addEquityToDashboard={this.addEquityToDashboard}
          />
          :
          <Fragment>
          {
            this.props.match.params.view === "sector" ?
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
  }
}

const HOC = connect(mapStateToProps)

export default HOC(EquityContainer);
