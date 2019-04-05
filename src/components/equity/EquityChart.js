import React, { Component } from 'react'

class EquityChart extends Component {

  render() {
    console.log("props in equity chart", this.props);
    return(
      <canvas className="eq-chart">
      </canvas>
    )
  }

}

export default EquityChart
