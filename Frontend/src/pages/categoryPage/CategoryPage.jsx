import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductsByCategory } from "../../redux/slices/productSlice";
import { addToCart } from "../../redux/slices/cartSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const CategoryPage = () => {
  const { id } = useParams(); 
  const dispatch = useDispatch();
    const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const navigate = useNavigate();
  const { items: products = [], status: loading = "idle", error = null } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProductsByCategory(id)).then((response) => {
      console.log("API Response:", response.payload); // Log the API response
    });
  }, [dispatch, id]);

  const handleAddToCart = (productId, quantity = 1) => {
      if (!isLoggedIn) {
        toast.warning("Please login to add items to the cart!", {
          position: "top-right",
          autoClose: 2000,
        });
        navigate("/login");
      }else {
      dispatch(addToCart({ productId, quantity }));
      toast.success("Product added to cart!", {
        position: "top-right",
        autoClose: 2000,})
      }
    };

  console.log("Redux State - Products:", products); // Log the products array

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">Category Products</h2>
      
      {/* Loading and Error States */}
      {loading === "loading" && (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading products...</p>
        </div>
      )}
      {error && (
        <div className="alert alert-danger text-center" role="alert">
          {error}
        </div>
      )}

      {/* Products Grid */}
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {products?.length > 0 ? (
          products.map((product) => (
            <div className="col" key={product._id}>
              <div className="card h-100 shadow-sm">
                <div className="card-img-top-container d-flex align-items-center justify-content-center p-3" style={{ height: "200px", overflow: "hidden" }}>
                  <img
                    src={product.image}
                    className="card-img-top img-fluid"
                    alt={product.name}
                    style={{ maxHeight: "100%", width: "auto" }}
                  />
                </div>
                <div className="card-body text-center">
                  <h5 className="card-title">{product.name}</h5>
                  <p className="card-text text-success fw-bold">${product.price}</p>
                  {/* <p className="card-text text-muted">{product.description}</p> */}
                </div>
                <div className="card-footer bg-white border-0">
                  <button className="btn btn-primary w-100"
                  onClick={() => handleAddToCart(product._id, 1)}
                  >Add to Cart</button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-muted">No products found in this category.</p>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;