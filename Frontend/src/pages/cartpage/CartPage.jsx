import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchCart, removeCartItem, updateCartItem, clearCart } from "../../redux/slices/cartSlice";
import { toast } from "react-toastify";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { getImageUrl } from "../../utils/imageUrl";
const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, status, error } = useSelector((state) => state.cart);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  // Check authentication on component mount
  useEffect(() => {
    console.log("CartPage - Authentication check:", { isLoggedIn });
    
    if (!isLoggedIn) {
      toast.warning("Please login to view your cart", {
        position: "top-right",
        autoClose: 2000,
      });
      navigate("/login", { 
        state: { 
          from: "/cart",
          message: "Login required to access cart" 
        } 
      });
    }
  }, [isLoggedIn, navigate]);

  // Load cart only if user is logged in
  useEffect(() => {
    if (isLoggedIn) {
      dispatch(fetchCart());
    }
  }, [dispatch, isLoggedIn]);

  // If not logged in, show loading or redirect message
  if (!isLoggedIn) {
    return <LoadingSpinner text="Redirecting to login..." />;
  }

  const handleRemoveItem = (productId) => {
    if (!isLoggedIn) {
      toast.warning("Please login to modify cart");
      navigate("/login");
      return;
    }
    dispatch(removeCartItem(productId));
  };

  const handleUpdateItem = (productId, quantity) => {
    if (!isLoggedIn) {
      toast.warning("Please login to modify cart");
      navigate("/login");
      return;
    }
    
    if (quantity <= 0) {
      dispatch(removeCartItem(productId));
    } else {
      dispatch(updateCartItem({ productId, quantity }));
    }
  };

  const handleClearCart = () => {
    if (!isLoggedIn) {
      toast.warning("Please login to modify cart");
      navigate("/login");
      return;
    }
    dispatch(clearCart());
  };

  const handleCheckout = () => {
    if (!isLoggedIn) {
      toast.warning("Please login to proceed to checkout");
      navigate("/login", { 
        state: { 
          from: "/cart",
          message: "Login required for checkout" 
        } 
      });
      return;
    }
    
    if (items.length === 0) {
      toast.warning("Your cart is empty");
      return;
    }
    
    navigate("/checkout", { state: { cartItems: items } });
  };

  const validCartItems = items?.filter(
  item => item && item.productId
) || [];

  // Rest of your cart page JSX remains the same...
  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Your Cart</h2>

      {/* Loading state */}
      {status === "loading" && (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p>Loading cart...</p>
        </div>
      )}

      {/* Error state */}
      {status === "failed" && (
        <div className="alert alert-danger text-center" role="alert">
          Failed to load cart: {error}
          <button 
            onClick={() => dispatch(fetchCart())}
            className="btn btn-warning btn-sm ms-3"
          >
            Retry
          </button>
        </div>
      )}

      {/* Empty cart */}
      { validCartItems.length === 0 && status === "succeeded" ? (
        <div className="alert alert-info text-center" role="alert">
          <h4>Your cart is empty</h4>
          <p>Add some products to get started!</p>
          <button 
            onClick={() => navigate("/")}
            className="btn btn-primary"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="row">
          {/* Cart validCartItems grid */}
          {validCartItems
          
          .map((item, index) => (
            <div key={`${item.productId._id}-${index}`} className="col-md-6 col-lg-4 mb-4">
              <div className="card h-100 shadow-sm">
                <div
                  className="card-img-top-container d-flex align-items-center justify-content-center"
                  style={{ height: "200px", overflow: "hidden" }}
                >
                  <img
                    src={item.productId.image}
                    className="w-75 h-75 object-fit-contain p-2"
                    alt={item.productId.name}
                  />
                </div>
                <div className="card-body">
                  <h4 className="card-title">{item.productId.name}</h4>
                  <p className="card-text text-muted">{item.productId.prodDec}</p>
                  <p className="card-text">Quantity: {item.quantity}</p>
                  <p className="card-text">Price: ${item.productId.price}</p>
                  <div className="d-flex justify-content-between align-items-center">
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => handleUpdateItem(item.productId._id, item.quantity + 1)}
                    >
                      +
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleUpdateItem(item.productId._id, item.quantity - 1)}
                    >
                      -
                    </button>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleRemoveItem(item.productId._id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Cart actions */}
      {items.length > 0 && (
        <div className="text-center mt-4">
          <div className="d-flex justify-content-center gap-3">
            <button className="btn btn-danger btn-lg" onClick={handleClearCart}>
              Clear Cart
            </button>
            <button className="btn btn-primary btn-lg" onClick={handleCheckout}>
              Proceed to Checkout
            </button>
          </div>
          
          {/* Cart Summary */}
          <div className="card mt-4">
            <div className="card-body">
              <h5>Cart Summary</h5>
              <hr />
              <div className="d-flex justify-content-between">
                <span>Total Items:</span>
                <strong>{validCartItems.reduce((acc, item) => acc + item.quantity, 0)}</strong>
              </div>
              <div className="d-flex justify-content-between mt-2">
                <span>Total Price:</span>
                <strong className="text-success fs-4">
                  ${validCartItems.reduce((acc, item) => acc + (item.productId.price * item.quantity), 0).toFixed(2)}
                </strong>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;