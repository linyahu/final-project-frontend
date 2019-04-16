import React, { Component } from 'react'

import Article from './Article'

class Newsfeed extends Component {
  // receives Equities as props

  render() {
    // console.log("props in newsfeed?", this.props);
    return (
        <div className={this.props.class}>
        {
          !!this.props.delete ?
          <button className="delete-btn" onClick={this.props.delete}>X</button>
          :
          null
        }
        <h3>newsfeed</h3>
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
