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
    // topEquities: [],
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
    this.props.history.push(`/equities/search?=${this.state.search}`)
    window.location.reload()


    //with redux
    // this.props.dispatch({ type: "SEARCH_EQUITY", payload: this.state.search })


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

    // if(this.props.match.params.view === "search") {
    //   console.log("%c does this hit?", "color: green");
    //   this.setState({ search: this.props.location.search.substring(2) })
    //   this.fetchEquitiesFromDatabase(this.state.search)
    // }
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
    console.log(searchTerm);
    this.fetchEquitiesFromDatabase(searchTerm)
  }

  renderEquityProfile = () => {
    console.log("what is the state right now", this.state);
    console.log("can i get access to params", this.params);
    // this.fetchEquitiesFromDatabase()

    // return this.state.equities.map( equity => {
    //   // console.log(equity);
    //   return (
        // <EquityProfile
        //   key={equity.id}
        //   equity={equity}
        // />
    //   )
    // })
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
    // console.log("%c top equities", "color: pink", this.state.topEquities);
    return (
      <div className="eq-container">
        { this.renderTop() }
        { this.renderSearchBar() }
        { this.renderEquityNavBar() }
        <div>
        {
          this.props.match.params.view === "search" ?
          <Search term={this.props.location.search.substring(2)}/>
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
  }
}

const HOC = connect(mapStateToProps)

export default HOC(EquityContainer);
