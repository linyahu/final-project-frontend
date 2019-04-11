import React, { Component } from 'react'

import { Line } from 'react-chartjs-2';

class HistoricChart extends Component {
  state ={
    view: "1m",
    price: "close",
    data: {},
    legend: {
      display: false,
    },
    options: {
      scales: {
        xAxes: [{
          ticks: {
            fontColor: 'rgba(0,0,0,1)'
          },
          gridLines: {
            display: false,
            color: 'rgba(0,0,0,0.5)'
          }
        }],
        yAxes: [{
          ticks: {
            fontColor: 'rgba(0,0,0,1)'
          },
          gridLines: {
            display: false,
            color: 'rgba(0,0,0,0.5)'
          }
        }]
      }
    },
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value })

    if (e.target.name === "view") {
      this.getNewData(e.target.value)
    } else if (e.target.name === "price") {
      this.getNewData(this.state.view)
    }
  }

  componentDidMount() {
    fetch(`https://api.iextrading.com/1.0/stock/${this.props.ticker}/chart/${this.state.view}`)
    .then(res => res.json())
    .then(json => {
      console.log(json);

      let datapoints = json.map( d => d[this.state.price] )
      let labels = json.map( d => d.date )

      this.setState({
        data: {
          labels: labels,
          datasets: [{
                label: '',
                backgroundColor: 'rgb(0,0,0,0)',
                borderColor: '#2bcbba',
                pointBorderColor: 'rgb(255,255,255,0)',
                data: datapoints
            }]
        }
      })
    })
  }

  getNewData = (view) => {
    fetch(`https://api.iextrading.com/1.0/stock/${this.props.ticker}/chart/${view}`)
    .then(res => res.json())
    .then(json => {
      console.log(json);

      let datapoints = json.map( d => d[this.state.price] )
      let labels = json.map( d => d.date )

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

  renderDropdown() {
    return (
      <div>
      <label> date range </label>
      <select name="view" onChange={this.handleChange}>
        <option value="1m">1m</option>
        <option value="3m">3m</option>
        <option value="6m">6m</option>
        <option value="ytd">Ytd</option>
        <option value="1y">1y</option>
        <option value="2y">2y</option>
        <option value="5y">5y</option>
      </select>
      <label> price </label>
      <select name="price" onChange={this.handleChange}>
        <option value="close">close</option>
        <option value="open">open</option>
        <option value="high">high</option>
        <option value="low">low</option>
        <option value="vwap">vwap</option>
      </select>
      </div>
    )
  }

  renderChart() {
    return (
      <div className="eq-chart">
        <Line
          data={this.state.data}
          legend={this.state.legend}
          options={this.state.options}
        />
      </div>
    )
  }

  render() {
    // console.log(this.state.data);
    return (
      <div className="modal">
        <div className="modal-content">
          <button name="showHistoricChart" onClick={this.props.closeDetails} className="close">X</button>
          { this.renderDropdown() }
          { this.renderChart() }
        </div>
      </div>
    )
  }

}

export default HistoricChart
