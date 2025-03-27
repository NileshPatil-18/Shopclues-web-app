import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const createPaymentIntent = createAsyncThunk(
  "payment/createPaymentIntent",
  async (amount, { rejectWithValue }) => {
    try {
      const response = await fetch("https://shopclues-xr1j.onrender.com/api/payments/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ amount, currency: "usd" }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Payment Intent Failed");

      return data.clientSecret;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const paymentSlice = createSlice({
  name: "payment",
  initialState: {
    clientSecret: null,
    loading: false,
    error: null,
  },
  reducers: {
    resetPayment: (state) => {
      state.clientSecret = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createPaymentIntent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPaymentIntent.fulfilled, (state, action) => {
        state.loading = false;
        state.clientSecret = action.payload;
      })
      .addCase(createPaymentIntent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetPayment } = paymentSlice.actions;
export default paymentSlice.reducer;
