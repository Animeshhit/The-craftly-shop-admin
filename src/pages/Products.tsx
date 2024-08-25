//core
import { useEffect, useState } from "react";

import { columns } from "../components/ProductTable/columns";
import { DataTable } from "../components/ProductTable/data-table";
import axios from "axios";

import { ProductsLoadingPage } from "../components/LoadingPage";
import { ToastAction } from "../components/ui/toast";
import { useToast } from "../components/ui/use-toast";

//redux
import { useDispatch, useSelector } from "react-redux";
import { setProducts } from "../store/Slices/productsSlice";
import { setProgress } from "../store/Slices/LoadingSlice";

const Products = () => {
  const { toast } = useToast();
  // =======================products========================
  const products = useSelector((s: any) => s.products);
  const dispatch = useDispatch();

  const [page, setPage] = useState<number>(1);
  const [next, setNext] = useState<boolean>(false);
  const [prev, setPrev] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const getProducts = async () => {
    try {
      setLoading(true);
      dispatch(setProgress(30));
      axios
        .get(
          `${
            import.meta.env.VITE_BASE_API_URL
          }/products/by?query=products&page=${page}&limit=10`
        )
        .then((res) => {
          let { data } = res;
          if (data.prev) {
            setPrev(true);
          } else {
            setPrev(false);
          }
          if (data.next) {
            setNext(true);
          } else {
            setNext(false);
          }
          dispatch(setProgress(100));
          dispatch(setProducts(data.products));
          setLoading(false);
        })
        .catch((err) => {
          dispatch(setProgress(100));
          dispatch(setProducts([]));
          setLoading(false);
          console.log(err);
          toast({
            variant: "destructive",
            title: "Error",
            description: "something went wrong",
          });
        });
    } catch (err) {
      dispatch(setProgress(100));
      dispatch(setProducts([]));
      setLoading(false);
      console.log(err);
      toast({
        variant: "destructive",
        title: "Network Error",
        description: "Please Check Your Network Connection",
        action: (
          <ToastAction
            altText="Try again"
            onClick={() => {
              location.reload();
            }}
          >
            Try again
          </ToastAction>
        ),
      });
    }
  };

  useEffect(() => {
    getProducts();
  }, [page]);

  return (
    <>
      <h1 className="text-2xl font-semibold font-poppins">Products</h1>

      <div className="mt-6">
        {!products && <ProductsLoadingPage />}
        {products && (
          <DataTable
            columns={columns}
            data={products}
            loading={loading}
            SetPage={setPage}
            Next={next}
            Prev={prev}
          />
        )}
      </div>
    </>
  );
};

export default Products;
