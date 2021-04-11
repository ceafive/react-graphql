import React from "react";
import { useQuery } from "@apollo/client";
import { getBookQuery } from "../queries/queries";

const BookDetails = ({ bookId }) => {
  const { loading, data } = useQuery(getBookQuery, {
    variables: { id: bookId },
  });

  const displayBookDetails = () => {
    if (!data) return null;

    // console.log({ data });
    const { book } = data;
    if (!loading) {
      return (
        <div>
          <h2 className="font-bold text-2xl">{book.name}</h2>
          <p className="font-thin">{book.genre}</p>
          <p>{book.author.name}</p>
          <p className="mt-6">All books by this author:</p>
          <ul className="list-disc list-inside">
            {book.author.books.map((item) => {
              return (
                <li className="" key={item.id}>
                  {item.name}
                </li>
              );
            })}
          </ul>
        </div>
      );
    } else {
      return <div>No book selected...</div>;
    }
  };

  return <div id="book-details">{displayBookDetails()}</div>;
};

export default BookDetails;
