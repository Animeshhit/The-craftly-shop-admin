import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./Slices/userSlice";
import ctgSlice from "./Slices/ctgSlice";

const Store = configureStore({
  reducer: {
    user: userSlice,
    ctg: ctgSlice,
  },
});

export default Store;
 