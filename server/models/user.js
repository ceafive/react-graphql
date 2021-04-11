const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    minlength: 5,
  },
  password: String,
  booksAdded: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
    },
  ],
})

UserSchema.plugin(uniqueValidator)
const User = mongoose.model('User', UserSchema)

module.exports = User
