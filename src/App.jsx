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


function App() {
  return(
    <>
    <ToastContainer/>
    <Router>
        <Navbar/>
        <Routes>
          <Route path="/" element={<HomePage/>}/>
          <Route path="/cart" element={<CartPage/>}/>
          <Route path="signup" element={<SignupPage/>}/>
          <Route path="login" element={<LoginPage/>}/>
          <Route path="/wishlist" element={<WishlistPage/>}/>
          <Route path="/product/:id" element={<ProductDetail/>}/>
        </Routes>
    </Router>
     
    </>
  )
}

export default App
