import React from "react";
import { AtomSpinner } from "react-epic-spinners";

const Spinner = () => {
  return (
    <div className="h-screen w-full flex justify-center items-center flex-col">
      <AtomSpinner size={150} color="#f43d" />
      <h1>Checking User State. Please wait...</h1>
    </div>
  );
};

export default Spinner;
