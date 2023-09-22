import { Center } from "@/components/Center";
import Header from "@/components/Header";
import Input from "@/components/Input";
import ProductGrid from "@/components/ProductGrid";
import Title from "@/components/Title";
import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import { getServerSession } from "next-auth";
import React, { useState } from "react";
import { authOptions } from "./api/auth/[...nextauth]";
import { WishedProduct } from "@/models/WishedProduct";

const Products = ({ products, wishedProducts }) => {
  const [phrase, setPhrase] = useState("");

  let productsInfo;
  if (phrase) {
    const lowercasePhrase = phrase.toLowerCase();
    productsInfo = products.filter((p) =>
      p.title.toLowerCase().includes(lowercasePhrase)
    );
  } else {
    productsInfo = products;
  }

  return (
    <>
      <Header />
      <Center>
        <Title classNames="my-5" text="All products" />
        <Input
          type="text"
          placeholder="Search a product"
          value={phrase}
          onChange={(event) => setPhrase(event.target.value)}
        />
        <ProductGrid products={productsInfo} wishedProducts={wishedProducts} />
      </Center>
    </>
  );
};

export default Products;

export async function getServerSideProps(context) {
  await mongooseConnect();
  const products = await Product.find({}, null, { sort: { _id: -1 } });
  const session = await getServerSession(context.req, context.res, authOptions);
  const wishedProducts = session?.user
    ? await WishedProduct.find({
        userEmail: session?.user.email,
        product: products.map((p) => p._id.toString()),
      })
    : [];
  return {
    props: {
      products: JSON.parse(JSON.stringify(products)),
      wishedProducts: wishedProducts.map((item) => item.product.toString()),
    },
  };
}
