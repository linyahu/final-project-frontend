import React, { Component, Fragment } from 'react'

import { connect } from 'react-redux';

class Article extends Component {
  state = {
    articles: []
  }

  componentDidMount() {
    // fetch(`https://api.iextrading.com/1.0/stock/${this.props.equity.symbol}/news`)
    fetch(`https://cloud.iexapis.com/stable/stock/${this.props.equity.symbol}/news?token=${this.props.api}`)
    .then(res => res.json())
    .then( articles => {
      console.log("%c articles for", "color: pink", articles);
      this.setState({ articles })
    })
  }

  render() {
    // console.log(this.state.articles);
    // console.log("%c why is this hitting?", "color: pink", this.props);
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
