import { Center } from "@/components/Center";
import Header from "@/components/Header";
import Spinner from "@/components/Loader/Spinner";
import ProductGrid from "@/components/ProductGrid";
import Title from "@/components/Title";
import { Category } from "@/models/Category";
import { Product } from "@/models/Product";
import { WishedProduct } from "@/models/WishedProduct";
import axios from "axios";
import { getServerSession } from "next-auth";
import { useEffect, useState } from "react";
import { authOptions } from "../api/auth/[...nextauth]";

const CategoryPage = ({
  category,
  subCategories,
  products: originalProducts,
  wishedProducts = [],
}) => {
  const defaultSorting = "_id-desc";
  const defaultFilterValues = category.properties.map((prop) => ({
    name: prop.name,
    value: "all",
  }));
  const [products, setProducts] = useState(originalProducts);
  const [filtersValues, setFilterValues] = useState(defaultFilterValues);
  const [sort, setSort] = useState(defaultSorting);
  const [loadingProduct, setLoadingProduct] = useState(false);
  const [filtersChanged, setFiltersChanged] = useState(false);
  const handleFilterChange = (filterName, filterValue) => {
    setFilterValues((prev) => {
      return prev.map((prop) => ({
        name: prop.name,
        value: prop.name === filterName ? filterValue : prop.value,
      }));
    });
    setFiltersChanged(true);
  };

  useEffect(() => {
    if (!filtersChanged) {
      return;
    }
    setLoadingProduct(true);
    const categoriesIds = [
      category._id,
      ...(subCategories?.map((cat) => cat._id) || []),
    ];
    const params = new URLSearchParams();
    params.set("categories", categoriesIds.join(","));
    params.set("sort", sort);

    filtersValues.forEach((f) => {
      if (f.value !== "all") {
        params.set(f.name, f.value);
      }
    });
    const url = `/api/products?` + params.toString();

    axios.get(url).then((response) => {
      setProducts(response.data);
      setLoadingProduct(false);
    });
  }, [category._id, filtersValues, subCategories, sort, filtersChanged]);

  return (
    <>
      <Header />
      <Center>
        <div className="flex items-center justify-between">
          <Title classNames={"mt-5 mb-2"} text={category.name} />
          <div className="flex gap-5">
            {category.properties.map((prop, index) => (
              <div
                key={index}
                className="bg-gray-300 text-gray-600 py-1 px-3 rounded-md flex gap-2"
              >
                <span>{prop.name}:</span>
                <select
                  onChange={(event) =>
                    handleFilterChange(prop.name, event.target.value)
                  }
                  value={filtersValues.find((f) => f.name === prop.name).value}
                  className="border-none bg-transparent text-md font-bold"
                >
                  <option value="all">All</option>
                  {prop.values.map((val, index) => (
                    <option key={index} value={val}>
                      {val}
                    </option>
                  ))}
                </select>
              </div>
            ))}
            <div className=" bg-gray-300 text-gray-600 py-1 px-3 rounded-md flex gap-2">
              <span>Sort:</span>
              <select
                value={sort}
                onChange={(event) => {
                  setSort(event.target.value);
                  setFiltersChanged(true);
                }}
                className="border-none bg-transparent text-md font-bold"
              >
                <option value="price-asc">price, lowest first</option>
                <option value="price-desc">price, highest first</option>
                <option value="_id-desc">newest first</option>
                <option value="_id-asc">oldest first</option>
              </select>
            </div>
          </div>
        </div>
        {loadingProduct && <Spinner fullWidth />}
        {!loadingProduct && (
          <div className="flex items-center justify-center">
            {products.length > 0 && (
              <ProductGrid
                products={products}
                wishedProducts={wishedProducts}
              />
            )}
            {products.length === 0 && (
              <div className="mt-5 text-gray-400 text-lg">
                No products available
              </div>
            )}
          </div>
        )}
      </Center>
    </>
  );
};

export default CategoryPage;

export async function getServerSideProps(context) {
  const category = await Category.findById(context.query.id);
  const subCategories = await Category.find({ parent: category._id });
  const categoriesIds = [category._id, ...subCategories.map((cat) => cat._id)];
  const products = await Product.find({ category: categoriesIds });
  const session = await getServerSession(context.req, context.res, authOptions);
  const wishedProducts = session?.user
    ? await WishedProduct.find({
        userEmail: session?.user.email,
        product: products.map((p) => p._id.toString()),
      })
    : [];
  return {
    props: {
      category: JSON.parse(JSON.stringify(category)),
      subCategories: JSON.parse(JSON.stringify(subCategories)),
      products: JSON.parse(JSON.stringify(products)),
      wishedProducts: wishedProducts.map((item) => item.product.toString()),
    },
  };
}
