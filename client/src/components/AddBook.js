import React from "react";
import { useQuery, useMutation } from "@apollo/client";
import {
  getAuthorsQuery,
  addBookMutation,
  getBooksQuery,
} from "../queries/queries";
import LogoutButton from "./LogoutButton";

import { useApolloClient } from "@apollo/client";
import { isLoggedInVar } from "../utils/apollo-cache";

const initialState = {
  name: "",
  genre: "",
  authorid: "",
};

const AddBook = () => {
  const userId = localStorage.getItem("graphql-react")
    ? JSON.parse(localStorage.getItem("graphql-react")).userId
    : "";

  const client = useApolloClient();

  const [formData, setFormData] = React.useState(initialState);
  const { loading, data } = useQuery(getAuthorsQuery);
  const [addBook] = useMutation(addBookMutation);

  const disabledButton = () => {
    let disabled = false;
    Object.values(formData).map((fdata) => {
      if (!fdata || fdata === "Select author") disabled = true;

      return disabled;
    });

    return disabled;
  };

  const displayAuthors = () => {
    if (loading) {
      return <option disabled>Loading authors</option>;
    } else {
      return data.authors.map((author) => {
        return (
          <option key={author.id} value={author.id}>
            {author.name}
          </option>
        );
      });
    }
  };

  const submitForm = (e) => {
    e.preventDefault();
    // use the addBookMutation
    addBook({
      variables: {
        name: formData.name,
        genre: formData.genre,
        authorid: formData.authorid,
        userId,
      },
      refetchQueries: [{ query: getBooksQuery, variables: { userId } }],
    });
    setFormData(initialState);
  };

  return (
    <div className="relative">
      <form id="add-book" className="author-form">
        <div className="field">
          <label>Book name:</label>
          <input
            className="border border-gray-500 focus:outline-none rounded-md"
            type="text"
            value={formData.name}
            onChange={(e) => {
              e.persist();
              setFormData((data) => ({ ...data, name: e.target.value }));
            }}
          />
        </div>
        <div className="field">
          <label>Genre:</label>
          <input
            className="border border-gray-500 focus:outline-none rounded-md"
            type="text"
            value={formData.genre}
            onChange={(e) => {
              e.persist();
              setFormData((data) => ({ ...data, genre: e.target.value }));
            }}
          />
        </div>
        <div className="field">
          <label>Author:</label>
          <select
            className="border border-gray-500 focus:outline-none rounded-md"
            onChange={(e) => {
              e.persist();
              setFormData((data) => ({ ...data, authorid: e.target.value }));
            }}
          >
            <option>Select author</option>
            {displayAuthors()}
          </select>
        </div>
        <div className="flex w-full justify-between items-center">
          <button
            className={`flex justify-center items-center ${
              disabledButton() ? "bg-gray-200" : "bg-green-500"
            } p-6 w-10 h-10 font-bold text-2xl rounded-full text-white focus:outline-none hover:ring-4 hover:ring-green-500 hover:ring-opacity-50`}
            disabled={disabledButton()}
            onClick={submitForm}
          >
            +
          </button>
          <LogoutButton
            onClick={(e) => {
              e.preventDefault();
              const ids = client.cache.gc();
              // console.log({ ids });
              // Remove user details from localStorage
              localStorage.removeItem("graphql-react");
              // Set the logged-in status to false
              isLoggedInVar(false);
            }}
            className="flex justify-center items-center px-4 py-2 text-2xl text-white focus:outline-none bg-red-500 hover:bg-red-700"
          />
        </div>
      </form>
    </div>
  );
};

export default AddBook;
