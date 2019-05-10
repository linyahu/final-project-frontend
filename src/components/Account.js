import React, { Component } from 'react'

import { connect } from 'react-redux';

class Account extends Component {
  state = {
    user: {},
    addMoney: false,
    amount: 0,
    edit: false,
  }


  /**********************************************
          CHANGE STATE / EVENT FUNCTIONS
  **********************************************/
  toggleModal = (e) => {
    let name = e.target.name
    this.setState( prevState => {
      return { [name]: !prevState[name] }
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

    fetch(`${this.props.url}/api/v1/portfolios/${this.props.portfolio.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Accepts": "application/json"
      },
      body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(json => {

      this.setState({ addMoney: false, amount: 0 })

      this.props.dispatch({ type: "SET_PORTFOLIO", payload: json })
      this.props.dispatch({ type: "SET_ACCOUNT_BALANCE", payload: json.account_balance })
    })
  }


  /**********************************************
                LIFECYCLE FUNCTIONS
  **********************************************/

  componentDidMount() {
    this.props.hideNavBar()

    fetch(`${this.props.url}/api/v1/users`)
    .then(res => res.json())
    .then(json => {
      let user = json.find(u => u.id === this.props.user_id)
      this.setState({ user })
    })
  }

  /**********************************************
                RENDER FUNCTIONS
  **********************************************/
  renderAddMoney = () => {
    return (
      <div className="modal">
        <div className="modal-content-sm">
        <button className="close" name="addMoney" onClick={this.toggleModal}>X</button>
        <br />
        <br />
        <br />
        <br />
        <form onSubmit={this.updateAccountBalance}>
          <label>enter amount you wish to add to your account</label>
          <br />
          <br />
          <br />
          <input className="input-field-light" onChange={this.enterAmount} type="text" value={this.state.amount} />
          <br />
          <br />
          {
            isNaN(this.state.amount) ?
            <h6> please enter a valid amount </h6>
            :
            <input className="search-btn" type="submit" value="update account" />
          }
        </form>
        </div>
      </div>
    )
  }


  render() {
    return (
      <div className="landing-plain">
      <div className="account-details">
      <label> profile </label>
        <table className="account-table">
          <tr>
            <td className="account-label">first name: </td>
            <td className="account-data"> {this.state.user.first_name} </td>
          </tr>
          <tr>
            <td className="account-label">last name: </td>
            <td className="account-data"> {this.state.user.last_name} </td>
          </tr>
          <tr>
            <td className="account-label">username: </td>
            <td className="account-data"> {this.state.user.username} </td>
          </tr>
          <tr>
            <td className="account-label">email: </td>
            <td className="account-data"> {this.state.user.email} </td>
          </tr>
        </table>
        <br />
        <br />
        <label> account statistics </label>
        <table className="account-table">
          <tr>
            <td className="account-label">active portfolio: </td>
            <td className="account-data"> { !!this.props.portfolio.subportfolios &&  this.props.portfolio.subportfolios.length === 0 ? "no" : "yes"} </td>
          </tr>
          <tr>
            <td className="account-label">open trades: </td>
            <td className="account-data"> { !!this.props.portfolio.subportfolios && this.props.portfolio.subportfolios.filter( p => !p.date_sold ).length} </td>
          </tr>
          <tr>
            <td className="account-label">dashboards: </td>
            <td className="account-data"> {this.props.dashboards.length - 1} </td>
          </tr>
          <tr>
            <td className="account-label"> account balance: </td>
            <td className="account-data"> ${this.props.accountBalance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }</td>
          </tr>
        </table>
        <br />
        <br />
        <br />
        <button className="trade-btn" name="addMoney" onClick={this.toggleModal}> add money to your account </button>
        {
          this.state.addMoney ?
          this.renderAddMoney()
          :
          null
        }
      </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    user_id: state.user_id,
    dashboards: state.dashboards,
    portfolio: state.portfolio,
    portfolioEquities: state.portfolioEquities,
    accountBalance: state.accountBalance,
    url: state.url,
  }
}

const HOC = connect(mapStateToProps)

export default HOC(Account);
