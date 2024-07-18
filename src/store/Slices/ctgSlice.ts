import { createSlice } from "@reduxjs/toolkit";
import { CategoriesData } from "../../components/Categories/columns";

// here we are going to create two slice
/// one for the popup
// one for the all the ctg

// for all ctg
const initialCtgs: CategoriesData[] | [] | null = null;
// null ===> loading
// [] ===> no ctg
// [{...}] ==> array of object with the ctgs

export const ctgSlice = createSlice({
  name: "ctg",
  initialState: initialCtgs,
  reducers: {
    setCtg: (_, action) => {
      return action.payload;
    },
  },
});

export const { setCtg } = ctgSlice.actions;
export default ctgSlice.reducer;
