import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./Slices/userSlice";
import ctgSlice from "./Slices/ctgSlice";
import bannerSlice from "./Slices/bannerSlice";
import usersSlice from "./Slices/usersSlice";
import productSlice from "./Slices/productsSlice";
import LoadingSlice from "./Slices/LoadingSlice";
import draftSlice from "./Slices/draftsSlice";

const Store = configureStore({
  reducer: {
    user: userSlice,
    ctg: ctgSlice,
    banners: bannerSlice,
    users: usersSlice,
    products: productSlice,
    loading: LoadingSlice,
    drafts: draftSlice,
  },
});

export default Store;
