import { Center } from "@/components/Center";
import Header from "@/components/Header";
import Input from "@/components/Input";
import Spinner from "@/components/Loader/Spinner";
import ProductGrid from "@/components/ProductGrid";
import axios from "axios";
import { debounce } from "lodash";
import { useCallback, useEffect, useState } from "react";

const SearchPage = () => {
  const [phrase, setPhrase] = useState("");
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(debounce(searchProducts, 500), []);
  useEffect(() => {
    if (phrase.length > 0) {
      setIsLoading(true);
      debouncedSearch(phrase);
    } else {
      setProducts([]);
    }
  }, [debouncedSearch, phrase]);

  function searchProducts(phrase) {
    axios
      .get("/api/products?phrase=" + encodeURIComponent(phrase))
      .then((response) => {
        setProducts(response.data);
        setIsLoading(false);
      });
  }
  return (
    <>
      <Header />
      <Center>
        <div className="sticky top-[68px] mt-6 mx-0 py-1 px-0 bg-[#eeeeeeaa]">
          <Input
            autoFocus
            searchInput
            value={phrase}
            onChange={(event) => setPhrase(event.target.value)}
            placeholder={"Search for products..."}
          />
        </div>
        {!isLoading && phrase !== "" && products.length === 0 && (
          <h2>No products found for &quot;{phrase}&quot;</h2>
        )}
        {isLoading && <Spinner fullWidth={true} />}
        {!isLoading && products.length > 0 && (
          <>
            {!isLoading && phrase !== "" && (
              <h2>Search result for &quot;{phrase}&quot;</h2>
            )}
            <ProductGrid products={products} />
          </>
        )}
      </Center>
    </>
  );
};

export default SearchPage;
