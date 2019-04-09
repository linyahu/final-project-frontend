import React, { Component } from 'react'
// import { NavLink, Switch } from 'react-router-dom';

// import Equity from './Equity'
import EquityProfile from './EquityProfile'
import Top from './Top'



class EquityContainer extends Component {
  // this container is going to contain the equity list
  // on the equities page
  state = {
    search: "",
    equities: [],
    losers: [],
    gainers: [],
    infocus: [],
    // volume: [],
    mostActive: [],
    // percent: [],
  }

  /**********************************************
            STATE-CHANGE FUNCTIONS
  **********************************************/
  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value.toLowerCase() })
  }

  handleSearch = (e) => {
    e.preventDefault()
    this.props.history.push(`/equities/search?=${this.state.search}`)
    this.fetchEquitiesFromDatabase()
  }

  /**********************************************
                LIFECYCLE FUNCTIONS
  **********************************************/
  componentDidMount() {
    // this.props.history.push("/equities/top")
    this.fetchMostActive()
    this.fetchGainers()
    this.fetchLosers()
    this.fetchInFocus()
  }

  /**********************************************
                FETCH FUNCTIONS
  **********************************************/
  fetchEquitiesFromDatabase() {
    fetch("http://localhost:3000/api/v1/equities")
    .then(res => res.json())
    .then(json => {
      // console.log(json);
      // finding equities that match search
      // either ticker or company name includes search
      let equities = json.filter( eq => eq.symbol.toLowerCase().includes(this.state.search) || eq.company_name.toLowerCase().includes(this.state.search))
      this.setState({ equities })
    })
  }

  fetchMostActive() {
    fetch("https://api.iextrading.com/1.0/stock/market/list/mostactive")
    .then(res => res.json())
    .then(json => {
      // console.log("most active", json);
      this.setState({ mostActive: json })
    })
  }

  fetchGainers() {
    fetch("https://api.iextrading.com/1.0/stock/market/list/gainers")
    .then(res => res.json())
    .then(json => {
      // console.log("gainers", json);
      this.setState({ gainers: json })
    })
  }

  fetchLosers() {
    fetch("https://api.iextrading.com/1.0/stock/market/list/losers")
    .then(res => res.json())
    .then(json => {
      // console.log("losers", json);
      this.setState({ losers: json })
    })
  }

  fetchVolume() {
    fetch("https://api.iextrading.com/1.0/stock/market/list/iexvolume")
    .then(res => res.json())
    .then(json => {
      // console.log("iex volume", json);
      this.setState({ losers: json })
    })
  }

  fetchPercent() {
    fetch("https://api.iextrading.com/1.0/stock/market/list/iexpercent")
    .then(res => res.json())
    .then(json => {
      // console.log("iex percent", json);
      this.setState({ percent: json })
    })
  }

  fetchInFocus() {
    fetch("https://api.iextrading.com/1.0/stock/market/list/infocus")
    .then(res => res.json())
    .then(json => {
      // console.log("infocus", json);
      this.setState({ infocus: json })
    })
  }


  /**********************************************
                RENDER FUNCTIONS
  **********************************************/
  renderEquityProfile = () => {
    // console.log("what is the state right now", this.state.equities);
    // console.log("can i get access to params");

    return this.state.equities.map( equity => {
      // console.log(equity);
      return (
        <EquityProfile
          key={equity.id}
          equity={equity}
        />
      )
    })
  }

  renderTop = () => {
    if (this.props.view === "top") {
      this.props.history.push("/equities/top")
    }
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
    // console.log(this.props);
    return (
      <div className="eq-container">
        { this.renderSearchBar() }
        { this.renderTop() }
        {
          this.props.match.params.view === "top" ?
          <Top
            gainers={this.state.gainers}
            losers={this.state.losers}
            infocus={this.state.infocus}
            mostActive={this.state.mostActive}
          />
          :
          this.renderEquityProfile()
        }
      </div>
    )
  }

} // end of EquityContainer

export default EquityContainer

// previous render
// {
//   this.state.showEquityProfile ?
//   this.renderEquityProfile()
//   :
//   <Top
//     gainers={this.state.gainers}
//     losers={this.state.losers}
//     infocus={this.state.infocus}
//     mostActive={this.state.mostActive}
//   />
// }
