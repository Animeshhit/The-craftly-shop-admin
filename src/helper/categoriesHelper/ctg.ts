import axios from "axios";
import { setCtg } from "../../store/Slices/ctgSlice";
import Store from "../../store/store";
import getToken from "../token";
import { login } from "../../store/Slices/userSlice";

const getCategories = async () => {
  try {
    axios
      .get(`${import.meta.env.VITE_BASE_API_URL}/categories`)
      .then((res) => {
        let { data } = res;
        Store.dispatch(setCtg(data));
      })
      .catch((err) => {
        Store.dispatch(setCtg([]));
        console.log(err);
        alert("something went wrong");
      });
  } catch (err) {
    Store.dispatch(setCtg([]));
    console.log(err);
    alert("Network connection error");
  }
};

const deleteCtg = async (id: string, ctgs: any) => {
  try {
    let token = getToken();
    if (!token) {
      alert("Session Expired");
      Store.dispatch(login(false));
      return;
    }
    axios
      .delete(`${import.meta.env.VITE_ADMIN_API_URL}/delete-ctg?id=${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        let { data } = res;
        let updatedctgs = ctgs.filter((ctg: any) => {
          return ctg._id !== id;
        });
        Store.dispatch(setCtg(updatedctgs));
        alert(data.message);
      })
      .catch((err) => {
        console.log(err);
        alert("something went wrong");
      });
  } catch (err) {
    console.log(err);
    alert("Network connection error");
  }
};

export { getCategories, deleteCtg };
