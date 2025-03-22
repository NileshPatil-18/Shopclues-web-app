import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchProductsBySearch, setSearchTerm } from '../../redux/slices/productSlice';

const Search = () => {
  const [query, setQuery] = useState('');
  const dispatch = useDispatch();

  const handleSearch = () => {
    const query = event.target.value;
    dispatch(setSearchTerm(query)); // Store search term in Redux state
    dispatch(fetchProductsBySearch(query)); // Fetch filtered products
  };

  return (
    <div className="input-group">
      <input
        type="text"
        className="form-control"
        placeholder="Search products..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button className="btn btn-warning" onClick={handleSearch}>
        Search
      </button>
    </div>
  );
};

export default Search;
