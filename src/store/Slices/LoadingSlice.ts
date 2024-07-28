import { createSlice } from "@reduxjs/toolkit";

const initialProgress: number = 0;

export const LoadingSlice = createSlice({
  name: "loading",
  initialState: initialProgress,
  reducers: {
    setProgress: (_, action) => {
      return action.payload;
    },
  },
});

export const { setProgress } = LoadingSlice.actions;
export default LoadingSlice.reducer;
