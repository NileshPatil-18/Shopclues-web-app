import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";

export const fetchCategories = createAsyncThunk("categories/fetchCategories",async()=>{
    const response = await fetch("https://fakestoreapi.com/products/categories");
    return response.json();
});

const categorySlice = createSlice({
    name: "categories",
    initialState: {
    categories: [],
    status: "idle",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state) => {
        state.status = "failed";
      });
  },
})

export default categorySlice.reducer;