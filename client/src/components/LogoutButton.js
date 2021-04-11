import React from "react";

const LogoutButton = ({ className, ...rest }) => {
  return (
    <button className={`${className} `} {...rest}>
      <ion-icon name="exit-outline" size="small"></ion-icon>
    </button>
  );
};
export default LogoutButton;
