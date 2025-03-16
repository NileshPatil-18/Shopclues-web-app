import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../redux/slices/cartSlice";
import { addToWishlist } from "../../redux/slices/wishlistSlice";
import { toast } from "react-toastify";

const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const product = useSelector((state) =>
    state.products.items.find((p) => p.id === parseInt(id))
  );

  if (!product) return <h3 className="text-center mt-5">Product not found...</h3>;

  const handleAction = (action) => {
    if (!isLoggedIn) {
      toast.error("Please login to continue!", { position: "top-right", autoClose: 2000 });
      navigate("/login");
      return;
    }

    if (action === "cart") {
      dispatch(addToCart(product));
      toast.success("Product added to cart!", { position: "top-right", autoClose: 2000 });
    } else if (action === "wishlist") {
      dispatch(addToWishlist(product));
      toast.success("Product added to wishlist!", { position: "top-right", autoClose: 2000 });
    }
  };

  return (
    <div className="container mt-4">
      <div className="row">
        {/* Product Image Section */}
        <div className="col-md-4 mb-4">
          <div className="border rounded p-3 shadow-sm bg-white">
            <img
              src={product.image}
              className="w-100 object-fit-contain"
              alt={product.title}
              style={{ maxHeight: "400px" }}
            />
          </div>
        </div>

        {/* Product Details Section */}
        <div className="col-md-8">
          <h2 className="fw-bold">{product.title}</h2>
          <h4 className="text-success my-3">${product.price}</h4>
          <p className="text-muted">{product.description}</p>
          <h5 className="text-primary">Category: {product.category}</h5>

          {/* Buttons Section */}
          <div className="mt-3">
            <button className="btn btn-primary me-2" onClick={() => handleAction("cart")}>
              🛒 Add to Cart
            </button>
            <button className="btn btn-danger" onClick={() => handleAction("wishlist")}>
              ❤️ Wishlist
            </button>
          </div>

          {/* Back to Home Button */}
          <div className="mt-4">
            <Link to="/" className="btn btn-secondary">⬅ Back to Home</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;