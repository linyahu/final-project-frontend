import React, { Component } from 'react'

class EditDashboard extends Component {

  componentDidMount() {
    fetch("http://localhost:3000/api/v1/dashboards")
    .then(res => res.json() )
    .then()
  }

  render() {
    console.log("props in edit dashboard", this.props);
    return (
      <div>
        <h1>EditDashboard</h1>
      </div>
    )
  }
}

export default EditDashboard
