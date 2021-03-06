const jwt = require('express-jwt')

module.exports = {
  authenticate: jwt({
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
  }),
}
