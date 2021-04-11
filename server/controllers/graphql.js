const { graphqlHTTP } = require('express-graphql')
const schema = require('../schema/schema')

module.exports = graphqlHTTP((req) => ({
  schema,
  context: {
    user: req.user,
  },
  graphiql: true,
}))
