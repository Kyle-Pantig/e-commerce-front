import React from "react";

const Button = (props) => {
  return (
    <button
      {...props}
      className={`btn-primary 
      ${
        props.wished
          ? " absolute top-0 right-0 wished "
          : " absolute top-0 right-0 wished "
      } ${
        props.primary && " relative bg-black text-white block w-full large-btn "
      }`}
    />
  );
};

export default Button;
