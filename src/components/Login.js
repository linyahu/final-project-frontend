import React, { Component } from 'react';

class Login extends Component {
  state = {
    username: "",
    password: ""
  }

  handleChange = (e) => {
		this.setState({
			[e.target.name]: e.target.value
		})
	}

  handleSubmit = (e) => {
    e.preventDefault()
    console.log("did this hit??");

    fetch("http://localhost:3000/api/v1/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accepts": "application/json",
      },
      body: JSON.stringify(this.state)
    })
    .then(res => res.json())
    .then((response) => {
      if (response.errors) {
        console.log("got an error");
        alert(response.errors)
      } else {
        console.log("what about this?");
          // we need to login at the top level where we are holding our current user!
          // setState in App to currentuser
          // debugger
          this.props.setCurrentUser(response.user.id)
          localStorage.setItem('jwt', response.jwt)
          this.props.history.push("/dashboards")
        }
      })
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label> Username </label>
          <input value={this.state.username} name="username" onChange={this.handleChange} type="text" />
          <label> Password </label>
          <input value={this.state.password} name="password" onChange={this.handleChange} type="password" />
          <input type="submit" value="login" />
        </form>
      </div>
    )
  }
}

export default Login
