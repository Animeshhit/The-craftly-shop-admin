//core
import { useEffect, useState } from "react";

import { User, columns } from "../components/Users/columns";
import { DataTable } from "../components/Users/data-table";
import { ProductsLoadingPage } from "../components/LoadingPage";
import getToken from "../helper/token";
import axios from "axios";

//redux
import { useDispatch } from "react-redux";
import { login } from "../store/Slices/userSlice";

const Users = () => {
  const dispatch = useDispatch();
  const [users, setUsers] = useState<User[] | [] | null>(null);

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
          setUsers(data);
        })
        .catch((err) => {
          console.log(err);
          setUsers([]);
          alert("something went wrong");
        });
    } catch (err) {
      console.log(err);
      setUsers([]);
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
