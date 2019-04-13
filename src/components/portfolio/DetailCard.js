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
    showChart: false,
  }

  toggleChart = () => {
    this.setState( prevState => {
      return { showChart: !prevState.showChart }
    })
  }

  componentDidMount() {
    let t = new Date()
    let d = (t.getFullYear() -1) + "-" + (t.getMonth() +1) + "-" + t.getDate()
    if (this.props.subportfolio.date_bought > d) {
      this.fetchOneYearTradingData()
    } else {
      this.fetchFiveYearTradingData()
    }
    this.fetchPrice()
  }

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

  fetchPrice() {
    fetch(`https://api.iextrading.com/1.0/stock/${this.props.subportfolio.equity.symbol}/price`)
    .then(res => res.json())
    .then(json => {
      this.setState({
        currentPrice: json,
        currentValue: Math.round(json * this.props.subportfolio.quantity * 100)/100
      })
    })
  }


  render() {
    // console.log("props in detailcard", this.props);
    // console.log("%c state", "color: pink", this.state);
    return (
      <div className="details">
        <h5>{this.props.subportfolio.equity.company_name}</h5>
        {
          this.state.showChart ?
          <Fragment>
            <EquityChart
              data={this.state.data}
              legend={this.state.legend}
              options={this.state.options}
            />
            <button onClick={this.toggleChart}>hide chart</button>
          </Fragment>
          :
          <button onClick={this.toggleChart}>show price chart</button>
        }



        <h6>
        last px: ${this.state.currentPrice} |
        value: ${this.state.currentValue} |
        $change: { Math.round((this.state.currentValue - this.props.subportfolio.initial_value)*100)/100 } |
        %change: {Math.round((this.state.currentPrice/this.props.subportfolio.initial_px - 1)*10000)/100} </h6 >
      </div>
    )
  }
}

export default DetailCard


// <h5>qty: {this.props.subportfolio.quantity} </h5>
// <h5>initial price: {this.props.subportfolio.initial_px} </h5>
// <h5>initial value: {this.props.subportfolio.initial_value} </h5>
