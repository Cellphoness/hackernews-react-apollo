import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { FEED_QUERY } from './LinkList'

class CreateLink extends Component {
  state = {
    description: '',
    url: '',
  }

  render() {
    return (
      <div>
        <div className="flex flex-column mt3">
          <input
            className="mb2"
            value={this.state.description}
            onChange={e => this.setState({ description: e.target.value })}
            type="text"
            placeholder="A description for the link"
          />
          <input
            className="mb2"
            value={this.state.url}
            onChange={e => this.setState({ url: e.target.value })}
            type="text"
            placeholder="The URL for the link"
          />
        </div>
        <button onClick={() => this._createLink()}>Submit</button>
      </div>
    )
  }

  _createLink = async () => {
    // ... you'll implement this in a bit
    const { description, url } = this.state
    if (description.length && url.length) {
        try {
            let response = await this.props.postMutation({
                variables: {
                description,
                url
                },
                update: (store, {data: {postLink}}) => {
                  const data = store.readQuery({ query: FEED_QUERY })
                  data.feed.links.splice(0, 0, postLink)
                  store.writeQuery({
                    query: FEED_QUERY,
                    data,
                  })
                }
            })
            console.log(response.data.postLink)
            this.props.history.push('/')
        } catch (error) {
            alert(error) 
        }
        // this.props.postMutation({
        //     variables: {
        //     description,
        //     url
        //     }
        // }).then((response) => console.log(response.data.postLink)).catch((error) => alert(error))
    } else {
        alert('description or url can not be empty')
    }
  }
  
}
// 1
const POST_MUTATION = gql`
  # 2
  mutation PostMutation($description: String!, $url: String!) {
    postLink(description: $description, url: $url) {
      id
      createdAt
      url
      description
    }
  }
`

// 3
export default graphql(POST_MUTATION, { name: 'postMutation' })(CreateLink)
