import { Center } from "@/components/Center";
import Header from "@/components/Header";
import ProductBox from "@/components/ProductBox";
import Title from "@/components/Title";
import { Category } from "@/models/Category";
import { Product } from "@/models/Product";
import { RevealWrapper } from "next-reveal";
import Link from "next/link";
import React from "react";
import { mongooseConnect } from "@/lib/mongoose";
import { WishedProduct } from "@/models/WishedProduct";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";

const Categories = ({
  mainCategories,
  categoriesProducts,
  wishedProducts = [],
}) => {
  return (
    <>
      <Header />
      <Center>
        {mainCategories.map((category) => (
          <div key={category._id} className="mb-5">
            <div className="flex items-center gap-4">
              <Title classNames={"mt-5 mb-2"} text={category.name} />
              <div className="mt-5">
                <Link
                  href={"/category/" + category._id}
                  className="text-gray-500 underline"
                >
                  Show all
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
              {categoriesProducts[category._id].map((p, index) => (
                <RevealWrapper delay={index * 50} key={p._id}>
                  <ProductBox
                    {...p}
                    wishedProducts={wishedProducts.includes(p._id)}
                  />
                </RevealWrapper>
              ))}
              <RevealWrapper
                delay={categoriesProducts[category._id].length * 50}
              >
                <div className="py-2">
                  <Link
                    href={"/category/" + category._id}
                    className="bg-gray-200 text-gray-500 rounded-md flex gap-2 items-center justify-center h-40"
                  >
                    Show all
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                      />
                    </svg>
                  </Link>
                </div>
              </RevealWrapper>
            </div>
          </div>
        ))}
      </Center>
    </>
  );
};

export default Categories;

export async function getServerSideProps(context) {
  await mongooseConnect();
  const categories = await Category.find();
  const mainCategories = categories.filter((category) => !category.parent);
  const categoriesProducts = {}; //categoryId = > [products]
  const allFetchedProductsId = [];
  for (const mainCategory of mainCategories) {
    const mainCatId = mainCategory._id.toString();
    const childCatIds = categories
      .filter((category) => category?.parent?.toString() === mainCatId)
      .map((cat) => cat._id.toString());
    const categoriesIds = [mainCatId, ...childCatIds];
    const products = await Product.find({ category: categoriesIds }, null, {
      limit: 3,
      sort: { _id: -1 },
    });
    allFetchedProductsId.push(...products.map((p) => p._id.toString()));
    categoriesProducts[mainCategory._id] = products;
  }

  const session = await getServerSession(context.req, context.res, authOptions);
  const wishedProducts = session?.user
    ? await WishedProduct.find({
        userEmail: session?.user.email,
        product: allFetchedProductsId,
      })
    : [];
  return {
    props: {
      mainCategories: JSON.parse(JSON.stringify(mainCategories)),
      categoriesProducts: JSON.parse(JSON.stringify(categoriesProducts)),
      wishedProducts: wishedProducts.map((item) => item.product.toString()),
    },
  };
}
