import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:8080/api";

// ✅ Fetch user orders
export const fetchUserOrders = createAsyncThunk(
    "orders/fetchUserOrders",
    async (_, { getState, rejectWithValue }) => {
      try {
        const token = getState().auth.token;
        //console.log("Token being sent:", token); // Debugging token
        if (!token) return rejectWithValue("No token found");
  
        const response = await axios.get(`${API_URL}/orders`, {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to fetch orders");
      }
    }
  );
  

// ✅ Fetch all orders (Admin)
export const fetchAllOrders = createAsyncThunk("orders/fetchAllOrders", async (_, { getState, rejectWithValue }) => {
  try {
    const token = getState().auth.userToken;
    const response = await axios.get(`${API_URL}/admin/orders`, {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch orders");
  }
});

// ✅ Place an order
export const placeOrder = createAsyncThunk("orders/placeOrder", async (orderData, { getState, rejectWithValue }) => {
  try {
    const token = getState().auth.token || getState().auth.user?.token;  // ✅ Use proper token field
    if (!token) return rejectWithValue("User authentication failed");

    const response = await axios.post(`${API_URL}/orders`, orderData, {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Order placement failed");
  }
});

// ✅ Update order status (Admin)
export const updateOrderStatus = createAsyncThunk("orders/updateOrderStatus", async ({ orderId, status }, { getState, rejectWithValue }) => {
  try {
    const token = getState().auth.userToken;
    const response = await axios.put(
      `${API_URL}/orders/${orderId}/status`,
      { status },
      {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to update order status");
  }
});

const orderSlice = createSlice({
  name: "orders",
  initialState: {
    userOrders: [],
    allOrders: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserOrders.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.userOrders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.allOrders = action.payload;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.allOrders = state.allOrders.map(order =>
          order._id === action.payload.order._id ? action.payload.order : order
        );
      })
      .addCase(placeOrder.pending, (state) => {
        state.status = "loading";
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.status = "succeeded";
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default orderSlice.reducer;
