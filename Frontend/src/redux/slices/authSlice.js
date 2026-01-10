import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = import.meta.env.API_BASE_URL || "https://shopclues-xr1j.onrender.com";

//const API_BASE_URL = "https://shopclues-xr1j.onrender.com/api";

// Load user and token from localStorage on page refresh
const initialState = {
  user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null,
  token: localStorage.getItem("token") || null,
  isLoggedIn: localStorage.getItem("isLoggedIn") === "true", // Handle boolean correctly
  error: null,
  loading: false,
};

export const loginUser = createAsyncThunk("auth/loginUser", async (userData, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/login`, userData);

     console.log('=== FULL LOGIN RESPONSE ===');
    console.log('Response status:', response.status);
    console.log('Response data:', response.data);
    console.log('User object from API:', response.data.user);
    console.log('User role from API:', response.data.user?.role);
    console.log('===========================');
    
    const { user, token } = response.data;


     console.log('API Response user object:', user);
    console.log('Has role property?', 'role' in user);

     if (!user.role) {
      console.log('Role missing, checking if admin email...');
      // Check if this is likely an admin (by email pattern)
      const isAdminEmail = user.email.includes('admin') || 
                          user.email === 'admin@example.com' ||
                          user.email === 'admin@shopclues.com';
      
      user.role = isAdminEmail ? 'admin' : 'user';
      console.log('Assigned role:', user.role);
    }
    
    // Store user, token, and isLoggedIn in localStorage
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);
    localStorage.setItem("isLoggedIn", "true"); // Store isLoggedIn as a string

    return { user, token };
  } catch (error) {
    return rejectWithValue(error.response?.data || "Login failed");
  }
});

export const registerUser = createAsyncThunk("auth/registerUser", async (userData, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/register`, userData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const { user, token } = response.data;

    // Store user, token, and isLoggedIn in localStorage
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);
    localStorage.setItem("isLoggedIn", "true"); // Store isLoggedIn as a string

    return { user, token };
  } catch (error) {
    return rejectWithValue(error.response?.data || "Registration failed");
  }
});

export const logoutUser = createAsyncThunk("auth/logoutUser", async () => {
  // Remove user, token, and isLoggedIn from localStorage
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  localStorage.removeItem("isLoggedIn");
  return null;
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {}, 
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
         console.log('Login successful, payload:', action.payload);
  console.log('User object from API:', action.payload.user);
  console.log('User role from API:', action.payload.user?.role);

        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isLoggedIn = true; 
        state.loading = false;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed";
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isLoggedIn = true; 
        state.loading = false;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Registration failed";
      })
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isLoggedIn = false; 
        state.loading = false;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Logout failed";
      });
  },
});

export default authSlice.reducer;