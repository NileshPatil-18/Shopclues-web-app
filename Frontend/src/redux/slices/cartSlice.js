import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// API Base URL (Change according to your backend)
const API_URL = "https://shopclues-xr1j.onrender.com/api/cart";  

// 🔹 Add Item to Cart
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ productId, quantity }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;  // Get user token from auth state
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ items: [{ productId, quantity }] }),
      });

      if (!response.ok) throw new Error("Failed to add item to cart");

      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 🔹 Get Cart Items
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await fetch(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch cart");

      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 🔹 Update Cart Item Quantity
export const updateCartItem = createAsyncThunk(
  "cart/updateCartItem",
  async ({ productId, quantity }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await fetch(`${API_URL}/item`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, quantity }),
      });

      if (!response.ok) throw new Error("Failed to update cart item");

      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 🔹 Remove Item from Cart
export const removeCartItem = createAsyncThunk(
  "cart/removeCartItem",
  async (productId, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await fetch(`${API_URL}/item`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId }),
      });

      if (!response.ok) throw new Error("Failed to remove item");

      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 🔹 Clear Cart
export const clearCart = createAsyncThunk(
  "cart/clearCart",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await fetch(API_URL, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to clear cart");

      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    status: "idle", // idle | loading | succeeded | failed
    error: null,
  },
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        console.log("Cart Data:", action.payload);
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(addToCart.pending, (state) => {
        state.status = "loading";
      })
      
      .addCase(addToCart.fulfilled, (state, action) => {
        state.items = action.payload.cart;
      })
      .addCase(addToCart.rejected, (state, action) => {
        console.error(action.payload);
      })
      .addCase(updateCartItem.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.items = action.payload.cart.items;
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        console.error(action.payload);
      })
      .addCase(removeCartItem.pending, (state) => {
        state.status = "loading";
      })
      .addCase(removeCartItem.fulfilled, (state, action) => {
        state.items = action.payload.cart.items;
      })
      .addCase(removeCartItem.rejected, (state, action) => {
        console.error(action.payload);
      })
      .addCase(clearCart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.items = [];
      })
      .addCase(clearCart.rejected, (state, action) => {
        console.error(action.payload);
      });  
  },
});

export default cartSlice.reducer;
