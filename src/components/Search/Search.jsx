import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSearchTerm } from "../../redux/slices/productSlice";
import { Link } from "react-router-dom";

const Search = () => {
  const dispatch = useDispatch();
  const searchTerm = useSelector((state) => state.products.searchTerm);
  const products = useSelector((state) => state.products.items) || [];
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Filter products dynamically
  useEffect(() => {
    if (searchTerm) {
      setFilteredProducts(
        products.filter((product) =>
          product?.title?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredProducts([]); // Reset results if search is empty
    }
  }, [searchTerm, products]);

  // Function to clear search input when clicking a product
  const handleProductClick = () => {
    dispatch(setSearchTerm("")); // Reset search input
  };

  return (
    <div className="position-relative w-100">
      {/* Search Bar */}
      <input
        type="search"
        className="form-control"
        placeholder="Search products..."
        value={searchTerm}
        onChange={(e) => dispatch(setSearchTerm(e.target.value))}
      />

      {/* Search Results Dropdown */}
      {searchTerm && filteredProducts.length > 0 && (
        <div className="search-dropdown position-absolute w-100 bg-white shadow-lg rounded p-2">
          {filteredProducts.map((product) => (
            <Link
              key={product.id}
              to={`/product/${product.id}`}
              className="d-flex align-items-center p-2 border-bottom text-dark text-decoration-none"
              onClick={handleProductClick} // 👈 Clears search term on click
            >
              <img
                src={product.image}
                alt={product.title}
                className="me-2"
                style={{ width: "40px", height: "40px", objectFit: "contain" }}
              />
              <span className="text-truncate">{product.title}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;