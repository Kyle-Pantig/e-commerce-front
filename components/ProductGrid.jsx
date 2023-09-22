import { RevealWrapper } from "next-reveal";
import ProductBox from "./ProductBox";

const ProductGrid = ({ products, wishedProducts = [] }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
      {products.map((product, index) => (
        <RevealWrapper delay={index * 50} key={product._id}>
          <ProductBox
            {...product}
            wishedProducts={wishedProducts.includes(product._id)}
          />
        </RevealWrapper>
      ))}
    </div>
  );
};

export default ProductGrid;
