import { createSlice } from "@reduxjs/toolkit";
import { Drafts } from "../../components/draftTable/columns";
const initialDraftProducts: Drafts[] | [] | null = null;

export const draftSlice = createSlice({
  name: "drafts",
  initialState: initialDraftProducts,
  reducers: {
    setDrafts: (_, action) => {
      return action.payload;
    },
  },
});

export const { setDrafts } = draftSlice.actions;
export default draftSlice.reducer;
