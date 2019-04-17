import React, { Component, Fragment } from 'react';

import SimpleEquity from './SimpleEquity'

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
  }

  changePage = (e) => {
    this.setState({ currentPage: e.target.value })
  }

  componentDidMount() {
    this.fetchEquities()
  }

  fetchEquities = () => {
    fetch("http://localhost:3000/api/v1/equities")
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
        realEstate
      })

    })
  }


  renderSectorBar = () => {
    return (
      <Fragment>
        <button onClick={this.changePage} name="technology" value="technology">Technology</button>
        <button onClick={this.changePage} name="healthcare" value="healthcare">Healthcare</button>
        <button onClick={this.changePage} name="energy" value="energy">Energy</button>
        <button onClick={this.changePage} name="industrials" value="industrials">Industrials</button>
        <button onClick={this.changePage} name="financialServices" value="financialServices">Financial Services</button>
        <button onClick={this.changePage} name="basicMaterials" value="basicMaterials">Basic Materials</button>
        <button onClick={this.changePage} name="consumerCyclical" value="consumerCyclical">Consumer Cyclical</button>
        <button onClick={this.changePage} name="consumerDefensive" value="consumerDefensive">Consumer Defensive</button>
        <button onClick={this.changePage} name="realEstate" value="realEstate">Real Estate</button>
      </Fragment>
    )
  }

  renderSector = () => {
    return (
      <Fragment>
        {
          this.state[this.state.currentPage].map( equity => {
            return (
              <SimpleEquity />
            )
          })
        }
      </Fragment>
    )
  }

  render() {
    console.log("state?", this.state);
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

export default Sector
