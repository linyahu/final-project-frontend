// summary of portfolio performance history
import React, { Component, Fragment } from 'react';

class Summary extends Component {
  state = {
  }

  componentDidMount() {
    let t = new Date()
    let d = (t.getFullYear() -1) + "-" + (t.getMonth() +1) + "-" + t.getDate()

    this.props.subportfolios.map( eq => {
      console.log(eq);
      if (eq.date_bought > d) {
        this.fetchOneYearTradingData()
      } else {
        this.fetchFiveYearTradingData()
      }

      // this.fetchData(equity)
    })
  }

  fetchData = (equity) => {
    fetch()
    .then(res => res.json())
    .then(json => {

    })
  }

  fetchOneYearTradingData() {

  }

  fetchFiveYearTradingData() {

  }

  sumObjectsByKey(...objs) {
    return objs.reduce((a, b) => {
      for (let k in b) {
        if (b.hasOwnProperty(k))
          a[k] = (a[k] || 0) + b[k];
      }
      return a;
    }, {});
  }

  render() {
    console.log("%c props in my summary company", "color: blue", this.props);
    return (
      <div className="grey-border portfolio-card">
        <h4>Summary Component </h4>
      </div>
    )
  }
}

export default Summary
