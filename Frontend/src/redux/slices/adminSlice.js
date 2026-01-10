import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import api from '../../utils/api';

export const fetchAdminProducts = createAsyncThunk(
    "admin/fetchAdminProducts",
    async(params,{rejectWithValue})=>{
        try {
            const response = await api.get('/admin/products',{params});
            return response.data;
            
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "failed to fetch products");
            
        }
    }
);

// Create new product
export const createProduct = createAsyncThunk(
    "admin/createProduct",
    async (productData, { rejectWithValue }) => {
        try {
            const response = await api.post("/admin/products", productData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to create product");
        }
    }
);

// Update product
export const updateProduct = createAsyncThunk(
    "admin/updateProduct",
    async ({ id, productData }, { rejectWithValue }) => {
        try {
            const response = await api.put(`/admin/products/${id}`, productData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to update product");
        }
    }
);

// Delete product
export const deleteProduct = createAsyncThunk(
    "admin/deleteProduct",
    async (id, { rejectWithValue }) => {
        try {
            await api.delete(`/admin/products/${id}`);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to delete product");
        }
    }
);

// Get admin orders
export const fetchAdminOrders = createAsyncThunk(
    "admin/fetchAdminOrders",
    async (params, { rejectWithValue }) => {
        try {
            const response = await api.get("/admin/orders", { params });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch orders");
        }
    }
);

// Update order status
export const updateOrderStatus = createAsyncThunk(
    "admin/updateOrderStatus",
    async ({ orderId, status }, { rejectWithValue }) => {
        try {
            const response = await api.put(`/admin/orders/${orderId}/status`, { status });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to update order status");
        }
    }
);

export const getOrderAnalytics = createAsyncThunk(
    "admin/getOrderAnalytics",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get("/admin/analytics/orders");
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch analytics");
        }
    }
);

const adminSlice = createSlice({
    name: "admin",
    initialState: {
        products: [],
        orders: [],
        analytics: {},
        loading: false,
        error: null,
        success: false
    },
    reducers: {
        clearAdminError: (state) => {
            state.error = null;
        },
        clearAdminSuccess: (state) => {
            state.success = false;
        }
    },
    extraReducers: (builder) => {
        // Product reducers
        builder
            .addCase(fetchAdminProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAdminProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload.products;
            })
            .addCase(fetchAdminProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(createProduct.fulfilled, (state, action) => {
                state.success = true;
                state.products.unshift(action.payload.product);
            })
            .addCase(updateProduct.fulfilled, (state, action) => {
                state.success = true;
                const index = state.products.findIndex(p => p._id === action.payload.product._id);
                if (index !== -1) {
                    state.products[index] = action.payload.product;
                }
            })
            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.success = true;
                state.products = state.products.filter(p => p._id !== action.payload);
            })
            
        // Order reducers
        .addCase(fetchAdminOrders.fulfilled, (state, action) => {
                state.orders = action.payload.orders;
            })
            .addCase(updateOrderStatus.fulfilled, (state, action) => {
                state.success = true;
                const index = state.orders.findIndex(o => o._id === action.payload.order._id);
                if (index !== -1) {
                    state.orders[index] = action.payload.order;
                }
            })
              .addCase(getOrderAnalytics.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getOrderAnalytics.fulfilled, (state, action) => {
                state.loading = false;
                state.analytics = action.payload.analytics;
            })
            .addCase(getOrderAnalytics.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

            
    }
});

export const { clearAdminError, clearAdminSuccess } = adminSlice.actions;
export default adminSlice.reducer;