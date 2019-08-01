import React, { Component, Fragment } from 'react'

import { connect } from 'react-redux';

class Article extends Component {
  state = {
    articles: []
  }

  componentDidMount() {
    fetch(`https://cloud.iexapis.com/stable/stock/${this.props.equity.symbol}/news?token=${this.props.api}`)
    .then(res => res.json())
    .then( articles => {
      this.setState({ articles })
    })
  }

  render() {

    return(
      <Fragment>
      {
        this.state.articles.map( article => {
          return (
            <div key={article.headline} className="article">
              <a href={article.url}>{article.headline}</a>
              <h5>{article.summary}</h5>
            </div>
          )
        })
      }
      </Fragment>
    )
  }

}

function mapStateToProps(state) {
  return {
    iex: state.iex,
    version: state.version,
    api: state.api
  }
}

const HOC = connect(mapStateToProps)

export default HOC(Article);
