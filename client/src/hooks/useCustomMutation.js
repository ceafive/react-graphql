import React from "react";
import { useMutation } from "@apollo/client";
import { isLoggedInVar } from "../utils/apollo-cache";

const useLoginOrResetPassword = (
  mutationName,
  mutation,
  setLoading,
  setError
) => {
  const [userMutation, { loading }] = useMutation(mutation, {
    onError(gqlerror) {
      setError({
        status: true,
        error: gqlerror.message,
      });
    },
    onCompleted({ [mutationName]: { id, token } }) {
      if (token) {
        localStorage.setItem(
          "graphql-react",
          JSON.stringify({ userId: id, token })
        );
        isLoggedInVar(true);
      }
    },
  });

  React.useEffect(() => {
    setLoading(loading);
  }, [loading]);

  return { userMutation };
};

export default useLoginOrResetPassword;
