import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./Slices/userSlice";
import ctgSlice from "./Slices/ctgSlice";
import bannerSlice from "./Slices/bannerSlice";

const Store = configureStore({
  reducer: {
    user: userSlice,
    ctg: ctgSlice,
    banners: bannerSlice,
  },
});

export default Store;
