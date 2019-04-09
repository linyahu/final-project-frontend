import React, { Component } from 'react'

import Article from './Article'

class Newsfeed extends Component {
  // receives Equities as props

  render() {
    return (
      <div className="newsfeed">
        {
          !!this.props.delete ?
          <button onClick={this.props.delete}>X</button>
          :
          null
        }
        <h4>newsfeed</h4>
        {
          this.props.equities.map( equity => {
            return <Article key={equity.id} equity={equity}/>
          })
        }
      </div>
    )
  }
}

export default Newsfeed
