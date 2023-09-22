import React from "react";

const Title = ({ text, classNames }) => {
  return <h1 className={`text-3xl font-bold ${classNames}`}>{text}</h1>;
};

export default Title;
