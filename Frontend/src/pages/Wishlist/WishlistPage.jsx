import React  from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchWishlist,removeFromWishlist } from "../../redux/slices/wishlistSlice";
import { addToCart } from "../../redux/slices/cartSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Wishlist = () => {
 

  const wishlist = useSelector((state) => state.wishlist.items);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const dispatch = useDispatch();
  const navigate = useNavigate();

   useEffect(() => {
  if (isLoggedIn) {
    dispatch(fetchWishlist());
  }
}, [dispatch, isLoggedIn]);

  const handleAddToCart = (item) => {
    if (!isLoggedIn) {
      toast.error("Please login to add items to the cart!");
      navigate("/login");
      return;
    }

    dispatch(addToCart(item));
    toast.success("Product added to cart!");
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4 fw-bold">💖 Wishlist</h2>

      {wishlist.length === 0 ? (
        <div className="text-center">
          <img
            src="https://cdn-icons-png.flaticon.com/512/102/102659.png"
            alt="Empty Wishlist"
            style={{ maxWidth: "200px" }}
          />
          <p className="fs-5 text-muted">Your wishlist is empty.</p>
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
          {wishlist.map((item) => (
            <div key={item._id} className="col">
              <div className="card h-100 shadow-sm">
                <div
                  className="d-flex justify-content-center align-items-center"
                  style={{ height: "200px" }}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="img-fluid"
                    style={{ maxHeight: "160px" }}
                  />
                </div>

                <div className="card-body text-center">
                  <h6 className="fw-bold">{item.name}</h6>
                  <p className="text-success fw-semibold">
                    ₹{item.price}
                  </p>
                </div>

                <div className="card-footer bg-white border-0 text-center">
                  <button
                    className="btn btn-danger btn-sm me-2"
                    onClick={() =>
                      dispatch(removeFromWishlist(item._id))
                    }
                  >
                    ❌ Remove
                  </button>

                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => handleAddToCart(item)}
                  >
                    🛒 Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
