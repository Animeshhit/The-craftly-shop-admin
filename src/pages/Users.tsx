//core
import { useEffect, useState } from "react";

import { columns } from "../components/Users/columns";
import { DataTable } from "../components/Users/data-table";
import { ProductsLoadingPage } from "../components/LoadingPage";
import getToken from "../helper/token";
import axios from "axios";
import { useToast } from "../components/ui/use-toast";

//redux
import { useDispatch, useSelector } from "react-redux";
import { login } from "../store/Slices/userSlice";
import { setUsers } from "../store/Slices/usersSlice";
import { ToastAction } from "../components/ui/toast";
import { setProgress } from "../store/Slices/LoadingSlice";

const Users = () => {
  const dispatch = useDispatch();
  const users = useSelector((s: any) => s.users);
  const { toast } = useToast();

  const [page, setPage] = useState<number>(1);
  const [next, setNext] = useState<boolean>(false);
  const [prev, setPrev] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const getUsers = () => {
    try {
      let token = getToken();
      if (!token) {
        toast({
          variant: "destructive",
          title: "Session Expired",
          description: "Please Login again",
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
        dispatch(login(false));
        return;
      }
      setLoading(true);
      dispatch(setProgress(30));
      axios
        .get(
          `${import.meta.env.VITE_ADMIN_API_URL}/users?page=${page}&limit=8`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
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
          dispatch(setUsers(data.users));
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          dispatch(setProgress(100));
          dispatch(setUsers([]));
          setLoading(false);
          toast({
            variant: "destructive",
            title: "Error",
            description: "something went wrong",
          });
        });
    } catch (err) {
      console.log(err);
      dispatch(setProgress(100));
      dispatch(setUsers([]));
      setLoading(false);
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
    getUsers();
  }, [page]);
  return (
    <>
      <h1 className="text-2xl font-semibold font-poppins">Users</h1>
      <div className="mt-6">
        {!users && <ProductsLoadingPage />}
        {users && (
          <DataTable
            columns={columns}
            data={users}
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

export default Users;
