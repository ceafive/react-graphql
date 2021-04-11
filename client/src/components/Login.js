import React from "react";
import { loginUser, forgotPassword } from "../queries/queries";
import { useMutation } from "@apollo/client";
import { isLoggedInVar } from "../utils/apollo-cache";

const initialState = {
  username: "",
  password: "",
};

const Login = () => {
  const [formData, setFormData] = React.useState(initialState);
  const [error, setError] = React.useState({
    status: false,
    error: "",
  });
  const [resetPassword, setResetPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const loginOrResetPassword = (mutation) => {
    const [userMutation, { loading }] = useMutation(mutation, {
      onError(gqlerror) {
        setError({
          status: true,
          error: gqlerror.message,
        });
        setLoading(false);
      },
      onCompleted({ [mutation]: { id, token } }) {
        if (token) {
          localStorage.setItem(
            "graphql-react",
            JSON.stringify({ userId: id, token })
          );
          isLoggedInVar(true);
          setLoading(false);
        }
      },
    });

    return { userMutation, loading };
  };

  const disabledButton = () => {
    let disabled = false;
    Object.values(formData).map((fdata) => {
      if (!fdata || fdata === "Select author") disabled = true;

      return disabled;
    });

    return disabled;
  };

  const validateFields = (username, password) => {
    setError({
      status: false,
      error: "",
    });

    if (!username || !password)
      return setError({
        status: true,
        error: "username or passowrd empty",
      });
  };

  const forgotPassword = (e) => {
    e.preventDefault();
    const { username, password } = formData;
    validateFields(username, password);
    console.log("forgot password");
  };

  const login = (e) => {
    try {
      e.preventDefault();
      const { username, password } = formData;
      validateFields(username, password);

      const { userMutation: loginUserIn, loading } = loginOrResetPassword(
        loginUser
      );

      setLoading(loading);

      loginUserIn({
        variables: {
          username,
          password,
        },
      });

      // getUser({
      //   variables: {
      //     username,
      //     password,
      //   },
      // });
      //   setFormData(initialState);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <div className="w-full max-w-sm">
        <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="username"
            >
              {`Username`}
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="username"
              name="username"
              value={formData.username}
              type="text"
              placeholder="johndoe"
              onChange={(e) => {
                e.persist();
                setFormData((data) => ({
                  ...data,
                  [e.target.name]: e.target.value,
                }));
              }}
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              {resetPassword ? `Enter New Password` : `Password`}
            </label>
            <input
              className={`shadow appearance-none border ${
                !formData.password && "border-red-500"
              } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
              id="password"
              name="password"
              value={formData.password}
              type="password"
              placeholder="*********"
              onChange={(e) => {
                e.persist();
                setFormData((data) => ({
                  ...data,
                  [e.target.name]: e.target.value,
                }));
              }}
            />
            {/* <button>
              <p
                className={`inset-0 flex jusify-end items-center w-full text-right text-xs ${"text-blue-500"}`}
              >
                {"Show"}
              </p>
            </button> */}

            {!formData.password && (
              <p className="text-red-500 text-xs italic">
                Please choose a password
              </p>
            )}
          </div>
          {error.status && (
            <p className="text-red-500 text-xs italic text-center">
              {error.error}
            </p>
          )}
          <div className="flex items-center justify-between">
            <button
              disabled={disabledButton()}
              className={`  ${
                disabledButton()
                  ? "bg-gray-200"
                  : "bg-blue-600 hover:bg-blue-700"
              }  text-white font-thin w-full py-2 px-4 rounded focus:outline-none focus:shadow-outline`}
              type="button"
              onClick={resetPassword ? forgotPassword : login}
            >
              {loading && !resetPassword
                ? "Signing in.."
                : !loading && !resetPassword
                ? `Sign In`
                : "Reset Password"}
            </button>
            <button
              className="text-blue-500 font-thin w-full py-2 px-4 rounded focus:outline-none text-xs"
              type="button"
              onClick={() => {
                resetPassword
                  ? setResetPassword(false)
                  : setResetPassword(true);
              }}
            >
              {resetPassword ? "Login" : "Forgot Password"}
            </button>
          </div>
        </form>
        <p className="text-center text-gray-500 text-xs">
          &copy;2021 Castro Agbo. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Login;
