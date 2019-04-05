import React, { Component } from 'react'

import EquityChart from './EquityChart'

class Equity extends Component {
  render() {
    return (
      <div className="equity card">
        <EquityChart />
        <p>ticker | last price | % change </p>
      </div>
    )
  }

}

export default Equity
