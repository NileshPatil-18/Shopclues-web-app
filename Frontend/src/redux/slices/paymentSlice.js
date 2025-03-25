import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async action to create a payment intent
export const createPaymentIntent = createAsyncThunk(
    "payment/createPaymentIntent",
    async (amount, { rejectWithValue }) => {
        try {
            const response = await axios.post("http://localhost:8080/api/payments/create-payment-intent", {
                amount,
                currency: "usd"
            }, { withCredentials: true });
            return response.data.clientSecret;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Payment failed");
        }
    }
);

const paymentSlice = createSlice({
    name: "payment",
    initialState: {
        clientSecret: "",
        loading: false,
        error: null
    },
    reducers: {},
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
    }
});

export default paymentSlice.reducer;