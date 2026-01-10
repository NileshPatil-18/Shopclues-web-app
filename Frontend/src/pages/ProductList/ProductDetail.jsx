import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { fetchProductById } from "../../redux/slices/productSlice";
import { getImageUrl } from "../../utils/imageUrl";
const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { product, status, error } = useSelector((state) => state.products);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
    }
  }, [dispatch, id]);

  if (status === "loading") {
    return <div className="d-flex justify-content-center align-items-center vh-100 fs-4 fw-semibold">Loading...</div>;
  }

  if (status === "failed") {
    return <div className="text-center text-danger mt-4">Error: {error}</div>;
  }

  if (!product) {
    return <div className="text-center text-muted mt-4">Product not found.</div>;
  }

  return (
    <div className="container py-5">
      <div className="row g-4 shadow-lg p-4 bg-white rounded">
        
        {/* Product Image */}
        <div className="col-md-6 text-center">
          <img
            src={getImageUrl(product.image)} alt={product.name}
            // alt={product.name}
            className="img-fluid rounded shadow"
            style={{ maxHeight: "450px", objectFit: "cover" }}
          />
        </div>

        {/* Product Details */}
        <div className="col-md-6 d-flex flex-column justify-content-between">
          <div>
            <h1 className="fw-bold">{product.name}</h1>
            <p className="text-muted mt-2">{product.description}</p>
            <h3 className="text-success fw-bold mt-3">${product.price}</h3>
          </div>

          {/* Buttons */}
          <div className="mt-4">
            <button 
              className="btn btn-success btn-lg w-100"
              onClick={() =>{
                if(!isLoggedIn){
                  navigate("/login")
                }else{
                  navigate("/checkout")}
                }
              }
                
            >
              ✅ Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
