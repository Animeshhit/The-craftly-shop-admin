//core
import { useState, useEffect } from "react";

//others

import { CategoriesData, columns } from "../components/Categories/columns";
import { DataTable } from "../components/Categories/data-table";
import axios from "axios";
import { ProductsLoadingPage } from "../components/LoadingPage";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";

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
      <div className="flex mt-12 max-w-[800px] items-center justify-end">
        <Dialog>
          <DialogTrigger asChild>
            <Button>Add Categories</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Categories</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-6 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input id="name" value="Pedro Duarte" className="col-span-5" />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className="mt-4">
        {!data && <ProductsLoadingPage />}
        {data && <DataTable columns={columns} data={data} />}
      </div>
    </>
  );
};

export default Categories;
