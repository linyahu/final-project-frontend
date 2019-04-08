import React, { Component } from 'react'

import { Line } from 'react-chartjs-2';

class EquityChart extends Component {
  state = {
    data: {
      labels: [],
      datasets: [{
            label: '',
            backgroundColor: 'rgb(0,0,0,0)',
            borderColor: 'rgb(255, 99, 132)',
            data: []
        }]
    },
    legend: {
      display: false,
    },
    options: {
      scales: {

      }
    }

  }


  /**********************************************
                RENDER FUNCTIONS
  **********************************************/

  renderChart() {
    // let relPoints = this.props.equityData.filter( data => data.marketHigh > 0)
    // let data = relPoints.map( d => d.marketHigh)
    // let labels = relPoints.map( d => d.label)
    // let data = this.props.equityData.map( d => d.marketHigh)
    // console.log("%c data in render chart", "color: orange", data, labels);
  }

  render() {
    console.log("props in equity chart", this.props);
    return(
      <div className="eq-chart">
        { this.renderChart() }
        <Line
          data={this.state.data}
          width={300}
          height={180}
          legend={this.state.legend}
          options={this.state.options}
        />
      </div>
    )
  }

}

export default EquityChart
