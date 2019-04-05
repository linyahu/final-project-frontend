import React, { Component } from 'react'

import Equity from './Equity'
import Top from './Top'

class EquityContainer extends Component {
  // this container is going to contain the equity list
  // on the equities page


  /**********************************************
                RENDER FUNCTIONS
  **********************************************/

  renderEquityNav = () => {
    return (
      <h3>equity navbar </h3>
    )
  }

  render() {
    return (
      <div className="eq-container">
      { this.renderEquityNav() }
      <Top />
      </div>
    )
  }
}

export default EquityContainer
