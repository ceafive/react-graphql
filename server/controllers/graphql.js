const { graphqlHTTP } = require('express-graphql')
const schema = require('../schema/schema')

module.exports = graphqlHTTP((req) => {
  // console.log({ user: req.user })
  return {
    schema,
    context: {
      user: req.user,
    },
    graphiql: true,
  }
})
