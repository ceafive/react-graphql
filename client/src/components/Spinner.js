import React from "react";
import { AtomSpinner } from "react-epic-spinners";

const Spinner = ({ text = "Checking User State. Please wait..." }) => {
  return (
    <div className="h-screen w-full flex justify-center items-center flex-col">
      <AtomSpinner size={150} color="#f43d" />
      <h1>{text}</h1>
    </div>
  );
};

export default Spinner;
