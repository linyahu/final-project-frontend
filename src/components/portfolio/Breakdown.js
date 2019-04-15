// breakdown of portfolio into sectors (pie chart)

import React, { Component, Fragment } from 'react';

import { Pie } from 'react-chartjs-2';

class Breakdown extends Component {
  state = {
    legend: {
      display: false
    },
    options: {

    }
  }


  componentDidMount() {
    this.setState({
      data: {
        datasets: [{
            data: Object.values(this.props.sectorData),
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)'],
            borderColor: [
            'rgba(255,99,132,1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'],
          }],
        // These labels appear in the legend and in the tooltips when hovering different arcs
        labels: Object.keys(this.props.sectorData)
      }
    })
  }

  getData = () => {
    let data = {
      datasets: [{
        data: Object.values(this.props.sectorData)
      }],
      labels: Object.keys(this.props.sectorData)
    }
    return data
  }

  render() {
    // console.log("props in breakdown", this.props);
    // console.log("what is my state", this.state);
    return (
      <div className="grey-border portfolio-card">
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
