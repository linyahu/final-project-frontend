import React, { Component } from 'react'

import { Line } from 'react-chartjs-2';

class EquityChart extends Component {

  /**********************************************
                RENDER FUNCTIONS
  **********************************************/

  render() {
    // console.log("props in equity chart", this.props);
    return(
      <div className="eq-chart">
        <Line
          data={this.props.data}
          legend={this.props.legend}
          options={this.props.options}
          height={this.props.height}
        />
      </div>
    )
  }

}

export default EquityChart
