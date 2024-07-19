//core
import { useEffect } from "react";

import { columns } from "../components/ProductTable/columns";
import { DataTable } from "../components/ProductTable/data-table";
import axios from "axios";

import { ProductsLoadingPage } from "../components/LoadingPage";

//redux
import { useDispatch, useSelector } from "react-redux";
import { setProducts } from "../store/Slices/productsSlice";

const Products = () => {
  // =======================products========================
  const products = useSelector((s: any) => s.products);
  const dispatch = useDispatch();

  const getProducts = async () => {
    try {
      axios
        .get(`${import.meta.env.VITE_BASE_API_URL}/products`)
        .then((res) => {
          let { data } = res;
          dispatch(setProducts(data.products));
        })
        .catch((err) => {
          dispatch(setProducts([]));
          console.log(err);
          alert("something went wrong");
        });
    } catch (err) {
      dispatch(setProducts([]));
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

      <div className="mt-6">
        {!products && <ProductsLoadingPage />}
        {products && <DataTable columns={columns} data={products} />}
      </div>
    </>
  );
};

export default Products;
