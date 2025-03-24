import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { fetchProductsBySearch, setSearchTerm, setSearching } from "../../redux/slices/productSlice";

const Search = () => {
  const [query, setQuery] = useState("");
  const dispatch = useDispatch();

  const handleSearch = (event) => {
    const newQuery = event.target.value;
    setQuery(newQuery);
    dispatch(setSearchTerm(newQuery));

    if (newQuery.trim()) {
      dispatch(setSearching(true)); // Activate search mode
      dispatch(fetchProductsBySearch(newQuery));
    } else {
      dispatch(setSearching(false)); // Reset search mode when input is cleared
    }
  };

  const handleButtonClick = () => {
    if (query.trim()) {
      dispatch(setSearching(true)); // Activate search mode
      dispatch(fetchProductsBySearch(query));
    }
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
      <button className="btn btn-warning" onClick={handleButtonClick}>
        Search
      </button>
    </div>
  );
};

export default Search;
