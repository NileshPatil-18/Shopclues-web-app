import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../redux/slices/productSlice";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { addToCart } from "../../redux/slices/cartSlice";
import { addToWishlist } from "../../redux/slices/wishlistSlice";

const ProductsPage = () => {
  const dispatch = useDispatch();
  const { items, status, searchTerm } = useSelector((state) => state.products);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const userId = useSelector((state)=>state.auth.user?.id);
  const cartItems = useSelector((state) => state.cart.items || []);
  
  const navigate = useNavigate();

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchProducts()); // Fetch only once
    }
  }, [dispatch, status]);

  const handleAddToCart = (product) => {
    if (!isLoggedIn) {
      toast.warning("Please login to add items to the cart!", {
        position: "top-right",
        autoClose: 2000,
      });
      navigate("/login");
    } else {
      // Check if the product is already in the cart
      const existingItem = cartItems.find((item) => item.productId === product._id);
      if (existingItem) {
        // If the product is already in the cart, update its quantity
        dispatch(updateCartItem({ userId, productId: product._id, quantity: existingItem.quantity + 1 }));
        toast.success("Product quantity updated in the cart!", {
          position: "top-right",
          autoClose: 2000,
        });
      } else {
        // If the product is not in the cart, add it
        dispatch(addToCart({ userId, productId: product._id, quantity: 1 }));
        toast.success("Product added to the cart!", {
          position: "top-right",
          autoClose: 2000,
        });
      }
    }
  };

  const handleToAddWishList = (product) => {
    if (!isLoggedIn) {
      toast.warning("Please login to add items to the cart!", {
        position: "top-right",
        autoClose: 2000,
      });
      navigate("/login");
      } else {
      dispatch(addToWishlist(product));
      toast.success("Product added to wishlist!", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  if (status === "loading")
    return <h3 className="text-center mt-5">Loading...</h3>;



  // ✅ Show only searched products when searchTerm is entered
  const filteredProducts = searchTerm
    ? items.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : items; // Show all products when no search term is entered

  return (
    <div className="container mt-4">
      {/* Featured Products Title */}
      {searchTerm ? (
        <p className="text-center fw-bold fs-4 text-uppercase">Search Results</p>
      ) : (
        <p className="text-center fw-bold fs-4 text-uppercase">Featured Products</p>
      )}

      {/* Products Grid */}
      <div className="row g-4">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div key={product._id} className="col-sm-6 col-md-4 col-lg-3">
              <div className="card h-100 border-0 shadow-sm p-2 rounded">
                <Link
                  to={`/product/${product.id}`}
                  className="text-decoration-none text-dark"
                >
                  {/* Product Image */}
                  <div
                    className="card-img-top-container d-flex align-items-center justify-content-center"
                    style={{ height: "200px", overflow: "hidden" }}
                  >
                    <img
                      src={product.image}
                      className="w-75 h-75 object-fit-contain p-2"
                      alt={product.name}
                    />
                  </div>

                  {/* Product Details */}
                  <div className="card-body text-center p-2">
                    <h6 className="card-title text-truncate">{product.name}</h6>
                    <p className="card-text fw-bold text-success fs-5">${product.price}</p>
                  </div>
                </Link>

                {/* Action Buttons */}
                <div className="text-center my-2">
                  <button
                    className="btn btn-primary btn-sm me-2 fw-bold"
                    onClick={() => handleAddToCart(product)}
                  >
                    Add to Cart
                  </button>
                  <button
                    className="btn btn-outline-danger btn-sm fw-bold"
                    onClick={() => handleToAddWishList(product)}
                  >
                    ❤️ Wishlist
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <h3 className="text-center text-danger">No products found...</h3>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
