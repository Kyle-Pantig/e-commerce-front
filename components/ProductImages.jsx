import Image from "next/image";
import { useState } from "react";

const ProductImages = ({ images }) => {
  const [isActiveImg, setIsActiveImg] = useState(images?.[0]?.url);
  return (
    <>
      <div className="flex items-center h-52 text-center">
        <Image
          className="max-w-full max-h-52 "
          src={isActiveImg}
          alt="Product Images"
          width={500}
          height={500}
        />
      </div>
      <div className="flex gap-2 flex-grow-0 mt-2 ">
        {images.map((image) => (
          <div
            key={image.public_id}
            onClick={() => setIsActiveImg(image.url)}
            className={` ${
              image.url === isActiveImg
                ? " border-2 border-gray-500 "
                : " border opacity-50 "
            } flex items-center shadow-md h-16 w-16 p-1 rounded-md cursor-pointer`}
          >
            <Image
              src={image.url}
              alt="Parent"
              width={500}
              height={500}
              className="max-w-full max-h-full"
            />
          </div>
        ))}
      </div>
    </>
  );
};

export default ProductImages;
