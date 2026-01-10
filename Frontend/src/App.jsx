import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import Navbar from "./components/Navbar/Navbar"
import HomePage from "./pages/HomePage/HomePage"
import CartPage from "./pages/cartpage/CartPage"
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SignupPage from "./pages/SignIn/SignupPage";
import LoginPage from "./pages/Login/LoginPage";
import ProductDetail from "./pages/ProductList/ProductDetail";
import WishlistPage from "./pages/Wishlist/WishlistPage";
import ProtectedRoute from "./components/ProtectedRoute";
import OrdersPage from "./pages/ordersPage/OrdersPage";
import Profile from "./pages/profilepage/UserProfile";
import CategoryPage from "./pages/categoryPage/CategoryPage";
import CheckoutPage from "./pages/checkout/CheckoutPage";
import PaymentPage from "./pages/payment/PaymentPage";
import ContactPage from "./pages/contact/ContactPage";

import AdminLayout from "./components/layout/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminUsers from "./pages/admin/AdminUsers";
import AddEditProduct from "./pages/admin/AddEditProduct";

// Import AdminProtectedRoute correctly
import AdminProtectedRoute from "./components/AdminProtectedRoute";

// Import debug component
import LoginDebug from "./components/Debug/LoginDebug";

function App() {
  return (
    <>
      <ToastContainer />
      <LoginDebug /> {/* Add debug component */}
      <Router>
        <Routes>
          {/* Public Routes - Navbar visible */}
          <Route path="/*" element={
            <>
              <Navbar />
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/products/:id" element={<ProductDetail />} />
                <Route path="/category/:id" element={<CategoryPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/contact" element={<ContactPage />} />

                <Route element={<ProtectedRoute />}>
                  <Route path="/wishlist" element={<WishlistPage />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/orders" element={<OrdersPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/payment" element={<PaymentPage />} />
                </Route>
                
                <Route path="*" element={<div className="container py-5 text-center"><h2>404 - Page Not Found</h2></div>} />
              </Routes>
            </>
          } />

          {/* Admin Routes - Separate Layout */}
          <Route element={<AdminProtectedRoute />}>
            <Route path="/admin/*" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="products/add" element={<AddEditProduct />} />
              <Route path="products/edit/:id" element={<AddEditProduct />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="analytics" element={<AdminAnalytics />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="*" element={<div className="p-5"><h3>Admin Page Not Found</h3></div>} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </>
  )
}

export default App