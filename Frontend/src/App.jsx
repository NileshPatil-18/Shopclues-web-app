import { BrowserRouter as Router,Route,Routes } from "react-router-dom"
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
function App() {
  return(
    <>
    <ToastContainer/>
    <Router>
        <Navbar/>
        <Routes>
          <Route path="/" element={<HomePage/>}/>
          <Route path="/signup" element={<SignupPage/>}/>
          <Route path="/login" element={<LoginPage/>}/>
          <Route path="/products/:id" element={<ProductDetail/>}/>
          <Route path="/category/:id" element={<CategoryPage />} />
          <Route path='checkout' element={<CheckoutPage/>}/>
          <Route path="/cart" element={<CartPage/>}/>       
          <Route path="/orders" element={<OrdersPage/>}/>
          <Route path="/payment" element={<PaymentPage/>}/>
          <Route path="/contact" element={<ContactPage/>}/>

          <Route element={<ProtectedRoute/>}>    
                <Route path="/wishlist" element={<WishlistPage/>}/>
                <Route path="/profile" element={<Profile/>}/>
          </Route>
        </Routes>
    </Router>  
    </>
  )
}

export default App
