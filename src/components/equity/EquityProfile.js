import React, { Component, Fragment } from 'react'

import Equity from './Equity'
import Financials from './Financials'
import HistoricChart from './HistoricChart'

import { connect } from 'react-redux';

//gets equity as a prop
class EquityProfile extends Component {
  state = {
    showFinancials: false,
    showHistoricChart: false,
    showAdd: false,
    equity_id: null,
    dashboard_id: null,
  }

  /**********************************************
              STATE CHANGE FUNCTIONS
  **********************************************/
  showDetails = (e) => {
    this.setState({ [e.target.name]: true })
  }

  closeDetails = (e) => {
    this.setState({ [e.target.name]: false })
  }

  showAddToDashboard = (id) => {
    this.setState({ showAdd: true, equity_id: id})
  }

  hideAddToDashboard = () => {
    this.setState({ showAdd: false, equity_id: null, dashboard_id: null})
  }

  setDashboard = (e) => {
    this.setState({ dashboard_id: e.target.value })
  }


  /**********************************************
                FETCH FUNCTIONS
  **********************************************/
  addEquityToDashboard = () => {
    let data = {
      dashboard_id: this.state.dashboard_id,
      equity_id: this.state.equity_id
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
      this.props.dispatch({ type: "SET_DASHBOARD_EQUITIES", payload: [...this.props.dashboardEquities, json] })
      this.props.addEquityToDashboard()
    })
  }
  /**********************************************
                RENDER FUNCTIONS
  **********************************************/
  renderProfile() {
    return (
      <div className="eq-profile">
        <h3>{this.props.equity.symbol} - {this.props.equity.company_name}</h3>

        <div className="eq-profile-details">
          <p>Sector: {this.props.equity.sector} </p>
          <p>Industry: {this.props.equity.industry} </p>
          <p>{this.props.equity.description}</p>
        </div>

        <Equity
          id={this.props.equity.id}
          ticker={this.props.equity.symbol}
          trade={true}
        />
        <button name="showFinancials" onClick={this.showDetails}> view financials </button>
        <button name="showHistoricChart" onClick={this.showDetails}> historic charts </button>
      </div>
    )
  }

  renderAddToDashboard() {
    return (
      <div className="modal">
        <div className="modal-content-sm">
          <button onClick={this.hideAddToDashboard} className="close">X</button>
          <label>select dashboard</label>
          <br />

          <select onChange={this.setDashboard}>
          {
            this.props.dashboards.map( dashboard => {
              if (dashboard.name === "main") {
                return <option value="">select</option>
              } else {
                return <option value={dashboard.id}>{dashboard.name}</option>
              }
            })
          }
          </select>

          <br />
          <button onClick={this.addEquityToDashboard}> add </button>

        </div>
      </div>
    )
  }

  render() {
    console.log();
    return (
      <Fragment>
        { this.renderProfile() }
        {
          this.state.showFinancials ?
          <Financials
            ticker={this.props.equity.symbol}
            closeDetails={this.closeDetails}
          />
          :
          null
        }
        {
          this.state.showHistoricChart ?
          <HistoricChart
            ticker={this.props.equity.symbol}
            companyName={this.props.equity.company_name}
            closeDetails={this.closeDetails}
          />
          :
          null
        }
        {
          this.state.showAdd ?
          this.renderAddToDashboard()
          :
          null
        }
      </Fragment>
    )
  }
}

function mapStateToProps(state) {
  return {
    dashboards: state.dashboards,
    dashboardEquities: state.dashboardEquities
  }
}

const HOC = connect(mapStateToProps)

export default HOC(EquityProfile);

// equity profile will have Equity on clicking the card
// --> display details undermeath it in another component
// --> which will then have EquityChart
