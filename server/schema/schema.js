const graphql = require('graphql')

const Book = require('../models/book')
const Author = require('../models/author')

const { GraphQLNonNull, GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLID, GraphQLInt, GraphQLList } = graphql

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
    books: {
      type: new GraphQLList(BookType),
      resolve() {
        try {
          const books = Book.find({}).exec()
          return books
        } catch (error) {
          console.log(error)
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
      },
      resolve(parent, args) {
        let book = new Book({
          name: args.name,
          genre: args.genre,
          authorid: args.authorid,
        })
        return book.save()
      },
    },
  },
})

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
})
