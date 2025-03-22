import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart, removeCartItem, updateCartItem, clearCart } from "../../redux/slices/cartSlice";

const CartPage = () => {
  const dispatch = useDispatch();
  const { items, status, error } = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch(fetchCart()); // Load cart when page loads
  }, [dispatch]);

  const handleRemoveItem = (productId) => {
    dispatch(removeCartItem(productId));
  };

  const handleUpdateItem = (productId, quantity) => {
    if (quantity <= 0) {
      dispatch(removeCartItem(productId)); // Remove item if quantity <= 0
    } else {
      dispatch(updateCartItem({ productId, quantity }));
    }
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Your Cart</h2>

      {status === "loading" && (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p>Loading cart...</p>
        </div>
      )}

      {status === "failed" && (
        <div className="alert alert-danger text-center" role="alert">
          Error: {error}
        </div>
      )}

      {items.length === 0 ? (
        <div className="alert alert-info text-center" role="alert">
          Your cart is empty
        </div>
      ) : (
        <div className="row">
          {items.map((item, index) => (
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

      {items.length > 0 && (
        <div className="text-center mt-4">
          <button className="btn btn-danger btn-lg" onClick={handleClearCart}>
            Clear Cart
          </button>
        </div>
      )}
    </div>
  );
};

export default CartPage;