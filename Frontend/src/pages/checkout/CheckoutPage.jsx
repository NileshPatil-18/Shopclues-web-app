import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { placeOrder } from "../../redux/slices/orderSlice";
import { useNavigate } from "react-router-dom";

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items:cartItems =[] } = useSelector((state) => state.cart || {});
  const { loading, error } = useSelector((state) => state.order);

  const totalPrice = cartItems.reduce((acc, item) => acc + item.productId.price * item.quantity, 0);

  const [orderData, setOrderData] = useState({
    paymentMethod: "",
    address: "",
  });

  const handleChange = (e) => {
    setOrderData({ ...orderData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(placeOrder({ ...orderData, cartItems, totalPrice })).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        navigate("/orders");
      }
    });
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        {/* Order Summary Section */}
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

        {/* Checkout Form */}
        <div className="col-lg-5">
          <div className="card shadow-lg border-0 p-4">
            <h2 className="text-center fw-bold mb-3 text-primary">Checkout</h2>
            {error && <p className="alert alert-danger">{error}</p>}

            <form onSubmit={handleSubmit}>
              {/* Address Input */}
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

              {/* Payment Method Selection */}
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

              {/* Submit Button */}
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
