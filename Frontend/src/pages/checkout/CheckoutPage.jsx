import React, { useState,useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { placeOrder } from "../../redux/slices/orderSlice";
import { useNavigate } from "react-router-dom";
import {toast} from "react-toastify";

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: cartItems = [] } = useSelector((state) => state.cart || {});
  const { loading, error } = useSelector((state) => state.orders);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  
  const totalPrice = cartItems.reduce((acc, item) => acc + item.productId.price * item.quantity, 0);

  const [orderData, setOrderData] = useState({
    paymentMethod: "",
    address: "",
  });

  // Check authentication on mount
  useEffect(() => {
    if (!isLoggedIn) {
      toast.error("Please login to proceed with payment");
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  const handleChange = (e) => {
    setOrderData({ ...orderData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!isLoggedIn) {
      toast.error("Please login to place an order");
      navigate("/login");
      return;
    }

    if (!orderData.paymentMethod) {
      toast.error("Please select a payment method!");
      return;
    }

    if (orderData.paymentMethod === "Cash on Delivery") {
      dispatch(placeOrder({ ...orderData, cartItems, totalPrice })).then((res) => {
        if (res.meta.requestStatus === "fulfilled") {
          toast.success("Order placed successfully!");
          navigate("/orders");
        }
      });
    } else {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Authentication token missing. Please login again.");
        navigate("/login");
        return;
      }

      navigate("/payment", { 
        state: { 
          orderData: {
            ...orderData,
            paymentStatus: "Pending"
          }, 
          cartItems, 
          totalPrice,
          authToken: token // Pass token for verification
        } 
      });
    }
  };
  

  return (
    <div className="container py-5">
      <div className="row justify-content-center">

        <div className="col-lg-5 mb-4">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-primary text-white">
              <h4 className="mb-0">Order Summary</h4>
            </div>
            <div className="card-body">
              {cartItems.length === 0 ? (
                <p className="text-muted">Your cart is empty.</p>
              ) : (
                <ul className="list-group">
                  {cartItems.map((item) => (
                    <li key={item._id} className="list-group-item d-flex justify-content-between align-items-center">
                        <img 
                          src={item.productId.image} 
                          alt={item.productId.name} 
                          className="me-3 rounded" 
                          style={{ width: "50px", height: "50px", objectFit: "cover" }} 
                        />
                      <div>
                        <strong>{item.productId.name}</strong> <br />
                        <small>Quantity: {item.productId.quantity}</small>
                      </div>
                      <span className="fw-bold">${item.productId.price * item.quantity}</span>
                    </li>
                  ))}
                  <li className="list-group-item d-flex justify-content-between">
                    <strong>Total Price:</strong> <span className="fw-bold text-success">${totalPrice}</span>
                  </li>
                </ul>
              )}
            </div>
          </div>
        </div>

        <div className="col-lg-5">
          <div className="card shadow-lg border-0 p-4">
            <h2 className="text-center fw-bold mb-3 text-primary">Checkout</h2>
            {error && <p className="alert alert-danger">{error}</p>}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-bold">Shipping Address</label>
                <input
                  type="text"
                  name="address"
                  placeholder="Enter your address"
                  value={orderData.address}
                  onChange={handleChange}
                  className="form-control p-2"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold">Payment Method</label>
                <select
                  name="paymentMethod"
                  value={orderData.paymentMethod}
                  onChange={handleChange}
                  className="form-select p-2"
                  required
                >
                  <option value="">Select Payment Method</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Paypal">Paypal</option>
                  <option value="Cash on Delivery">Cash on Delivery</option>
                </select>
              </div>

              <div className="text-center">
                <button
                  type="submit"
                  className="btn btn-primary w-100 py-2 fw-bold"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Placing Order...
                    </>
                  ) : (
                    "Place Order"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
