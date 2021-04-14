const { signToken, compare, hash } = require('../utils/jwt')
const User = require('../models/user')

const loginUser = async (username, password) => {
  try {
    let currentUser = await User.findOne({ username })

    if (!currentUser) {
      currentUser = await User.create({
        username,
        password: await hash(password, 10),
      })
      // return json web token
      const token = signToken(currentUser._id, currentUser.username)
      return { id: currentUser._id, token }
    }

    const valid = await compare(password, currentUser.password)
    if (!valid) {
      throw new Error('Incorrect password')
    }

    // return json web token
    const token = signToken(currentUser._id, currentUser.username)
    // console.log({ id: currentUser._id, token })
    return { id: currentUser._id, token }
  } catch (error) {
    console.log(error)
    return error
  }
}

const resetPassword = async (username, password) => {
  try {
    let currentUser = await User.findOne({ username })

    if (!currentUser) {
      throw new Error('User does not exist')
    }

    const newPassword = await hash(password, 10)
    currentUser.password = newPassword
    await currentUser.save()

    // return json web token
    const token = signToken(currentUser._id, currentUser.username)
    return { id: currentUser._id, token }
  } catch (error) {
    console.log(error)
    return error
  }
}

const findUserByID = async (id) => {
  const result = await User.findById(id)

  await result.populate('booksAdded').execPopulate()
  result.populated('booksAdded')

  return { __typename: 'User', user: result, id: result._id, username: result.username, booksAdded: result.booksAdded }
}

module.exports = {
  loginUser,
  resetPassword,
  findUserByID,
}
