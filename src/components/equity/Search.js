import React, { Component } from 'react'

import EquityProfile from './EquityProfile'

import { connect } from 'react-redux';

class Search extends Component {
  state = {
    equities: [],
  }

  componentDidMount() {
    let search = this.props.term.split('%20').join(' ')
    fetch("http://localhost:3000/api/v1/equities")
    .then(res => res.json())
    .then(json => {
      let equities = json.filter( eq => eq.symbol.toLowerCase().includes(search) || eq.company_name.toLowerCase().includes(search))
      this.setState({ equities })
    })
  }


  render() {
    console.log("what are my props", this.props);
    return (
      <div>
        {
          this.state.equities.map(equity => {
            return (
              <EquityProfile
                key={equity.id}
                equity={equity}
              />
            )
          })
        }
      </div>
    )
  }

} // end of Search Component

function mapStateToProps(state) {
  return {
    user_id: state.user_id,
    search: state.search,
  }
}

const HOC = connect(mapStateToProps)

export default HOC(Search);
