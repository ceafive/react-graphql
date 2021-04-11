import { InMemoryCache, makeVar } from "@apollo/client";

export const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        isLoggedIn: {
          read() {
            return isLoggedInVar();
          },
        },
      },
    },
  },
});

const getToken = localStorage.getItem("graphql-react")
  ? !!JSON.parse(localStorage.getItem("graphql-react")).token
  : false;

export const isLoggedInVar = makeVar(getToken);
