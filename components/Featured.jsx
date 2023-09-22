import { Center } from "./Center";
import Link from "next/link";
import Image from "next/image";
import CartIcon from "./icons/CartIcon";
import FlyingBtn from "./FlyingBtn";
import { RevealWrapper } from "next-reveal";

const Featured = ({ product }) => {
  return (
    <div className="bg-[#222] text-white py-12 px-0">
      <Center>
        <div className="grid grid-cols-1 md:grid-cols-13 place-items-center gap-10 ">
          <div className="flex items-center order-2 ">
            <div>
              <RevealWrapper origin="left" delay={20}>
                <h1 className="m-0 font-normal my-2 text-3xl md:text-5xl">
                  {product.title}
                </h1>
                <p className="text-[#aaa] text-sm">{product.description}</p>
                <div className="flex gap-3 mt-6">
                  <Link
                    className="text-white border border-white btn-primary text-sm"
                    href={"/product/" + product._id}
                  >
                    Read more
                  </Link>
                  <FlyingBtn
                    white={1}
                    _id={product._id}
                    src={product.images?.[0]?.url}
                  >
                    <CartIcon />
                    Add to cart
                  </FlyingBtn>
                </div>
              </RevealWrapper>
            </div>
          </div>
          <div className="flex items-center mx-10 md:order-2 md:mx-0">
            <RevealWrapper delay={20}>
              <Image
                src={product.images?.[0]?.url}
                alt="Image"
                width={500}
                height={500}
                className=" max-w-28 max-h-96  md:max-w-full  "
              />
            </RevealWrapper>
          </div>
        </div>
      </Center>
    </div>
  );
};

export default Featured;
