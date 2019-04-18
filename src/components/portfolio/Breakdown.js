// breakdown of portfolio into sectors (pie chart)

import React, { Component, Fragment } from 'react';

import { Pie } from 'react-chartjs-2';

class Breakdown extends Component {
  state = {
    legend: {
      display: false,
      color: "white",
    },
    options: {

    }
  }

  componentDidMount() {
    this.setState({
      data: {
        datasets: [{
            fill: true,
            data: Object.values(this.props.sectorData),
          }],
        // These labels appear in the legend and in the tooltips when hovering different arcs
        labels: Object.keys(this.props.sectorData)
      }
    })
  }

  getData = () => {
    let data = {
      datasets: [{
        data: Object.values(this.props.sectorData),
        backgroundColor: [
          'rgba(175, 200, 206, 0.3)',
          'rgba(117, 140, 145, 0.3)',
          'rgba(82, 102, 107, 0.3)',
          'rgba(123, 153, 160, 0.3)',
          'rgba(168, 191, 196, 0.3)',
          'rgba(72, 92, 96, 0.3)',
          'rgba(91, 117, 122, 0.3)',
          'rgba(138, 167, 173, 0.3)',
          'rgba(157, 170, 173, 0.3)',
        ],
        borderColor: [
          'rgb(177, 221, 218, 0.4)',
          'rgb(177, 221, 218, 0.4)',
          'rgb(177, 221, 218, 0.4)',
          'rgb(177, 221, 218, 0.4)',
          'rgb(177, 221, 218, 0.4)',
          'rgb(177, 221, 218, 0.4)',
          'rgb(177, 221, 218, 0.4)',
          'rgb(177, 221, 218, 0.4)',
          'rgb(177, 221, 218, 0.4)',
        ]
      }],
      labels: Object.keys(this.props.sectorData)
    }
    return data
  }

  render() {
    return (
      <div className="grey-border portfolio-card col-1">
        <h4>Breakdown Component </h4>
        <h6> breakdown of portfolio by sector </h6>
        <Pie
          data={this.getData()}
          legend={this.state.legend}
          options={this.state.options}
        />
      </div>
    )
  }
}

export default Breakdown
