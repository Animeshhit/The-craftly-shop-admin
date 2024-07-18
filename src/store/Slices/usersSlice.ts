import { createSlice } from "@reduxjs/toolkit";
import { User } from "../../components/Users/columns";

// here we are going to create two slice
/// one for the popup
// one for the all the ctg

// for all ctg
const initialUsers: User[] | null | [] = null;
// null ===> loading
// [] ===> no ctg
// [{...}] ==> array of object with the ctgs

export const usersSlice = createSlice({
  name: "users",
  initialState: initialUsers,
  reducers: {
    setUsers: (_, action) => {
      return action.payload;
    },
  },
});

export const { setUsers } = usersSlice.actions;
export default usersSlice.reducer;
