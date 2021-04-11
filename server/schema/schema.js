const graphql = require('graphql')
const {
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLError,
  GraphQLUnionType,
} = graphql

const Book = require('../models/book')
const Author = require('../models/author')

const { loginUser, resetPassword, findUserByID } = require('../controllers/user')

const TokenType = new GraphQLObjectType({
  name: 'Token',
  fields: () => ({
    id: { type: GraphQLID },
    token: { type: GraphQLString },
  }),
})

const UserNotFoundErrorType = new GraphQLObjectType({
  name: 'UserNotFoundError',
  fields: () => ({
    errorCode: { type: GraphQLString },
    message: { type: GraphQLString },
  }),
})

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLID },
    username: { type: GraphQLString },
  }),
})

const ActionResultType = (...params) =>
  new GraphQLUnionType({
    name: 'ActionResultType',
    types: () => [...params, UserNotFoundErrorType],
  })

const BookType = new GraphQLObjectType({
  name: 'Book',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    genre: { type: GraphQLString },
    author: {
      type: AuthorType,
      resolve(parent, args) {
        try {
          const found = Author.findById(parent.authorid).exec()
          return found
        } catch (error) {
          console.log(error)
          return {
            statusCode: 400,
            message: 'Not found',
          }
        }
      },
    },
  }),
})

const AuthorType = new GraphQLObjectType({
  name: 'Author',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        try {
          const found = Book.find({ authorid: parent.id }).exec()
          return found
        } catch (error) {
          console.log(error)
          return {
            statusCode: 400,
            message: 'Not found',
          }
        }
      },
    },
  }),
})

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    user: {
      type: ActionResultType(UserType),
      resolve(parent, args, { user }) {
        try {
          // make sure user is logged in
          if (!user) {
            return {
              __typename: 'UserNotFoundError',
              errorCode: 'Authentication Error',
              message: `User is not authenticated!`,
            }
          }
          // user is authenticated
          return findUserByID(user.id)
        } catch (error) {
          console.error(error)
          return error
        }
      },
    },
    book: {
      type: BookType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        // code to get data from db
        try {
          const found = Book.findById(args.id).exec()
          return found
        } catch (error) {
          console.log(error)
          return {
            statusCode: 400,
            message: 'Not found',
          }
        }
      },
    },
    books: {
      type: new GraphQLList(BookType),
      args: { userId: { type: GraphQLString } },
      resolve(parent, { userId }) {
        try {
          const books = Book.find({ addedBy: userId }).exec()
          return books || []
        } catch (error) {
          console.log(error)
        }
      },
    },
    author: {
      type: AuthorType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        try {
          const found = Author.findById(args.id).exec()
          return found
        } catch (error) {
          console.log(error)
          return {
            statusCode: 400,
            message: 'Not found',
          }
        }
      },
    },
    authors: {
      type: new GraphQLList(AuthorType),
      resolve() {
        try {
          const authors = Author.find({}).exec()
          return authors
        } catch (error) {
          console.log(error)
        }
      },
    },
  },
})

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addAuthor: {
      type: AuthorType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
      },
      resolve(parent, args) {
        let author = new Author({
          name: args.name,
          age: args.age,
        })
        // save to db
        return author.save()
      },
    },
    addBook: {
      type: BookType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        genre: { type: new GraphQLNonNull(GraphQLString) },
        authorid: { type: new GraphQLNonNull(GraphQLID) },
        userId: { type: new GraphQLNonNull(GraphQLID) },
      },
      async resolve(parent, args) {
        let book = new Book({
          name: args.name,
          genre: args.genre,
          authorid: args.authorid,
          addedBy: args.userId,
        })

        const { user } = await findUserByID(args.userId)
        user.booksAdded = [...(user.booksAdded || []), book._id]
        await user.save()
        return book.save()
      },
    },
    loginUser: {
      type: TokenType,
      args: {
        username: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parent, { username, password }) {
        return loginUser(username, password)
      },
    },
    resetPassword: {
      type: TokenType,
      args: {
        username: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parent, { username, password }) {
        return resetPassword(username, password)
      },
    },
  },
})

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
})
