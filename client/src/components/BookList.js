import React from "react";
import { useQuery } from "@apollo/client";
import { getBooksQuery } from "../queries/queries";

// components
import BookDetails from "./BookDetails";
import Spinner from "./Spinner";

const BookList = () => {
  const [selected, setSelected] = React.useState(null);

  const userId = localStorage.getItem("graphql-react")
    ? JSON.parse(localStorage.getItem("graphql-react")).userId
    : "";

  const { loading, data } = useQuery(getBooksQuery, {
    variables: { userId },
    onError(error) {
      console.log(error);
    },
  });

  const displayBooks = () => {
    if (loading || !data) {
      return <Spinner text="Loading..." />;
    } else {
      return data.books.map((book) => {
        return (
          <li
            className="transition-all duration-300 ease-in-out text-brand-mauve hover:text-white hover:bg-brand-mauve"
            key={book.id}
            onClick={(e) => setSelected(book.id)}
          >
            {book.name}
          </li>
        );
      });
    }
  };

  return (
    <div>
      <ul id="book-list">{displayBooks()}</ul>
      {selected && <BookDetails bookId={selected} />}
    </div>
  );
};

export default BookList;
