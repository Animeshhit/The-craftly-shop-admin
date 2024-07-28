import axios from "axios";
import { setCtg } from "../../store/Slices/ctgSlice";
import Store from "../../store/store";
import getToken from "../token";
import { login } from "../../store/Slices/userSlice";
import { setProgress } from "../../store/Slices/LoadingSlice";

const getCategories = async () => {
  try {
    Store.dispatch(setProgress(30));
    axios
      .get(`${import.meta.env.VITE_BASE_API_URL}/categories`)
      .then((res) => {
        let { data } = res;
        Store.dispatch(setCtg(data));
        Store.dispatch(setProgress(100));
      })
      .catch((err) => {
        Store.dispatch(setCtg([]));
        Store.dispatch(setProgress(100));
        console.log(err);
        alert("something went wrong");
      });
  } catch (err) {
    Store.dispatch(setCtg([]));
    Store.dispatch(setProgress(100));
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
    Store.dispatch(setProgress(30));
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
        Store.dispatch(setProgress(100));
        alert(data.message);
      })
      .catch((err) => {
        console.log(err);
        Store.dispatch(setProgress(100));
        alert("something went wrong");
      });
  } catch (err) {
    console.log(err);
    Store.dispatch(setProgress(100));
    alert("Network connection error");
  }
};

export { getCategories, deleteCtg };
