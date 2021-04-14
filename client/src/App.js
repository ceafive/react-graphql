import React from "react";
import { useQuery } from "@apollo/client";

// components
import BookList from "./components/BookList";
import AddBook from "./components/AddBook";
import Login from "./components/Login";
import Spinner from "./components/Spinner";

import { isUserLoggedIn } from "./queries/queries";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const { loading, data } = useQuery(isUserLoggedIn);

  React.useEffect(() => {
    if (data) {
      const { isLoggedIn } = data;

      if (!isLoggedIn) {
        setIsLoggedIn(isLoggedIn);
      }
      if (isLoggedIn) {
        setIsLoggedIn(isLoggedIn);
      }
    }
  }, [data]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <div id="main" className="h-screen w-full">
      {!isLoggedIn && <Login />}
      {isLoggedIn && (
        <React.Fragment>
          <h1>My Reading List</h1>
          <BookList />
          <AddBook />
        </React.Fragment>
      )}
    </div>
  );
};

export default App;
