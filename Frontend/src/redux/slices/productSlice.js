import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
const API_BASE_URL = import.meta.env.API_BASE_URL || "https://shopclues-xr1j.onrender.com";


export const fetchProducts = createAsyncThunk('products/fetchProducts', async () => {
    const response = await axios.get(`${API_BASE_URL}/api/products`);
    return response.data;
  });

  // Fetch products by category
export const fetchProductsByCategory = createAsyncThunk(
  'products/fetchProductsByCategory',
  async (categoryId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/products/category/${categoryId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch products");
    }
  }
);

export const fetchProductsBySearch = createAsyncThunk(
  'products/fetchProductsBySearch',
  async (searchTerm, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/products?search=${searchTerm}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to search products");
    }
  }
);

export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (id, { rejectWithValue }) => {
    if (!id) return rejectWithValue("Invalid product ID");
    try {
      const response = await axios.get(`${API_BASE_URL}/api/products/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch product");
    }
  }
);

  const productSlice = createSlice({
    name : 'products',
    initialState:{
        items : [],
        product:null,
        status : 'idle',
        error : null,
        searchTerm : '',
        isSearching: false,
    },
    reducers: {
        setSearchTerm: (state, action) => {
          state.searchTerm = action.payload;
        },
        setSearching: (state, action) => {
          state.isSearching = action.payload; // Toggle search mode
        },
      },

      extraReducers: (builder) => {
        builder
          .addCase(fetchProducts.pending, (state) => {
            state.status = 'loading';
          })
          .addCase(fetchProducts.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.items = action.payload;
          })
          .addCase(fetchProducts.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
          })
          .addCase(fetchProductsByCategory.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
            state.loading = false;
            state.items = action.payload;
          })
          .addCase(fetchProductsByCategory.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
          })
          .addCase(fetchProductsBySearch.pending, (state) => {
            state.status = 'loading';
            state.isSearching = true; 
          })
          .addCase(fetchProductsBySearch.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.items = action.payload;
            state.isSearching = true;
          })
          .addCase(fetchProductsBySearch.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.payload;
          })
          .addCase(fetchProductById.pending, (state) => {
            state.status = 'loading';
            state.error = null;
            state.isSearching = false;
          })
          .addCase(fetchProductById.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.product = action.payload;
          })
          .addCase(fetchProductById.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.payload;
          });
          
      },
  })

  export const { setSearchTerm,setSearching } = productSlice.actions
export default productSlice.reducer;