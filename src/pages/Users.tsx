//core
import { useEffect } from "react";

import { columns } from "../components/Users/columns";
import { DataTable } from "../components/Users/data-table";
import { ProductsLoadingPage } from "../components/LoadingPage";
import getToken from "../helper/token";
import axios from "axios";

//redux
import { useDispatch, useSelector } from "react-redux";
import { login } from "../store/Slices/userSlice";
import { setUsers } from "../store/Slices/usersSlice";

const Users = () => {
  const dispatch = useDispatch();
  const users = useSelector((s: any) => s.users);

  const getUsers = () => {
    try {
      let token = getToken();
      if (!token) {
        alert("Session Expired");
        dispatch(login(false));
        return;
      }
      axios
        .get(`${import.meta.env.VITE_ADMIN_API_URL}/users`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          let { data } = res;
          dispatch(setUsers(data));
        })
        .catch((err) => {
          console.log(err);
          dispatch(setUsers([]));
          alert("something went wrong");
        });
    } catch (err) {
      console.log(err);
      dispatch(setUsers([]));
      alert("Network connection error");
    }
  };

  useEffect(() => {
    getUsers();
  }, []);
  return (
    <>
      <h1 className="text-2xl font-semibold font-poppins">Users</h1>
      <div className="mt-6">
        {!users && <ProductsLoadingPage />}
        {users && <DataTable columns={columns} data={users} />}
      </div>
    </>
  );
};

export default Users;
