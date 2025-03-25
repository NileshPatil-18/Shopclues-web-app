import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { placeOrder } from "../../redux/slices/orderSlice";
import { useNavigate } from "react-router-dom";

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: cartItems = [] } = useSelector((state) => state.cart || {});
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
    if (orderData.paymentMethod === "Cash on Delivery") {
      dispatch(placeOrder({ ...orderData, cartItems, totalPrice })).then((res) => {
        if (res.meta.requestStatus === "fulfilled") {
          navigate("/orders");
        }
      });
    } else {
      navigate("/payment");
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
              <ul className="list-group">
                {cartItems.map((item) => (
                  <li key={item._id} className="list-group-item d-flex justify-content-between align-items-center">
                    <strong>{item.productId.name}</strong> <br />
                    <small>Quantity: {item.quantity}</small>
                    <span className="fw-bold">${item.productId.price * item.quantity}</span>
                  </li>
                ))}
                <li className="list-group-item d-flex justify-content-between">
                  <strong>Total Price:</strong> <span className="fw-bold text-success">${totalPrice}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="col-lg-5">
          <div className="card shadow-lg border-0 p-4">
            <form onSubmit={handleSubmit}>
              <label className="form-label fw-bold">Payment Method</label>
              <select name="paymentMethod" onChange={handleChange} required className="form-select p-2">
                <option value="">Select Payment Method</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Paypal">Paypal</option>
                <option value="Cash on Delivery">Cash on Delivery</option>
              </select>
              <button type="submit" className="btn btn-primary w-100 py-2 mt-3">
                Proceed
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
