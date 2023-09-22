import Link from "next/link";
import Image from "next/image";
import FlyingBtn from "./FlyingBtn";
import HeartOutline from "./icons/HeartOutline";
import Button from "./Button";
import { useState } from "react";
import HeartSolid from "./icons/HeartSolid";
import axios from "axios";

const ProductBox = ({
  _id,
  title,
  description,
  price,
  images,
  wishedProducts = false,
  onRemoveFromWishlist = () => {},
}) => {
  const url = "/product/" + _id;
  const [isWishList, setIsWishList] = useState(wishedProducts);
  const addToWishList = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const nextValue = !isWishList;
    if (nextValue === false && onRemoveFromWishlist) {
      onRemoveFromWishlist(_id);
    }
    axios
      .post("/api/wishlist", {
        product: _id,
      })
      .then(() => {});
    setIsWishList(nextValue);
  };

  return (
    <div className="border border-black p-2 rounded-md">
      <Link
        href={url}
        className="bg-white p-5 h-48 text-center flex items-center justify-center rounded-md relative"
      >
        <div>
          <Button wished={isWishList.toString()} onClick={addToWishList}>
            {isWishList ? <HeartSolid /> : <HeartOutline />}
          </Button>
          {images?.length > 0 && (
            <Image
              src={images[0].url}
              alt="Product"
              className=" max-w-full max-h-40"
              width={200}
              height={200}
            />
          )}
        </div>
      </Link>
      <div className="mt-4">
        <Link href={url} className=" text-lg font-normal m-0 text-black ">
          {title}
        </Link>
        <div className="flex flex-col mt-1 md:flex md:justify-between ">
          <div className=" text-md text-right font-bold md:text-lg md:text-left  ">
            ${price}
          </div>
          <FlyingBtn _id={_id} src={images?.[0]?.url}>
            Add to cart
          </FlyingBtn>
        </div>
      </div>
    </div>
  );
};

export default ProductBox;
