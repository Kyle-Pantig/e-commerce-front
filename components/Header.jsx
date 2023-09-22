import Link from "next/link";
import { useContext, useState } from "react";
import { CartContext } from "./CartContext";
import { Center } from "./Center";
import NavButton from "./NavButton";
import Bars from "./icons/Bars";
import { SearchIcon } from "./icons/SearchIcon";

const Header = () => {
  const [showNavbar, setShowNavbar] = useState(false);
  const { cartProducts } = useContext(CartContext);
  return (
    <header className="bg-[#222] sticky top-0 z-10">
      <Center>
        <div className="flex justify-between items-center py-5 px-0">
          <Link href={"/"} className="text-white">
            Ecommerce
          </Link>
          <nav
            className={` ${
              showNavbar ? " block text-black " : " hidden text-white "
            } gap-4 bg-white  fixed top-[4.3rem] inset-x-0 bottom-92 p-5 md:flex md:static md:bg-transparent md:text-white md:p-0`}
          >
            <Link className="nav-link" href={"/"}>
              Home
            </Link>
            <Link className="nav-link" href={"/products"}>
              All products
            </Link>
            <Link className="nav-link" href={"/categories"}>
              Categories
            </Link>
            <Link className="nav-link" href={"/account"}>
              Account
            </Link>
            <Link className="nav-link" href={"/cart"}>
              Cart ({cartProducts.length})
            </Link>
          </nav>
          <div className="flex items-center">
            <Link href={"/search"}>
              <SearchIcon />
            </Link>
            <NavButton
              onClick={() => setShowNavbar((prev) => !prev)}
              classNames={" md:hidden "}
              icon={<Bars />}
            />
          </div>
        </div>
      </Center>
    </header>
  );
};

export default Header;
