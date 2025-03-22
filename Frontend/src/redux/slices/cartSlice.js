import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api"; // Update with your backend URL

// Async Thunks
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ userId, productId, quantity }, { rejectWithValue }) => {
    try {
      // Construct the payload according to the backend's expectations
      const payload = {
        userId,
        items: [
          {
            productId,
            quantity: quantity || 1, // Default to 1 if quantity is not provided
          },
        ],
      };

      console.log("Sending payload:", payload); // Log the payload for debugging

      const response = await axios.post(`${API_BASE_URL}/cart`, payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      return response.data;
    } catch (error) {
      if (!error.response) {
        return rejectWithValue({ message: "Network error: Unable to connect to the server." });
      }
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { user } = getState().auth;
      const userId = user?.id; // Include userId if required

      const response = await axios.get(`${API_BASE_URL}/cart`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        params: { userId }, // Include userId if required
      });
      return response.data;
    } catch (error) {
      if (!error.response) {
        return rejectWithValue({ message: "Network error: Unable to connect to the server." });
      }
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateCartItem = createAsyncThunk(
  "cart/updateCartItem",
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/cart`, { productId, quantity }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      return response.data;
    } catch (error) {
      if (!error.response) {
        return rejectWithValue({ message: "Network error: Unable to connect to the server." });
      }
      return rejectWithValue(error.response.data);
    }
  }
);

export const removeCartItem = createAsyncThunk(
  "cart/removeCartItem",
  async ({ userId, productId }, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/cart/item`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        data: { userId, productId }, // Ensure userId is passed correctly
      });
      return response.data;
    } catch (error) {
      if (!error.response) {
        return rejectWithValue({ message: "Network error: Unable to connect to the server." });
      }
      return rejectWithValue(error.response.data);
    }
  }
);

export const clearCart = createAsyncThunk(
  "cart/clearCart",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/cart`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        data: { userId }, // Ensure userId is passed correctly
      });
      return response.data;
    } catch (error) {
      if (!error.response) {
        return rejectWithValue({ message: "Network error: Unable to connect to the server." });
      }
      return rejectWithValue(error.response.data);
    }
  }
);

// Cart Slice
const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addToCart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.message;
      })
      .addCase(fetchCart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.message;
      })
      .addCase(updateCartItem.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.message;
      })
      .addCase(removeCartItem.pending, (state) => {
        state.status = "loading";
      })
      .addCase(removeCartItem.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = state.items.filter(
          (item) => item.productId !== action.payload.productId
        );
      })
      .addCase(removeCartItem.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.message;
      })
      .addCase(clearCart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.status = "succeeded";
        state.items = [];
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.message;
      });
  },
});

export default cartSlice.reducer;