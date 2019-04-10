import React, { Component, Fragment } from 'react'

class Article extends Component {
  state = {
    articles: []
  }

  componentDidMount() {
    fetch(`https://api.iextrading.com/1.0/stock/${this.props.equity.symbol}/news`)
    .then(res => res.json())
    .then( articles => {
      // console.log("%c articles for", "color: pink", this.props.equity, articles);
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

export default Article
