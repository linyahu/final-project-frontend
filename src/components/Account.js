import React, { Component } from 'react'

class Account extends Component {
  state = {
    user: {}
  }

  componentDidMount() {
    fetch("http://localhost:3000/api/v1/users")
    .then(res => res.json())
    .then(json => {
      let user = json.find(u => u.id === this.props.user_id)
      this.setState({ user })
    })
  }

  render() {
    // console.log("props?", this.props);
    return (
      <div>
        <h4> account details will be below </h4>
        <h4>first name: {this.state.user.first_name} </h4>
        <h4>last name: {this.state.user.last_name} </h4>
        <h4>username: {this.state.user.username} </h4>
        <h4>email: {this.state.user.email} </h4>
        <h4> account balance: ${this.props.balance }</h4>
        <button> add money to your account </button>
      </div>
    )
  }
}

export default Account
