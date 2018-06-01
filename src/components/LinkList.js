import React, { Component } from 'react'
import Link from './Link'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

class LinkList extends Component {
  _updateCacheAfterVote = (store, createVote, linkId) => {
    // 1
    const data = store.readQuery({ query: FEED_QUERY })
  
    // 2
    const votedLink = data.feed.links.find(link => link.id === linkId)
    votedLink.votes = createVote.link.votes
  
    // 3
    store.writeQuery({ query: FEED_QUERY, data })
  }

  render() {
    const { feedQuery } = this.props;
    if (feedQuery && feedQuery.loading) {
      return (
        <div>Loading</div>
      )
    }
    if (this.props.feedQuery && this.props.feedQuery.error) {
      return <div>Error</div>
    }
    const linksToRender = feedQuery.feed.links;
    return (
      <div>{linksToRender.map((link, index) => <Link key={link.id} updateStoreAfterVote={this._updateCacheAfterVote} index={index} link={link} />)}</div>
    )
  }
}
// Promise query

// client.query({
//   query: gql`
//     query FeedQuery {
//       feed {
//         links {
//           id
//         }
//       }
//     }
//   `
// }).then(response => console.log(response.data.allLinks))

// 1
const FEED_QUERY = gql`
  # 2
  query FeedQuery {
    feed {
      links {
        id
        createdAt
        url
        description
        postedBy {
          id
          name
        }
        votes {
          id
          user {
            id
          }
        }
      }
    }
  }
`
export {FEED_QUERY}
// 3
export default graphql(FEED_QUERY, { name: 'feedQuery' }) (LinkList)