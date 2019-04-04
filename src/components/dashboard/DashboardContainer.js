import React, { Component } from 'react'

import MainDash from './MainDash'

import { connect } from 'react-redux';

class DashboardContainer extends Component {
  render() {
    return (
      <div className="dash-container">
        <MainDash />

      </div>
    )
  }
}

export default DashboardContainer
