//core
import { useEffect, useState } from "react";

import { columns } from "../components/draftTable/columns";
import { DataTable } from "../components/draftTable/data-table";
import axios from "axios";

import { ProductsLoadingPage } from "../components/LoadingPage";
import { ToastAction } from "../components/ui/toast";
import { useToast } from "../components/ui/use-toast";

//redux
import { useDispatch, useSelector } from "react-redux";
import { setProgress } from "../store/Slices/LoadingSlice";
import { setDrafts } from "../store/Slices/draftsSlice";

const Drafts = () => {
  const { toast } = useToast();
  // =======================products========================
  const drafts = useSelector((s: any) => s.drafts);
  const dispatch = useDispatch();

  const [page, setPage] = useState<number>(1);
  const [next, setNext] = useState<boolean>(false);
  const [prev, setPrev] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const getDraftProducts = async () => {
    try {
      setLoading(true);
      dispatch(setProgress(30));
      axios
        .get(
          `${
            import.meta.env.VITE_BASE_API_URL
          }/products/by?query=drafts&page=${page}&limit=10`
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
          dispatch(setDrafts(data.products));
          setLoading(false);
        })
        .catch((err) => {
          dispatch(setProgress(100));
          dispatch(setDrafts([]));
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
      dispatch(setDrafts([]));
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
    getDraftProducts();
  }, [page]);

  return (
    <>
      <h1 className="text-2xl font-semibold font-poppins">Products</h1>

      <div className="mt-6">
        {!drafts && <ProductsLoadingPage />}
        {drafts && (
          <DataTable
            columns={columns}
            data={drafts}
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

export default Drafts;
