import { useContext, useEffect, useRef } from "react";
import { CartContext } from "./CartContext";
import Image from "next/image";

const FlyingBtn = (props) => {
  const { addProduct } = useContext(CartContext);
  const imgRef = useRef();
  function sendImageToCart(ev) {
    imgRef.current.style.display = "inline-block";
    imgRef.current.style.left = ev.clientX - 50 + "px";
    imgRef.current.style.top = ev.clientY - 50 + "px";
    setTimeout(() => {
      imgRef.current.style.display = "none";
    }, 1000);
  }

  useEffect(() => {
    const interval = setInterval(() => {
      const reveal = imgRef.current?.closest("div[data-sr-id]");
      if (reveal?.style.opacity === "1") {
        // visible
        reveal.style.transform = "none";
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);
  return (
    <div
      className={`text-sm rounded-md font-semibold
      ${props.main ? "bg-black text-white w-max " : " border-2  border-black "}
      ${props.white && " bg-white text-black border-2 border-white "} `}
      onClick={() => addProduct(props._id)}
    >
      <Image
        src={props.src}
        alt="Product"
        ref={imgRef}
        width={50}
        height={50}
        className="flying-image"
      />
      <button
        className="py-1 px-3 flex justify-center items-center w-full"
        onClick={(event) => sendImageToCart(event)}
        {...props}
      />
    </div>
  );
};

export default FlyingBtn;
