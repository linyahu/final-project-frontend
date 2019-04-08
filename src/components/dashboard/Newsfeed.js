import React, { Component } from 'react'

import Article from './Article'

class Newsfeed extends Component {
  // gonna get the stocks as props


  render() {
    return (
      <div className="newsfeed">
        <h4>newsfeed</h4>
        {
          this.props.equities.map( equity => {
            return <Article equity={equity}/>
          })
        }
      </div>
    )
  }
}

export default Newsfeed
