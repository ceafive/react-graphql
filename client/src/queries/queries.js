import { gql } from "@apollo/client";

const getAuthorsQuery = gql`
  query GetAllAuthors {
    authors {
      name
      id
    }
  }
`;

const getBookQuery = gql`
  query GetBook($id: ID) {
    book(id: $id) {
      id
      name
      genre
      author {
        id
        name
        age
        books {
          name
          id
        }
      }
    }
  }
`;

const getBooksQuery = gql`
  query GetUserBooks($userId: String!) {
    books(userId: $userId) {
      id
      name
    }
  }
`;

const addBookMutation = gql`
  mutation AddBook(
    $name: String!
    $genre: String!
    $authorid: ID!
    $userId: ID!
  ) {
    addBook(name: $name, genre: $genre, authorid: $authorid, userId: $userId) {
      name
      id
    }
  }
`;

const loginUser = gql`
  mutation LoginUser($username: String!, $password: String!) {
    loginUser(username: $username, password: $password) {
      id
      token
    }
  }
`;

const forgotPassword = gql`
  mutation LoginUser($username: String!, $password: String!) {
    resetPassword(username: $username, password: $password) {
      id
      token
    }
  }
`;
const getUserDetails = gql`
  query GetUser {
    user {
      ... on UserNotFoundError {
        errorCode
        message
      }

      ... on User {
        id
        username
        booksAdded {
          id
          name
          genre
          author {
            id
            name
            age
            books {
              id
              name
            }
          }
        }
      }
    }
  }
`;

const isUserLoggedIn = gql`
  query IsUserLoggedIn {
    isLoggedIn @client
  }
`;

export {
  getAuthorsQuery,
  getBooksQuery,
  addBookMutation,
  getBookQuery,
  loginUser,
  getUserDetails,
  isUserLoggedIn,
  forgotPassword,
};
