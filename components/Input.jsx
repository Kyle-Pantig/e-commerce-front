import React from "react";

const Input = (props) => {
  return (
    <input
      className={` w-full p-1 mb-4 border border-gray-400 rounded-md box-border ${
        props.searchInput && " py-1 px-3 rounded-none "
      }  `}
      {...props}
    />
  );
};

export default Input;
