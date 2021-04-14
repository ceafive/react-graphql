const jsonwebtoken = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const signToken = (id, username) => jsonwebtoken.sign({ id, username }, process.env.JWT_SECRET, { algorithm: 'HS256' })
const compare = (password, userPassword) => bcrypt.compare(password, userPassword)
const hash = (password) => bcrypt.hash(password, 10)

module.exports = {
  signToken,
  compare,
  hash,
}
