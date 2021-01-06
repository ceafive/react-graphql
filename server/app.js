const path = require('path')
const express = require('express')
const cors = require('cors')
const { graphqlHTTP } = require('express-graphql')

const schema = require('./schema/schema')
const { startDB } = require('./utils/db')

const app = express()

// start mongoDB
startDB()

app.use(cors())
app.use('/graphql', graphqlHTTP({ schema, graphiql: true }))

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')))

  app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'))
  })
}

app.listen(4000, () => {
  console.log('Listening on port 4000')
})
