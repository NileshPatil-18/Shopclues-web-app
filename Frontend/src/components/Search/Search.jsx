import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchProductsBySearch, setSearchTerm } from '../../redux/slices/productSlice';

const Search = () => {
  const [query, setQuery] = useState('');
  const dispatch = useDispatch();

  const handleSearch = (event) => {
    const query = event.target.value;
    setQuery(newQuery); // Update search input value
    dispatch(setSearchTerm(newQuery)); // Store search term in Redux state
    dispatch(fetchProductsBySearch(newQuery)); // Fetch filtered products
  };

  return (
    <div className="input-group">
      <input
        type="text"
        className="form-control"
        placeholder="Search products..."
        value={query}
        onChange={handleSearch}
      />
      <button className="btn btn-warning" onClick={handleSearch}>
        Search
      </button>
    </div>
  );
};

export default Search;
