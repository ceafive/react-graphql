const mongoose = require('mongoose')

const AuthorSchema = new mongoose.Schema({
  name: { type: String, unique: true },
  age: Number,
})

const Author = mongoose.model('Author', AuthorSchema)
module.exports = Author
