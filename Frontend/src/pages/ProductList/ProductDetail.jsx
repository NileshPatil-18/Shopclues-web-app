import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchProductById } from "../../redux/slices/productSlice";

const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { product, status, error } = useSelector((state) => state.products);

  useEffect(() => {
    if (id && id !== "undefined") {
      dispatch(fetchProductById(id));
    }
  }, [dispatch, id]);

  if (!id || id === "undefined") {
    return <div className="text-center text-lg text-red-500">Invalid Product ID</div>;
  }


  if (status === "loading") {
    return <div className="text-center text-lg">Loading...</div>;
  }

  if (status === "failed") {
    return <div className="text-center text-lg text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-6">
      {product && (
        <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-64 object-cover"
          />
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
            <p className="text-gray-700 text-lg">{product.description}</p>
            <p className="text-xl font-semibold mt-4">Price: ${product.price}</p>
            <p className="text-md text-gray-600">Brand: {product.brand}</p>
            <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">
              Add to Cart
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
