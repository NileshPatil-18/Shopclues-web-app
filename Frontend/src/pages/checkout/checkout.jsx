import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { placeOrder } from "../../redux/slices/orderSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.items || []);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [address, setAddress] = useState("");

  console.log("Cart Items in Checkout:", cartItems);  // Debugging

  const handlePlaceOrder = () => {
    if (!isLoggedIn) {
      toast.error("Please log in to place an order!");
      navigate("/login");
      return;
    }

    if (cartItems.length === 0) {
      toast.warning("Your cart is empty!");
      return;
    }

    if (!address.trim()) {
      toast.error("Please enter a valid address!");
      return;
    }

    const orderData = {
      items: cartItems.map((item) => ({
        productId: item._id,  // Ensure correct mapping
        quantity: item.quantity,
      })),
      totalPrice: cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
      paymentMethod,
      address,
    };

    console.log("Placing Order with Data:", orderData); // Debugging

    dispatch(placeOrder(orderData))
      .unwrap()
      .then((response) => {
        console.log("Order Response:", response); // Debugging
        toast.success("Order placed successfully!");
        navigate("/orders");
      })
      .catch((error) => {
        toast.error(error || "Order placement failed!");
      });
  };

  return (
    <div className="container py-5">
      <h2 className="mb-4">Checkout</h2>

      <div className="card p-4 shadow">
        <h4>Order Summary</h4>
        {cartItems.map((item) => (
          <div key={item._id} className="d-flex justify-content-between my-2">
            <span>{item.name} (x{item.quantity})</span>
            <span>${item.price * item.quantity}</span>
          </div>
        ))}

        <hr />
        <h5>Total: ${cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)}</h5>

        <div className="mt-3">
          <label className="form-label">Shipping Address</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter your address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        <div className="mt-3">
          <label className="form-label">Payment Method</label>
          <select className="form-select" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
            <option value="COD">Cash on Delivery</option>
            <option value="Online">Online Payment</option>
          </select>
        </div>

        <button className="btn btn-success w-100 mt-3" onClick={handlePlaceOrder}>
          ✅ Place Order
        </button>
      </div>
    </div>
  );
};

export default Checkout;
