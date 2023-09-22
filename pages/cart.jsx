import Button from "@/components/Button";
import { CartContext } from "@/components/CartContext";
import { Center } from "@/components/Center";
import Header from "@/components/Header";
import Input from "@/components/Input";
import WhiteBox from "@/components/WhiteBox";
import axios from "axios";
import { useSession } from "next-auth/react";
import { RevealWrapper } from "next-reveal";
import Image from "next/image";
import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";

const CartPage = () => {
  const { cartProducts, addProduct, removeItem, clearCart } =
    useContext(CartContext);
  const { data: session } = useSession();
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [streetBarangay, setStreetBarangay] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [shippingFee, setShippingFee] = useState(null);
  useEffect(() => {
    if (cartProducts.length > 0) {
      axios.post("/api/cart", { ids: cartProducts }).then((response) => {
        setProducts(response.data);
      });
    } else {
      setProducts([]);
    }
  }, [cartProducts]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    if (window?.location.href.includes("success")) {
      setIsSuccess(true);
      clearCart();
    }
    axios.get("/api/settings?name=shippingFee").then((response) => {
      setShippingFee(response.data.value);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!session) {
      return;
    }
    axios.get("/api/address").then((response) => {
      setName(response.data?.name);
      setEmail(response.data?.email);
      setCountry(response.data?.country);
      setProvince(response.data?.province);
      setCity(response.data?.city);
      setStreetBarangay(response.data?.streetBarangay);
      setPostalCode(response.data?.postalCode);
    });
  }, [session]);

  const moreItems = (id) => {
    addProduct(id);
  };

  const lessItems = (id) => {
    removeItem(id);
  };

  const goToPayment = async () => {
    const response = await axios.post("/api/checkout", {
      name,
      email,
      country,
      province,
      city,
      streetBarangay,
      postalCode,
      cartProducts,
    });
    if (response.data.url) {
      window.location = response.data.url;
    }
  };

  let totalPrice = 0;
  for (const productId of cartProducts) {
    const price = products.find((p) => p._id === productId)?.price || 0;
    totalPrice += price;
  }

  

  if (isSuccess) {
    return (
      <>
        <Header />
        <Center>
          <div className="grid grid-cols-1 gap-10 mt-10">
            <div className="bg-white rounded-md p-7">
              <h1 className="text-4xl font-bold mb-5">
                Thanks for your order!
              </h1>
              <p className="text-lg">
                We will email you when your order will be sent.
              </p>
            </div>
          </div>
        </Center>
      </>
    );
  }

  return (
    <>
      <Header />
      <Center>
        <div
          className={`grid grid-cols-1 gap-10 my-10 ${
            cartProducts?.length && " md:grid-cols-14 "
          }`}
        >
          <RevealWrapper delay={0}>
            <WhiteBox>
              <div className="flex items-center justify-between mb-2">
                <h2>Cart</h2>
                <Link className="btn-primary underline " href={"/"}>
                  Continue shopping
                </Link>
              </div>
              {!cartProducts?.length && <div>Your cart is empty</div>}
              {products?.length > 0 && (
                <table className="basic">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Quantity</th>
                      <th>Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product._id} className="border-t-2">
                        <td className="py-2 flex flex-col gap-2 md:flex-row items-center ">
                          <div className="flex items-center justify-center p-1 md:p-2 rounded-md shadow-lg border-2 w-[70px] :h-[70px] md:w-[100px] md:h-[100px] ">
                            <Image
                              src={product.images?.[0]?.url}
                              alt="Product"
                              width={400}
                              height={400}
                              className=" max-w-[50px] max-h-[50px] md:max-w-[80px] md:max-h-[80px] "
                            />
                          </div>
                          <div className="mt-1">{product.title}</div>
                        </td>
                        <td>
                          <div className="block md:flex items-center">
                            <button
                              onClick={() => lessItems(product._id)}
                              className="bg-gray-200 w-6 h-6 md:w-9 py-1 px-3 rounded-md flex justify-center items-center text-center font-medium"
                            >
                              -
                            </button>
                            <span className="py-0 px-2">
                              {
                                cartProducts.filter((id) => id === product._id)
                                  .length
                              }
                            </span>
                            <button
                              onClick={() => moreItems(product._id)}
                              className="bg-gray-200 w-6 h-6 md:w-9 py-1 px-3 rounded-md flex justify-center items-center text-center font-medium"
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td>
                          $
                          {cartProducts.filter((id) => id === product._id)
                            .length * product.price}
                        </td>
                      </tr>
                    ))}
                    <tr className="border-t-2 subtotal">
                      <td colSpan={2}>Products:</td>
                      <td>${totalPrice}</td>
                    </tr>
                    <tr className="border-t-2 subtotal">
                      <td colSpan={2}>Shippings:</td>
                      <td>${shippingFee}</td>
                    </tr>
                    <tr className="border-t-2 subtotal total">
                      <td colSpan={2}>Total:</td>
                      <td>${totalPrice + parseInt(shippingFee || 0)}</td>
                    </tr>
                  </tbody>
                </table>
              )}
            </WhiteBox>
          </RevealWrapper>

          {!!cartProducts?.length && (
            <RevealWrapper delay={100}>
              <WhiteBox>
                <h2>Order information</h2>
                <Input
                  type="text"
                  placeholder="Name"
                  value={name}
                  name="name"
                  onChange={(event) => setName(event.target.value)}
                />
                <Input
                  type="text"
                  placeholder="Email"
                  value={email}
                  name="email"
                  onChange={(event) => setEmail(event.target.value)}
                />
                <div className="flex gap-1">
                  <Input
                    type="text"
                    placeholder="Country"
                    value={country}
                    name="country"
                    onChange={(event) => setCountry(event.target.value)}
                  />
                  <Input
                    type="text"
                    placeholder="Province"
                    value={province}
                    name="province"
                    onChange={(event) => setProvince(event.target.value)}
                  />
                </div>
                <div className="flex gap-1">
                  <Input
                    type="text"
                    placeholder="City"
                    value={city}
                    name="city"
                    onChange={(event) => setCity(event.target.value)}
                  />
                  <Input
                    type="text"
                    placeholder="Street, Barangay"
                    value={streetBarangay}
                    name="streetBarangay"
                    onChange={(event) => setStreetBarangay(event.target.value)}
                  />
                </div>
                <Input
                  type="text"
                  placeholder="Postal Code"
                  value={postalCode}
                  name="postalCode"
                  onChange={(event) => setPostalCode(event.target.value)}
                />
                <Button primary={1} onClick={goToPayment}>
                  Continue to payment
                </Button>
              </WhiteBox>
            </RevealWrapper>
          )}
        </div>
      </Center>
    </>
  );
};

export default CartPage;
