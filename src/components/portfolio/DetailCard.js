// detail for EACH stock
import React, { Component, Fragment } from 'react';

import EquityChart from '../equity/EquityChart'

class DetailCard extends Component {
  state = {
    data: {
      labels: [],
      datasets: [{
            label: '',
            pointBorderColor: 'rgb(255,255,255,0)',
            lineTension: 1,
            data: []
        }]
    },
    legend: {
      display: false,
    },
    options: {
      scales: {
        xAxes: [{
          ticks: {
            display: false, // show label
            fontColor: 'rgba(255,255,255,1)'
          },
          gridLines: {
            display: false,
            color: 'rgba(255,255,255,0.5)'
          }
        }],
        yAxes: [{
          ticks: {
            fontColor: 'rgba(255,255,255,1)'
          },
          gridLines: {
            display: false,
            color: 'rgba(255,255,255,0.5)'
          }
        }]
      }
    },
    currentPrice: 0,
    currentValue: 0,
    closePosition: false,
  }

  /**********************************************
            EVENT / CHANGE STATE FUNCTIONS
  **********************************************/

  closePosition = () => {
    this.setState( prevState => {
      return { closePosition: !prevState.closePosition }
    })
  }

  confirmTrade = () => {
    let data = {
      portfolio_id: this.props.portfolio,
      equity_id: this.props.subportfolio.equity.id,
      initial_px: parseFloat(this.props.subportfolio.initial_px),
      date_bought: this.props.subportfolio.date_bought,
      date_sold: (new Date().getFullYear()) + "-" + (new Date().getMonth() +1) + "-" + new Date().getDate(),
      quantity: 0,
      end_px: this.state.currentPrice,
      initial_value: parseFloat(this.props.subportfolio.initial_value),
      end_value: this.state.currentValue
    }
    fetch(`http://localhost:3000/api/v1/subportfolios/${this.props.subportfolio.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Accepts": "application/json"
      },
      body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then( json => {
      // console.log("json??", json);
      this.updateAccountBalance(json.end_value)
    })
  }

  /**********************************************
                LIFECYCLE FUNCTIONS
  **********************************************/
  componentDidMount() {
    let t = new Date()
    let d = (t.getFullYear() -1) + "-" + (t.getMonth() +1) + "-" + t.getDate()
    if (this.props.subportfolio.date_bought > d) {
      this.fetchOneYearTradingData()
    } else {
      this.fetchFiveYearTradingData()
    }
    window.setInterval(this.fetchPrice, 5000)
  }

  /**********************************************
                FETCH FUNCTIONS
  **********************************************/
  fetchFiveYearTradingData() {
    fetch(`https://api.iextrading.com/1.0/stock/${this.props.subportfolio.equity.symbol}/chart/5y`)
    .then(res => res.json())
    .then(json => {
      let data = json.filter(data => data.date >= this.props.subportfolio.date_bought)
      let datapoints = data.map(d => d.close)
      let labels = data.map(d => d.date)

      this.setState({
        data: {
          labels: labels,
          datasets: [{
                label: '',
                backgroundColor: 'rgb(0,0,0,0)',
                borderColor: '#2bcbba',
                data: datapoints
            }]
        }
      })
    })
  }

  fetchOneYearTradingData() {
    fetch(`https://api.iextrading.com/1.0/stock/${this.props.subportfolio.equity.symbol}/chart/1y`)
    .then(res => res.json())
    .then(json => {
      let data = json.filter(data => data.date >= this.props.subportfolio.date_bought)
      let datapoints = data.map(d => d.close)
      let labels = data.map(d => d.date)

      // console.log(this.props.subportfolio.equity.symbol, datapoints);
      this.setState({
        data: {
          labels: labels,
          datasets: [{
                label: '',
                backgroundColor: 'rgb(0,0,0,0)',
                borderColor: '#2bcbba',
                data: datapoints
            }]
        }
      })

    })
  }

  fetchPrice = () => {
    fetch(`https://api.iextrading.com/1.0/stock/${this.props.subportfolio.equity.symbol}/price`)
    .then(res => res.json())
    .then(json => {
      this.setState({
        currentPrice: json,
        currentValue: Math.round(json * this.props.subportfolio.quantity * 100)/100
      })
    })
  }

  updateAccountBalance = (value) => {
    let data ={
      account_balance: Math.round((parseFloat(this.props.portfolio.account_balance) + parseFloat(value) - 5)*100)/100
    }
    console.log("what is my data", data);

    fetch(`http://localhost:3000/api/v1/portfolios/${this.props.portfolio.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Accepts": "application/json"
      },
      body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(json => {
      console.log("did it patch through?", json);

      window.location.reload()
    })
  }

  /**********************************************
                RENDER FUNCTIONS
  **********************************************/
  render() {
    // console.log("props in detailcard", this.props);
    // console.log("%c state", "color: pink", this.state);
    return (
      <div className="details">
        <h5>{this.props.subportfolio.equity.company_name} - {this.props.subportfolio.equity.sector}</h5>

        <EquityChart
          data={this.state.data}
          legend={this.state.legend}
          options={this.state.options}
        />

        <h6>
        last px: ${this.state.currentPrice} |
        quantity: {this.props.subportfolio.quantity} |
        value: ${this.state.currentValue} |
        $change: { Math.round((this.state.currentValue - this.props.subportfolio.initial_value)*100)/100 } |
        %change: {Math.round((this.state.currentPrice/this.props.subportfolio.initial_px - 1)*10000)/100} </h6 >
        {
          Math.abs(this.props.subportfolio.quantity) > 0 ?
          <Fragment>
            <h6>date bought: {this.props.subportfolio.date_bought}</h6>

            <button className="pf-btn" onClick={this.closePosition}> close this position </button>
            
          </Fragment>
          :
          <Fragment>
            <h6> date bought: {this.props.subportfolio.date_bought} | date sold: {this.props.subportfolio.date_sold}</h6>
            <h6> realized gain/loss: {Math.round((this.props.subportfolio.end_value - this.props.subportfolio.initial_value)*100)/100}</h6>
          </Fragment>
        }
        {
          this.state.closePosition ?
          <div className="modal">
            <div className="modal-content-sm">

              <button onClick={this.closePosition} className="close">X</button>

              <h4>{this.props.subportfolio.equity.symbol} - ${this.state.currentPrice}</h4>
              <h5> trading fee: $5 </h5>
              <h5> initial value: ${this.props.subportfolio.initial_value}</h5>
              <h5> current value: ${this.state.currentValue}</h5>
              <h5> realized gain/loss: ${Math.round((this.state.currentValue - this.props.subportfolio.initial_value - 5)*100)/100}</h5>
              <button onClick={this.confirmTrade}> confirm trade </button>
            </div>
          </div>
          :
          null
        }
      </div>
    )
  }
}

export default DetailCard
