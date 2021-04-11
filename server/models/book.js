const mongoose = require('mongoose')

const BookSchema = new mongoose.Schema({
  name: String,
  genre: String,
  authorid: String,
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
})

const Book = mongoose.model('Book', BookSchema)
module.exports = Book
