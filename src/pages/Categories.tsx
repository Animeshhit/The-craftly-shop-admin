//core
import { useEffect } from "react";

//others

import { columns } from "../components/Categories/columns";
import { DataTable } from "../components/Categories/data-table";
import { ProductsLoadingPage } from "../components/LoadingPage";
import { getCategories } from "../helper/categoriesHelper/ctg";

//redux
import { useSelector } from "react-redux";

const Categories = () => {
  // redux

  const ctg = useSelector((s: any) => s.ctg);
  // =======================categories========================

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
