import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeFromCart } from "../../redux/slices/cartSlice";
import { useNavigate } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";

const CartPage = () => {
  const cart = useSelector((state) => state.cart);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <div className="container py-5">
      <div className="card shadow p-4">
        <h2 className="text-center text-primary fw-bold mb-4">
          <FaShoppingCart className="me-2" /> Shopping Cart
        </h2>

        {/* Empty Cart Message */}
        {cart.length === 0 || !isLoggedIn ? (
          <div className="d-flex flex-column align-items-center py-5">
            <FaShoppingCart className="text-secondary display-3 mb-3" />
            <p className="text-muted fs-5">You don't have any product in your cart.</p>
          </div>
        ) : (
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-2">
            {cart.map((item) => (
              <div key={item.id} className="col">
                <div className="card h-75 shadow-sm" style={{ maxWidth: "280px", margin: "auto" }}>
                  <div className="d-flex justify-content-center align-items-center" style={{ height: "200px", overflow: "hidden" }}>
                    <img src={item.image} alt={item.title} className="w-75 h-75 object-fit-contain pt-1" />
                  </div>
                  <div className="card-body text-center">
                    <h5 className="card-title fw-bold fs-6">{item.title}</h5>
                    <p className="text-success fw-semibold fs-6">${item.price}</p>
                    <p className="text-muted">Qty: {item.quantity}</p>
                  </div>
                  <div className="card-footer bg-white border-0 d-flex justify-content-center gap-2">
                    <button className="btn btn-danger btn-sm" onClick={() => dispatch(removeFromCart(item.id))}>
                      ❌ Remove
                    </button>
                    <button className="btn btn-primary btn-sm" onClick={() => navigate("/checkout")}>
                      🛍 Buy Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;