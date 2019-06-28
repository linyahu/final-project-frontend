import React, { Component, Fragment } from 'react'

import Equity from '../equity/Equity'

import { connect } from 'react-redux';

class SmallCard extends Component {
  state = {
    stats: {},
  }

  componentDidMount() {
    this.fetchStats()
  }

  fetchStats = () => {
    if(!this.state.stats.length){
      // fetch(`https://api.iextrading.com/1.0/stock/${this.props.ticker}/quote`)
      fetch(`https://cloud.iexapis.com/stable/stock/${this.props.ticker}/ohlc?token=${this.props.api}`)
      .then(res => res.json())
      .then(json => {
        // console.log("wtf!??!??!", json);
        this.setState({
          stats: {
            open: json.open.price,
            close: json.close.price,
            high: json.high,
            low: json.low,
          }
        })
      })
    }
  }

  renderDetails() {
    return (
      <div className="back">
        <h6>
          Open: {this.state.stats.open}
          <br />
          Close: {this.state.stats.close}
          <br />
          High: {this.state.stats.high}
          <br />
          Low: {this.state.stats.low}
        </h6>
      </div>
    )
  }

  render() {
    console.log("state in small card", this.state.stats);
    return (
      <div className="sm-card">
        <h5>{this.props.name}</h5>
        <h6>{this.props.equity.sector}</h6>
        {
          this.renderDetails()
        }

        <div className="front">
          <Equity
            ticker={this.props.ticker}
            noStats={true}
          />

        </div>

      </div>
    )
  }


}

function mapStateToProps(state) {
  return {
    api: state.api
  }
}

const HOC = connect(mapStateToProps)

export default HOC(SmallCard);
