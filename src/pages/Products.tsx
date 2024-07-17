//core
import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

import { Product, columns } from "../components/ProductTable/columns";
import { DataTable } from "../components/ProductTable/data-table";
import axios from "axios";
import { Button } from "../components/ui/button";
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
      <h1 className="text-2xl font-semibold font-poppins">Products</h1>
      <div className="mt-8 flex items-center justify-end">
        <NavLink to="/addproduct">
          <Button>Create New Product</Button>
        </NavLink>
      </div>
      <div className="mt-6">
        {!data && <ProductsLoadingPage />}
        {data && <DataTable columns={columns} data={data} />}
      </div>
    </>
  );
};

export default Products;
