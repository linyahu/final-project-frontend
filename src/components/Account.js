import React, { Component } from 'react'

import { connect } from 'react-redux';

class Account extends Component {
  state = {
    user: {},
    addMoney: false,
    amount: 0,
  }

  addMoney = () => {
    this.setState( prevState => {
      return { addMoney: !prevState.addMoney }
    })
  }

  enterAmount = (e) => {
    this.setState({ amount: e.target.value })
  }

  updateAccountBalance = (e) => {
    e.preventDefault()

    let data = {
      account_balance: Math.round((parseFloat(this.props.portfolio.account_balance) + parseFloat(this.state.amount))*100)/100
    }

    fetch(`http://localhost:3000/api/v1/portfolios/${this.props.portfolio.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Accepts": "application/json"
      },
      body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(json => {
      console.log("did it patch through?", json);

      this.setState({ addMoney: false, amount: 0 })

      this.props.dispatch({ type: "SET_PORTFOLIO", payload: json })
      this.props.dispatch({ type: "SET_ACCOUNT_BALANCE", payload: json.account_balance })

    })
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
    console.log("props?", this.props);
    return (
      <div className="account-details grey-border">
        <h4>first name: {this.state.user.first_name} </h4>
        <h4>last name: {this.state.user.last_name} </h4>
        <h4>username: {this.state.user.username} </h4>
        <h4>email: {this.state.user.email} </h4>
        <h4> account balance: ${this.props.accountBalance }</h4>
        <button onClick={this.addMoney}> add money to your account </button>
        {
          this.state.addMoney ?
          <div className="modal">
            <div className="modal-content-sm">
            <button className="close" onClick={this.addMoney}>X</button>
            <form onSubmit={this.updateAccountBalance}>
              <label>enter amount you wish to add to your account</label>
              <input onChange={this.enterAmount} type="text" value={this.state.amount} />
              {
                isNaN(this.state.amount) ?
                <h6> please enter a valid amount </h6>
                :
                <input type="submit" value="update account" />
              }
            </form>
            </div>
          </div>
          :
          null
        }
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    user_id: state.user_id,
    portfolio: state.portfolio,
    accountBalance: state.accountBalance
  }
}

const HOC = connect(mapStateToProps)

export default HOC(Account);
