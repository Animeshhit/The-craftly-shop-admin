import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (_, action) => {
      if (!action.payload) {
        localStorage.removeItem("__token");
      }
      return {
        user: action.payload,
      };
    },
  },
});

export const { login } = userSlice.actions;
export default userSlice.reducer;
