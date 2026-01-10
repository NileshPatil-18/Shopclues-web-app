import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "https://shopclues-xr1j.onrender.com/api/categories"; 

//  Fetch all categories
export const fetchCategories = createAsyncThunk(
    "categories/fetchCategories",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(API_URL);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch categories");
        }
    }
);

//  Add a new category
export const addCategory = createAsyncThunk(
    "categories/addCategory",
    async (categoryData, { rejectWithValue }) => {
        try {
            const response = await axios.post(API_URL, categoryData);
            return response.data.category;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to add category");
        }
    }
);

//  Update category
export const updateCategory = createAsyncThunk(
    "categories/updateCategory",
    async ({ id, categoryData }, { rejectWithValue }) => {
        try {
            const response = await axios.put(`${API_URL}/${id}`, categoryData);
            return response.data.category;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to update category");
        }
    }
);

//  Delete category
export const deleteCategory = createAsyncThunk(
    "categories/deleteCategory",
    async (id, { rejectWithValue }) => {
        try {
            await axios.delete(`${API_URL}/${id}`);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to delete category");
        }
    }
);


const categorySlice = createSlice({
    name: "categories",
    initialState: {
        categories: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            
            .addCase(fetchCategories.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.loading = false;
                state.categories = action.payload;
            })
            .addCase(fetchCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

           
            .addCase(addCategory.fulfilled, (state, action) => {
                state.categories.push(action.payload);
            })

            .addCase(updateCategory.fulfilled, (state, action) => {
                const index = state.categories.findIndex((cat) => cat._id === action.payload._id);
                if (index !== -1) {
                    state.categories[index] = action.payload;
                }
            })

            .addCase(deleteCategory.fulfilled, (state, action) => {
                state.categories = state.categories.filter((cat) => cat._id !== action.payload);
            });
    },
});

export default categorySlice.reducer;
