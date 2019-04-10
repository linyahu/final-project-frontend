import React, { Component, Fragment } from 'react';

import { NavLink } from 'react-router-dom';

class Login extends Component {
  state = {
    firstname: "",
    lastname: "",
    username: "",
    password: "",
    email: "",
    passwordConfirmation: "",
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
        alert(response.errors)
      } else {
          // we need to login at the top level where we are holding our current user!
          // setState in App to currentuser
          this.props.setCurrentUser(response.user.id)
          localStorage.setItem('jwt', response.jwt)
          this.props.history.push("/dashboards")
        }
      })
  }

  handleCreateAccount = (e) => {
    e.preventDefault()
    if (this.state.password === this.state.passwordConfirmation) {
      let data = {
        first_name: this.state.firstname,
        last_name: this.state.lastname,
        email: this.state.email,
        username: this.state.username,
        password: this.state.password
      }
      this.fetchCreateUser(data)
    } else {
      alert("passwords don't match")
    }
  }

  fetchCreateUser(data) {
    fetch("http://localhost:3000/api/v1/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accepts": "application/json",
      },
      body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(response => {
      if (response.errors) {
        alert(response.errors)
      } else {
        this.props.setCurrentUser(response.user.id)
        localStorage.setItem('jwt', response.jwt)
        this.props.history.push("/dashboards")
      }
    })
  }

  renderLoginForm() {
    return (
      <div className="login">
        <form onSubmit={this.handleSubmit}>
          <label> Username </label>
          <input
            value={this.state.username}
            name="username"
            onChange={this.handleChange}
            type="text"
          />
          <br />
          <label> Password </label>
          <input
            value={this.state.password}
            name="password"
            onChange={this.handleChange}
            type="password"
          />
          <br />
          <br />
          <input type="submit" value="login" />
          <br />
          <br />

          <NavLink
          className="navlink"
          activeStyle={{ fontWeight: "bold", color: "rgba(192, 247, 244, 1)"}}
          to={"/login/signup"}>create an account</NavLink>

        </form>
      </div>
    )
  }

  renderSignupForm() {
    return (
      <div className="signup">
        <form onSubmit={this.handleCreateAccount}>
          <label> First Name </label>
          <input
            value={this.state.firstname}
            name="firstname"
            onChange={this.handleChange}
            type="text"
          />
          <br />
          <label> Last Name </label>
          <input
            value={this.state.lastname}
            name="lastname"
            onChange={this.handleChange}
            type="text"
          />
          <br />
          <label> Email </label>
          <input
            value={this.state.email}
            name="email"
            onChange={this.handleChange}
            type="text"
          />
          <br />
          <label> Username </label>
          <input
            value={this.state.username}
            name="username"
            onChange={this.handleChange}
            type="text"
          />
          <br />
          <label> Password </label>
          <input
            value={this.state.password}
            name="password"
            onChange={this.handleChange}
            type="password"
          />
          <br />
          <label> Confirm Password </label>
          <input
            value={this.state.passwordConfirmation}
            name="passwordConfirmation"
            onChange={this.handleChange}
            type="password"
          />
          <br />
          <button onClick={this.handleCreateAccount}> create account </button>
        </form>
        <br />

      </div>
    )
  }

  render() {
    console.log(this.props);
    return (
      <Fragment>
        {
          this.props.view ?
          this.renderSignupForm()
          :
          this.renderLoginForm()
        }

      </Fragment>
    )
  }
}

export default Login
