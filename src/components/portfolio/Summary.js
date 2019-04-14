// summary of portfolio performance history
import React, { Component, Fragment } from 'react';

// fetch the data for each equity that's there
// store that in state
// then collapse it all using the function sumObjectsByKey

import EquityChart from '../equity/EquityChart'

class Summary extends Component {
  state = {
    dataArray: [],
    data: {},
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
    currentValue: 0,
  }

  sumObjectsByKey(objs) {
    return objs.reduce((a, b) => {
      for (let k in b) {
        if (b.hasOwnProperty(k))
          a[k] = (a[k] || 0) + b[k];
      }
      return a;
    }, {});
  }

/**********************************************
            LIFECYCLE FUNCTIONS
**********************************************/
  componentDidMount() {
    let t = new Date()
    let d = (t.getFullYear() -1) + "-" + (t.getMonth() +1) + "-" + t.getDate()

    this.props.subportfolios.map( eq => {
      // console.log("my equity", eq);
      if (eq.date_bought > d) {
        this.fetchOneYearTradingData(eq, d)
      } else {
        this.fetchFiveYearTradingData(eq, d)
      }
    })
  }

/**********************************************
              FETCH FUNCTIONS
**********************************************/
  fetchOneYearTradingData = (eq) => {
    fetch(`https://api.iextrading.com/1.0/stock/${eq.equity.symbol}/chart/1y`)
    .then(res => res.json())
    .then(json => {
      let filteredData = json.filter( d => d.date >= eq.date_bought)
      let dataObject = filteredData.reduce(function(obj, itm) {
        obj[itm.date] = Math.round(itm.close*eq.quantity*100)/100
        return obj;
      }, {});

      this.setState(prevState => {
        return { dataArray: [...prevState.dataArray, dataObject ]}
      })
    })
    .then( () => {
      let collapsedData = this.sumObjectsByKey(this.state.dataArray)
      let datapoints = Object.values(collapsedData)
      let labels = Object.keys(collapsedData)
      // let date = (new Date().getFullYear()) + "-" + (new Date().getMonth() +1) + "-" + new Date().getDate()
      let currentValue = Object.values(collapsedData)[Object.values(collapsedData).length - 1]

      // console.log("what is collapsedData", collapsedData);
      // NOTE:
      // fix the bug where collapsedData is only sometimes in chronological order
      // will probably need to do a sort by function

      this.setState({
        data: {
          labels: labels,
          datasets: [{
                label: '',
                backgroundColor: 'rgb(0,0,0,0)',
                pointBorderColor: 'rgb(255,255,255,0)',
                borderColor: '#2bcbba',
                data: datapoints
            }]
        },
        currentValue: currentValue,
      })
    })
  }

  fetchFiveYearTradingData() {

  }


/**********************************************
              RENDER FUNCTIONS
**********************************************/
  render() {
    // console.log("%c state in my summary company", "color: blue", this.state);
    return (
      <div className="grey-border portfolio-card">
        <h4>Portfolio Snapshot</h4>
        <EquityChart
          data={this.state.data}
          legend={this.state.legend}
          options={this.state.options}
        />
        <h6>performance of portfolio since first trade</h6>
        <h6>current value: {this.state.currentValue} </h6>
      </div>

    )
  }
}

export default Summary
