import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../utils/api"; // ✅ Use your api.js instead of fetch

export const createPaymentIntent = createAsyncThunk(
  "payment/createPaymentIntent",
  async (amount, { rejectWithValue, getState }) => {
    try {
      console.log("Creating payment intent for amount:", amount);
      
      // Check if user is logged in
      const state = getState();
      const isLoggedIn = state.auth.isLoggedIn;
      const token = localStorage.getItem("token");
      
      if (!isLoggedIn || !token) {
        throw new Error("User not authenticated. Please login first.");
      }

      // Convert to cents for Stripe (amount should already be in cents from PaymentPage)
      const amountInCents = Math.round(amount);
      
      if (amountInCents < 50) { // Minimum $0.50
        throw new Error("Payment amount too small");
      }

      const response = await api.post("/payments/create-payment-intent", {
        amount: amountInCents,
        currency: "usd"
      });

      console.log("Payment intent response:", response.data);

      if (!response.data.clientSecret) {
        throw new Error("No client secret returned from server");
      }

      return response.data.clientSecret;
    } catch (error) {
      console.error("Payment Intent Error:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      return rejectWithValue(
        error.response?.data?.message || 
        error.message || 
        "Failed to create payment intent"
      );
    }
  }
);

const paymentSlice = createSlice({
  name: "payment",
  initialState: {
    clientSecret: null,
    loading: false,
    error: null,
    paymentStatus: "idle",
  },
  reducers: {
    resetPayment: (state) => {
      state.clientSecret = null;
      state.loading = false;
      state.error = null;
      state.paymentStatus = "idle";
    },
    clearPaymentError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createPaymentIntent.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.paymentStatus = "loading";
      })
      .addCase(createPaymentIntent.fulfilled, (state, action) => {
        state.loading = false;
        state.clientSecret = action.payload;
        state.paymentStatus = "succeeded";
        state.error = null;
      })
      .addCase(createPaymentIntent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.paymentStatus = "failed";
        state.clientSecret = null;
      });
  },
});

export const { resetPayment, clearPaymentError } = paymentSlice.actions;
export default paymentSlice.reducer;