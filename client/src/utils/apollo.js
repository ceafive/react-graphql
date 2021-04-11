import { ApolloClient, gql } from "@apollo/client";
import { cache } from "../utils/apollo-cache";

export const typeDefs = gql`
  extend type Query {
    isLoggedIn: Boolean!
  }
`;

const api = () => {
  let uri = "";
  if (process.env.NODE_ENV === "production")
    uri = "https://react-apollo-express-graphql.herokuapp.com/graphql";
  else uri = "http://localhost:4000/graphql";
  return uri;
};

const authorization = () => {
  const bearer = `Bearer `;
  let graphqlReact = localStorage.getItem("graphql-react");

  graphqlReact = !graphqlReact ? "" : JSON.parse(graphqlReact).token;
  return bearer + graphqlReact;
};

const client = new ApolloClient({
  uri: api(),
  cache,
  headers: {
    authorization: authorization(),
  },
  typeDefs,
});

export default client;
