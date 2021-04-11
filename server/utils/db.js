const mongoose = require('mongoose')
const colors = require('colors')

const URI = process.env.MONGO_URI

const startDB = () => {
  mongoose
    .connect(URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    })
    .then((e) => {
      console.log(colors.green.bold('Connected to DB'))
    })
    .catch((err) => {
      console.error(colors.red.bold(err))
    })

  mongoose.connection.on('error', (err) => {
    console.error(colors.red.bold(err))
  })
}

module.exports = { startDB }
