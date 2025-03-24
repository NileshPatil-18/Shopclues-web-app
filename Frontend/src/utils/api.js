import axios from "axios";
import { store } from ""; // Import Redux store
import { logout } from "../redux/slices/authSlice"; // Import logout action

// Create an Axios instance
const api = axios.create({
  baseURL: "http://localhost:8080/api", // Your backend URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Axios response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response, // If response is fine, return it
  (error) => {
    if (error.response && error.response.status === 401) {
      alert("Session expired. Please log in again.");
      
      // Dispatch logout action to clear user data
      store.dispatch(logout());

      // Redirect to login page
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
