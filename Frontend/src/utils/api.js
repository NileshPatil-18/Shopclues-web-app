import axios from "axios";
import { store } from "../redux/store";
import { logoutUser } from "../redux/slices/authSlice";

// Use environment variable with fallback
const API_BASE_URL = import.meta.env.VITE_API_URL || "https://shopclues-xr1j.onrender.com";

console.log('🌐 API Base URL:', API_BASE_URL);

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    console.log('📤 Request:', {
      url: config.url,
      method: config.method,
      hasToken: !!token
    });
    
    return config;
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('✅ Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    const { response } = error;
    
    console.error('❌ API Error:', {
      url: error.config?.url,
      status: response?.status,
      statusText: response?.statusText,
      error: response?.data?.message || response?.data?.error || 'Unknown error'
    });
    
    if (response?.status === 401) {
      console.log('🔐 401 Unauthorized - Logging out');
      
      // Show toast if available
      if (typeof window !== 'undefined' && window.toast) {
        window.toast.error("Session expired. Please login again.");
      }
      
      // Dispatch logout
      store.dispatch(logoutUser());
      
      // Redirect after a delay
      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
    }
    
    return Promise.reject(error);
  }
);

export default api;