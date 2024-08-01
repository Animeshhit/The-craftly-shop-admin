import Store from "../../store/store";
import { setProgress } from "../../store/Slices/LoadingSlice";
import axios from "axios";
import getToken from "../token";
import { login } from "../../store/Slices/userSlice";
import { setProducts } from "../../store/Slices/productsSlice";
import { Product } from "../../components/ProductTable/columns";
import { Drafts } from "../../components/draftTable/columns";
import { setDrafts } from "../../store/Slices/draftsSlice";
const moveProducts = async (id: string, type: string) => {
  let token = getToken();
  if (!token) {
    alert("Session Expired");
    Store.dispatch(login(false));
    return;
  }
  try {
    Store.dispatch(setProgress(30));
    axios
      .post(
        `${import.meta.env.VITE_ADMIN_API_URL}/${
          type == "PUBLIC" ? "movetopublic" : "movetodraft"
        }?id=${id}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res: any) => {
        Store.dispatch(setProgress(100));
        let drafts = Store.getState().drafts;
        let products = Store.getState().products;
        if (type == "PUBLIC") {
          if (Array.isArray(products) && Array.isArray(drafts)) {
            Store.dispatch(setProducts([...products, res.data.product]));
            let updatedDraftProduct = (drafts as Drafts[]).filter((p: any) => {
              return p._id !== id;
            });
            Store.dispatch(setDrafts(updatedDraftProduct));
          }
        } else {
          if (Array.isArray(products) && Array.isArray(drafts)) {
            Store.dispatch(setDrafts([...drafts, res.data.draft]));
            let updatedProducts = (products as Product[]).filter((p: any) => {
              return p._id !== id;
            });
            Store.dispatch(setProducts(updatedProducts));
          }
        }
        alert(res.data.message);
      })
      .catch((err: any) => {
        console.log(err);
        Store.dispatch(setProgress(100));
        alert("something went wrong");
        alert;
      });
  } catch (err) {
    console.log(err);
    Store.dispatch(setProgress(100));
    alert("Network Connection Error");
  }
};

export default moveProducts;
