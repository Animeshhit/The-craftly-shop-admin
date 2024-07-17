//core
import { useEffect } from "react";

//others

import { columns } from "../components/Categories/columns";
import { DataTable } from "../components/Categories/data-table";
import axios from "axios";
import { ProductsLoadingPage } from "../components/LoadingPage";

//redux
import { useDispatch, useSelector } from "react-redux";
import { setCtg } from "../store/Slices/ctgSlice";

const Categories = () => {
  // redux
  const dispatch = useDispatch();
  const ctg = useSelector((s: any) => s.ctg);
  // =======================categories========================

  const getCategories = async () => {
    try {
      axios
        .get(`${import.meta.env.VITE_BASE_API_URL}/categories`)
        .then((res) => {
          let { data } = res;
          dispatch(setCtg(data));
        })
        .catch((err) => {
          dispatch(setCtg([]));
          console.log(err);
          alert("something went wrong");
        });
    } catch (err) {
      dispatch(setCtg([]));
      console.log(err);
      alert("Network connection error");
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <>
      <h1 className="text-2xl font-semibold font-poppins">Categories</h1>

      <div className="mt-4">
        {!ctg && <ProductsLoadingPage />}
        {ctg && <DataTable columns={columns} data={ctg} />}
      </div>
    </>
  );
};

export default Categories;
