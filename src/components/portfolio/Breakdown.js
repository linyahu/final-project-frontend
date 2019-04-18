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
      cutoutPercentage: "50",
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
          'rgba(224, 255, 247, 0.8)',
          'rgba(192, 249, 235, 0.8)',
          'rgba(159, 249, 227, 0.8)',
          'rgba(113, 237, 207, 0.8)',
          'rgba(74, 224, 188, 0.8)',
          'rgba(192, 232, 232, 0.8)',
          'rgba(156, 229, 229, 0.8)',
          'rgba(119, 234, 234, 0.8)',
          'rgba(118, 240, 247, 0.8)',
        ],
        borderColor: [
          'rgba(64, 89, 104, 0.2)',
          'rgba(64, 89, 104, 0.2)',
          'rgba(64, 89, 104, 0.2)',
          'rgba(64, 89, 104, 0.2)',
          'rgba(64, 89, 104, 0.2)',
          'rgba(64, 89, 104, 0.2)',
          'rgba(64, 89, 104, 0.2)',
          'rgba(64, 89, 104, 0.2)',
          'rgba(64, 89, 104, 0.2)',
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
