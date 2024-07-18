import { createSlice } from "@reduxjs/toolkit";

// for all ctg
const initialBanner = null;
// null ===> loading
// [] ===> no ctg
// [{...}] ==> array of object with the ctgs

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
