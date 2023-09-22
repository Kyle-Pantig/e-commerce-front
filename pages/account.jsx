import Button from "@/components/Button";
import { Center } from "@/components/Center";
import Header from "@/components/Header";
import WhiteBox from "@/components/WhiteBox";
import { RevealWrapper } from "next-reveal";
import { signIn, signOut, useSession } from "next-auth/react";
import Input from "@/components/Input";
import { useEffect, useState } from "react";
import axios from "axios";
import Spinner from "@/components/Loader/Spinner";
import ProductBox from "@/components/ProductBox";
import Tabs from "@/components/Tabs";
import SingleOrder from "@/components/SingleOrder";

const Account = () => {
  const { data: session } = useSession();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [streetBarangay, setStreetBarangay] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [addressLoaded, setAddressLoaded] = useState(true);
  const [wishlistLoaded, setWishlistLoaded] = useState(true);
  const [orderLoaded, setOrderLoaded] = useState(true);
  const [wishedProducts, setWishedProducts] = useState([]);
  const [activeTab, setActiveTab] = useState("Orders");
  const [orders, setOrders] = useState([]);

  const logout = async () => {
    await signOut({
      callbackUrl: process.env.NEXT_PUBLIC_URL,
    });
  };

  const login = async () => {
    await signIn("google");
  };

  const saveAddress = () => {
    const data = {
      name,
      email,
      country,
      province,
      city,
      streetBarangay,
      postalCode,
    };
    axios.put("/api/address", data);
  };

  useEffect(() => {
    if (!session) {
      return;
    }
    setAddressLoaded(false);
    setWishlistLoaded(false);
    setOrderLoaded(false);
    axios.get("/api/address").then((response) => {
      setName(response.data?.name);
      setEmail(response.data?.email);
      setCountry(response.data?.country);
      setProvince(response.data?.province);
      setCity(response.data?.city);
      setStreetBarangay(response.data?.streetBarangay);
      setPostalCode(response.data?.postalCode);
      setAddressLoaded(true);
    });
    axios.get("/api/wishlist").then((response) => {
      setWishedProducts(
        response.data.map((wishedProduct) => wishedProduct.product)
      );
      setWishlistLoaded(true);
    });
    axios.get("/api/orders").then((response) => {
      setOrders(response.data);
      setOrderLoaded(true);
    });
  }, [session]);

  const productRemovedFromWishlist = (idToRemove) => {
    setWishedProducts((products) => {
      return [...products.filter((p) => p._id.toString() !== idToRemove)];
    });
  };

  return (
    <>
      <Header />
      <Center>
        <div className="grid grid-cols-1 md:grid-cols-14 gap-10 my-10">
          <div>
            <RevealWrapper delay={50}>
              <WhiteBox>
                <Tabs
                  tabs={["Orders", "Wishlist"]}
                  active={activeTab}
                  onChange={setActiveTab}
                />
                {activeTab === "Orders" && (
                  <>
                    {!orderLoaded && <Spinner fullwidth={1} />}
                    {orderLoaded && (
                      <div>
                        {orders.length === 0 && <p>Login to see your orders</p>}
                        {orders.length > 0 &&
                          orders.map((order) => (
                            <SingleOrder key={order._id} {...order} />
                          ))}
                      </div>
                    )}
                  </>
                )}
                {activeTab === "Wishlist" && (
                  <>
                    {!wishlistLoaded && <Spinner fullwidth={1} />}
                    {wishlistLoaded && (
                      <>
                        <div className="grid grid-cols-2 gap-10">
                          {wishedProducts.length > 0 &&
                            wishedProducts.map((wp) => (
                              <ProductBox
                                key={wp._id}
                                {...wp}
                                wishedProducts={true}
                                onRemoveFromWishlist={
                                  productRemovedFromWishlist
                                }
                              />
                            ))}
                        </div>
                        {wishedProducts.length === 0 && (
                          <>
                            {session && <p>Your wishlist is empty.</p>}
                            {!session && (
                              <p className="text-gray-400 my-1">
                                Login to add products to your wishlist
                              </p>
                            )}
                          </>
                        )}
                      </>
                    )}
                  </>
                )}
              </WhiteBox>
            </RevealWrapper>
          </div>
          <div>
            <RevealWrapper delay={150}>
              <WhiteBox>
                <h2>{session ? "Account details" : "Login"}</h2>
                {!addressLoaded && <Spinner fullwidth={1} />}
                {addressLoaded && session && (
                  <>
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
                        onChange={(event) =>
                          setStreetBarangay(event.target.value)
                        }
                      />
                    </div>
                    <Input
                      type="text"
                      placeholder="Postal Code"
                      value={postalCode}
                      name="postalCode"
                      onChange={(event) => setPostalCode(event.target.value)}
                    />
                    <Button primary={1} onClick={saveAddress}>
                      Save
                    </Button>
                    <hr className=" border-t-1 border-gray-400 my-2 " />
                  </>
                )}

                {session && (
                  <button
                    onClick={logout}
                    className="btn-primary bg-black text-white"
                  >
                    Logout
                  </button>
                )}
                {!session && (
                  <button
                    onClick={login}
                    className="btn-primary bg-black text-white"
                    text={"Login"}
                  >
                    Login with Google
                  </button>
                )}
              </WhiteBox>
            </RevealWrapper>
          </div>
        </div>
      </Center>
    </>
  );
};

export default Account;
