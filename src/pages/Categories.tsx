//core
import { useState, useEffect } from "react";

//others

import { CategoriesData, columns } from "../components/Categories/columns";
import { DataTable } from "../components/Categories/data-table";
import axios from "axios";
import { ProductsLoadingPage } from "../components/LoadingPage";


const Categories = () => {
  // =======================categories========================
  const [data, setData] = useState<null | CategoriesData[] | []>();

  const getCategories = async () => {
    try {
      axios
        .get("https://66969cf60312447373c32c65.mockapi.io/categories")
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
    getCategories();
  }, []);

  return (
    <>
      <h1 className="text-2xl font-semibold font-poppins">Categories</h1>
     
      <div className="mt-4">
        {!data && <ProductsLoadingPage />}
        {data && <DataTable columns={columns} data={data} />}
      </div>
    </>
  );
};

export default Categories;
