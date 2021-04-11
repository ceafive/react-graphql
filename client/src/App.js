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
  // const [isLoggedIn, setIsLoggedIn] = React.useState(true);
  // const { loading, error, data } = useQuery(getUserDetails, {
  //   // pollInterval: !isLoggedIn ? 2000 : 0,
  // });

  React.useEffect(() => {
    if (data) {
      // const {
      //   user: { errorCode, username },
      // } = data;
      const { isLoggedIn } = data;

      if (!isLoggedIn) {
        setIsLoggedIn(false);
      }
      if (isLoggedIn) {
        setIsLoggedIn(true);
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
