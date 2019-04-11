import React, { Component } from 'react'

class Financials extends Component {
  state ={
    data: []
  }

  componentDidMount() {
    fetch(`https://api.iextrading.com/1.0/stock/${this.props.ticker}/financials`)
    .then(res => res.json())
    .then(json => {
      this.setState({
        data: json.financials
      })
    })
  }

  renderTable() {
    return (
      <table className="financials">
        <tbody>
        <tr>
          <th></th>
          {this.state.data.map(report => <th>{report.reportDate}</th>)}
        </tr>
        <tr>
        <td>Operating Revenue</td>
        {this.state.data.map(report => <td>${(Math.round(report.operatingRevenue/100000)/10).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}m</td>)}
        </tr>
        <tr>
        <td>Cost of Revenue</td>
        {this.state.data.map(report => <td>${(Math.round(report.costOfRevenue/100000)/10).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}m</td>)}
        </tr>
        <tr>
          <td>Gross Profit</td>
          {this.state.data.map(report => <td>${(Math.round(report.grossProfit/100000)/10).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}m</td>)}
        </tr>
        <tr>
          <td>Operating Expense</td>
          {this.state.data.map(report => <td>${(Math.round(report.operatingExpense/100000)/10).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}m</td>)}
        </tr>
        <tr>
        <td>Operating Income</td>
        {this.state.data.map(report => <td>${(Math.round(report.operatingIncome/100000)/10).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}m</td>)}
        </tr>
        <tr>
          <td>R&D</td>
          {this.state.data.map(report => <td>${(Math.round(report.researchAndDevelopment/100000)/10).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}m</td>)}
        </tr>
        <tr>
          <td>Net Income</td>
          {this.state.data.map(report => <td>${(Math.round(report.netIncome/100000)/10).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}m</td>)}
        </tr>
        <tr>
          <td>Total Assets</td>
          {this.state.data.map(report => <td>${(Math.round(report.totalAssets/100000)/10).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}m</td>)}
        </tr>
        <tr>
          <td>Total Cash</td>
          {this.state.data.map(report => <td>${(Math.round(report.totalCash/100000)/10).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}m</td>)}
        </tr>
        <tr>
          <td>Total Liabilities</td>
          {this.state.data.map(report => <td>${(Math.round(report.totalLiabilities/100000)/10).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}m</td>)}
        </tr>
        <tr>
          <td>Shareholder Equity</td>
          {this.state.data.map(report => <td>${(Math.round(report.shareholderEquity/100000)/10).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}m</td>)}
        </tr>
        <tr>
          <td>Current Assets</td>
          {this.state.data.map(report => <td>${(Math.round(report.currentAssets/100000)/10).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}m</td>)}
        </tr>
        <tr>
          <td>Current Cash</td>
          {this.state.data.map(report => <td>${(Math.round(report.currentCash/100000)/10).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}m</td>)}
        </tr>
        <tr>
          <td>Current Debt</td>
          {this.state.data.map(report => <td>${(Math.round(report.currentDebt/100000)/10).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}m</td>)}
        </tr>
        <tr>
          <td>Cash Flow</td>
          {this.state.data.map(report => <td>${(Math.round(report.cashFlow/100000)/10).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}m</td>)}
        </tr>
        </tbody>
      </table>
    )
  }

  render() {
    console.log(this.state.data);
    return (
      <div className="modal">
        <div className="modal-content">
          <button name="showFinancials" onClick={this.props.closeDetails} className="close">X</button>
          { this.renderTable() }
        </div>
      </div>
    )
  }

}

export default Financials
