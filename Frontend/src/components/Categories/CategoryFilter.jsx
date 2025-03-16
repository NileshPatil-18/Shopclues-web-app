import React from "react";
import { useSelector } from "react-redux";

const Categories = ({ categories }) => {
  const products = useSelector((state) => state.products); // Assuming you store products in Redux

  return (
    <div className="container mt-3">
      {categories.map((category) => {
        const filteredProducts = products.filter((product) => product.category === category.label);

        return (
          <div key={category.id} className="mb-4">
            <h3 className="text-primary">{category.label}</h3>
            {filteredProducts.length > 0 ? (
              <div className="row">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="col-md-4">
                    <div className="card p-2">
                      <img src={product.image} className="card-img-top" alt={product.name} />
                      <div className="card-body">
                        <h5 className="card-title">{product.name}</h5>
                        <p className="card-text">{product.price}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-danger">Products not available now.</p>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Categories;
