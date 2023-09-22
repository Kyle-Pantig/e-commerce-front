import React from "react";
import { Center } from "./Center";
import ProductBox from "./ProductBox";
import ProductGrid from "./ProductGrid";

const NewProducts = ({ products, wishedProducts }) => {
  return (
    <Center>
      <h2 className=" text-4xl mt-8 mx-0 mb-5">New Arrivals</h2>
      <ProductGrid products={products} wishedProducts={wishedProducts} />
    </Center>
  );
};

export default NewProducts;
