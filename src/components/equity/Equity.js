import React, { Component } from 'react'

import EquityChart from './EquityChart'

class Equity extends Component {

  /**********************************************
                LIFECYCLE FUNCTIONS
  **********************************************/
  componentDidMount() {
    fetch(`https://api.iextrading.com/1.0/stock/${this.props.ticker}/chart/dynamic`)
    .then(res => res.json())
    .then( json => {
      console.log(json);
    })
  }

  /**********************************************
                RENDER FUNCTIONS
  **********************************************/

  render() {
    // console.log("props in Equity", this.props);
    return (
      <div className="equity card">
        <EquityChart
          ticker={this.props.ticker}
        />
        <p>ticker | last price | % change </p>
      </div>
    )
  }

} // end of Equity component

export default Equity
