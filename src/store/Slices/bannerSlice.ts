import { createSlice } from "@reduxjs/toolkit";

const initialBanner = null;

export const bannerSlice = createSlice({
  name: "banners",
  initialState: initialBanner,
  reducers: {
    setBanners: (_, action) => {
      return action.payload;
    },
  },
});

export const { setBanners } = bannerSlice.actions;
export default bannerSlice.reducer;
