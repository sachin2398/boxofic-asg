import React from "react";
import { Link } from "react-router-dom";

const Wishlist = ({ wishlist }) => {
  return (
    <div className="wishlist">
      <h2>Wishlist</h2>
      <Link to="/">Back to Products</Link>
      <div className="products">
        {wishlist.map((product) => (
          <div className="product-card" key={product.id}>
            <img src={product.image} alt={product.title} />
            <h3>{product.title}</h3>
            <p>${product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
