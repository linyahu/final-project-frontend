import React, { Component } from 'react';

class Login extends Component {

  render() {
    return (
      <div>
        <form>
          <label> Username </label>
          <input type="text" />
          <label> Password </label>
          <input type="password" />
        </form>
      </div>
    )
  }
}

export default Login
