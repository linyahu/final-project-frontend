import React, { Component, Fragment } from 'react';

import SimpleEquity from './SimpleEquity'

import { NavLink } from 'react-router-dom';

import { connect } from 'react-redux';

class Sector extends Component {
  state = {
    technology: [],
    healthcare: [],
    energy: [],
    industrials: [],
    financialServices: [],
    basicMaterials: [],
    consumerCyclical: [],
    consumerDefensive: [],
    realEstate: [],
    currentPage: "technology",
    filtered: [],
    search: "",
  }

  changePage = (e) => {
    this.setState({
      currentPage: e.target.value,
      filtered: this.state[e.target.value]
    })
  }

  handleSearch = (e) => {
    let newEquities = this.state[this.state.currentPage].filter( eq => eq.company_name.toLowerCase().includes(e.target.value))

    this.setState({ search: e.target.value, filtered: newEquities })
  }

  componentDidMount() {
    this.fetchEquities()
  }

  fetchEquities = () => {
    fetch(`${this.props.url}/api/v1/equities`)
    .then(res => res.json())
    .then(json => {
      let technology = json.filter(e => e.sector === "Technology")
      let healthcare = json.filter( e => e.sector === "Healthcare")
      let energy = json.filter( e => e.sector === "Energy")
      let industrials = json.filter( e => e.sector === "Industrials")
      let financialServices = json.filter( e => e.sector === "Financial Services")
      let basicMaterials = json.filter( e => e.sector === "Basic Materials")
      let consumerCyclical = json.filter( e => e.sector === "Consumer Cyclical")
      let consumerDefensive = json.filter( e => e.sector === "Consumer Defensive")
      let realEstate =  json.filter( e => e.sector === "Real Estate")

      this.setState({
        technology,
        healthcare,
        energy,
        industrials,
        financialServices,
        basicMaterials,
        consumerCyclical,
        consumerDefensive,
        realEstate,
        filtered: technology,
      })

    })
  }


  renderSectorBar = () => {
    return (
      <div className="sector-nav">
        <div>
          <button className="trade-btn" onClick={this.changePage} name="technology" value="technology">Technology</button>
          <button className="trade-btn" onClick={this.changePage} name="healthcare" value="healthcare">Healthcare</button>
          <button className="trade-btn" onClick={this.changePage} name="energy" value="energy">Energy</button>
          <button className="trade-btn" onClick={this.changePage} name="industrials" value="industrials">Industrials</button>
          <button className="trade-btn" onClick={this.changePage} name="financialServices" value="financialServices">Financial Services</button>
          <button className="trade-btn" onClick={this.changePage} name="basicMaterials" value="basicMaterials">Basic Materials</button>
          <button className="trade-btn" onClick={this.changePage} name="consumerCyclical" value="consumerCyclical">Consumer Cyclical</button>
          <button className="trade-btn" onClick={this.changePage} name="consumerDefensive" value="consumerDefensive">Consumer Defensive</button>
          <button className="trade-btn" onClick={this.changePage} name="realEstate" value="realEstate">Real Estate</button>

          <input onChange={this.handleSearch} value={this.state.search} type="text" placeholder="quick search" />
        </div>
      </div>

    )
  }

  renderSector = () => {

    return (
      <div className="sector-equities">

        {
          this.state.filtered.map( equity => {
            return (
              <SimpleEquity
                equity={equity}
              />
            )
          })
        }
      </div>
    )
  }

  render() {
    return (
      <div className="sectors-container">
        <div className="sector grey-border">
        { this.renderSectorBar() }

          {
            this.state[this.state.currentPage] != "" ?
            this.renderSector()
            :
            null
          }

        </div>
      </div>
    )
  }
}


function mapStateToProps(state) {
  return {
    url: state.url
  }
}

const HOC = connect(mapStateToProps)

export default HOC(Sector);
