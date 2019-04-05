import React, { Component } from 'react'

import Equity from './Equity'

class EquityList extends Component {
  // EquityList will get props for what it's going to render
  // and then it's going to render hte list of Equities that's passed
  // down to it as props

  render() {
    return (
      <Equity />
    )
  }
}

export default EquityList
