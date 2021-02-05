const {Octokit} = require('@octokit/core')
const {GITHUB_API_TOKEN} = process.env

/**
 * @typedef {Object} EventObject
 * @property {string} path - Path parameter
 * @property {string} httpMethod - Incoming request’s method name
 * @property {object} headers - Incoming request headers
 * @property {object} queryStringParameters - query string parameters
 * @property {string} body - A JSON string of the request payload.
 * @property {boolean} isBase64Encoded - A boolean flag to indicate if the applicable request payload is Base64-encode
 */
/**
 * @typedef {Object} ResponseObject
 * @property {number} statusCode - the numerical HTTP status code
 * @property {string} body - body content
 * @property {boolean} [isBase64Encoded] - A boolean flag to indicate if the applicable response payload is Base64-encode,
 * @property {Object.<string,string>} [headers] - response headers
 * @property {Object.<string,string[]>} [multiValueHeaders] - headers with multiple parts as an array of strings

 */

/**
 *
 * @param {EventObject} event
 * @param {object} context
 * @returns {Promise<ResponseObject>}
 */
async function searchHandler(event, context) {

  const searchQuery = `query ($q: String!, $cursor: String) {
  search(query: $q, type: USER, first: 12, after: $cursor) {
    userCount
    pageInfo {
      hasNextPage
      hasPreviousPage
      endCursor
      startCursor
    }
    users: nodes {
      ... on User {
        login
        avatarUrl
        name
        company
        bio
        twitterUsername
        url
        websiteUrl
        status {
          message,
        }
        followers: followers(first: 0) {
          totalCount
        }
        following: following(first: 0) {
          totalCount
        }
      }
    }
  }
}`;
  const variables = {
    q: event.queryStringParameters.q,
    cursor: event.queryStringParameters.cursor,
  }
  const octokit = new Octokit({auth: GITHUB_API_TOKEN})

  return {
    statusCode: 200,
    body: JSON.stringify((await octokit.graphql(searchQuery, variables)).search)
  }
}

exports.handler = searchHandler;
