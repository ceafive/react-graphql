const path = require('path')
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const dotenv = require('dotenv').config()

const { startDB } = require('./utils/db')
const { authenticate } = require('./utils/jwt')
const graphqlServer = require('./controllers/graphql')

const app = express()

// start mongoDB
startDB()

app.use(cors())
morgan.token('authorization', (req, res) => req.headers['authorization'])
morgan.token('queryparam', (req, res) => {
  const { query } = req
  return query.userId
})
app.disable('x-powered-by')

app.use(morgan('tiny'))
app.use(morgan(':method :queryparam'))

app.use('/graphql', express.json(), authenticate, graphqlServer)

// console.log(path.join(__dirname, 'client'))

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.resolve(__dirname, 'client/build')))

  app.get(/.*/, (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client/build', 'index.html'))
  })
}

const PORT = process.env.PORT || 4000

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})
