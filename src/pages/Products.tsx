//core
import { useState, useEffect } from "react";

import { Product, columns } from "../components/ProductTable/columns";
import { DataTable } from "../components/ProductTable/data-table";
import axios from "axios";
import { ProductsLoadingPage } from "../components/LoadingPage";

const Products = () => {
  // =======================products========================
  const [data, setData] = useState<null | Product[] | []>();

  const getProducts = async () => {
    try {
      axios
        .get("https://66969cf60312447373c32c65.mockapi.io/products")
        .then((res) => {
          let { data } = res;
          setData(data);
        })
        .catch((err) => {
          setData([]);
          console.log(err);
          alert("something went wrong");
        });
    } catch (err) {
      setData([]);
      console.log(err);
      alert("Network connection error");
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <>
      <h1 className="text-2xl font-semibold">Products</h1>
      <div className="mt-8">
        {!data && <ProductsLoadingPage />}
        {data && <DataTable columns={columns} data={data} />}
      </div>
    </>
  );
};

export default Products;
