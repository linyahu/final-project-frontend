// detail for EACH stock
import React, { Component, Fragment } from 'react';

class DetailCard extends Component {
  state = {
    currentPrice: 0,
    currentValue: 0,
  }

  componentDidMount() {
    let t = new Date()
    let d = (t.getFullYear() -1) + "-" + (t.getMonth() +1) + "-" + t.getDate()
    if (this.props.subportfolio.date_bought > d) {
      this.fetchOneYearTradingData()
    } else {
      this.fetchFiveYearTradingData()
    }
    this.fetchPrice()
  }

  fetchFiveYearTradingData() {
    fetch(`https://api.iextrading.com/1.0/stock/${this.props.subportfolio.equity.symbol}/chart/5y`)
    .then(res => res.json())
    .then(json => {
      console.log(json);
    })
  }

  fetchOneYearTradingData() {
    fetch(`https://api.iextrading.com/1.0/stock/${this.props.subportfolio.equity.symbol}/chart/1y`)
    .then(res => res.json())
    .then(json => {
      let data = json.filter(data => data.date >= this.props.subportfolio.date_bought)
      console.log(json, data);
    })
  }

  fetchPrice() {
    fetch(`https://api.iextrading.com/1.0/stock/${this.props.subportfolio.equity.symbol}/price`)
    .then(res => res.json())
    .then(json => {
      this.setState({
        currentPrice: json,
        currentValue: Math.round(json * this.props.subportfolio.quantity * 100)/100
      })
    })
  }


  render() {
    console.log("props in detailcard", this.props);
    console.log("%c state", "color: pink", this.state);
    return (
      <div className="details">
        <h6 >{this.props.subportfolio.equity.company_name}
        <br />
        <br />
        last px: ${this.state.currentPrice} |
        value: ${this.state.currentValue} |
        $change: { Math.round((this.state.currentValue - this.props.subportfolio.initial_value)*100)/100 } |
        %change: {Math.round((this.state.currentPrice/this.props.subportfolio.initial_px - 1)*10000)/100} </h6 >
      </div>
    )
  }
}

export default DetailCard


// <h5>qty: {this.props.subportfolio.quantity} </h5>
// <h5>initial price: {this.props.subportfolio.initial_px} </h5>
// <h5>initial value: {this.props.subportfolio.initial_value} </h5>
