import { CartContext } from "@/components/CartContext";
import { Center } from "@/components/Center";
import FlyingBtn from "@/components/FlyingBtn";
import Header from "@/components/Header";
import ProductImages from "@/components/ProductImages";
import Title from "@/components/Title";
import WhiteBox from "@/components/WhiteBox";
import CartIcon from "@/components/icons/CartIcon";
import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";

import React, { useContext } from "react";

const ProductPage = ({ product }) => {
  const { addProduct } = useContext(CartContext);
  return (
    <>
      <Header />
      <Center>
        <div className="grid grid-cols-1 md:grid-cols-15 gap-10 my-10">
          <WhiteBox>
            <ProductImages images={product.images} />
          </WhiteBox>
          <div>
            <Title classNames={"my-5"} text={product.title} />
            <p>{product.description}</p>
            <div className="">
              <div className="mt-4">
                <span className="text-xl font-semibold">${product.price}</span>
              </div>
              <div>
                <FlyingBtn
                  main={1}
                  _id={product._id}
                  src={product.images?.[0]?.url}
                >
                  <CartIcon />
                  Add to cart
                </FlyingBtn>
              </div>
            </div>
          </div>
        </div>
      </Center>
    </>
  );
};

export default ProductPage;

export async function getServerSideProps(context) {
  await mongooseConnect();
  const { id } = context.query;
  const product = await Product.findById(id);
  return {
    props: {
      product: JSON.parse(JSON.stringify(product)),
    },
  };
}
