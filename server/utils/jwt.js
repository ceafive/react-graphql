const jwt = require('express-jwt')
const jsonwebtoken = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const signToken = (id, username) => jsonwebtoken.sign({ id, username }, process.env.JWT_SECRET, { expiresIn: '1d', algorithm: 'HS256' })
const compare = (password, userPassword) => bcrypt.compare(password, userPassword)
const hash = (password) => bcrypt.hash(password, 10)

const authenticate = jwt({
  secret: process.env.JWT_SECRET,
  credentialsRequired: false,
  getToken: (req) => {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      return req.headers.authorization.split(' ')[1]
    } else if (req.query && req.query.token) {
      return req.query.token
    }
    return null
  },
  algorithms: ['HS256'],
})

module.exports = {
  signToken,
  compare,
  hash,
  authenticate,
}
