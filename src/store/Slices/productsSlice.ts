import { createSlice } from "@reduxjs/toolkit";
import { Product } from "../../components/ProductTable/columns";

const initialProducts: Product[] | [] | null = null;

export const productSlice = createSlice({
  name: "products",
  initialState: initialProducts,
  reducers: {
    setProducts: (_, action) => {
      return action.payload;
    },
  },
});



export const { setProducts } = productSlice.actions;
export default productSlice.reducer;


