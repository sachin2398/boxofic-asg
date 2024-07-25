import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Wishlist from "./components/Wishlist";
import "./App.css";

const App = () => {
  const [products, setProducts] = useState([]);
  const [sortedProducts, setSortedProducts] = useState([]);
  const [sortOrder, setSortOrder] = useState("asc");
  const [category, setCategory] = useState("");
  const [wishlist, setWishlist] = useState([]);
  
  useEffect(() => {
    fetch("https://fakestoreapi.com/products")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setProducts(data);
       
        setSortedProducts(data);
      });

    const savedSortOrder = localStorage.getItem("sortOrder") || "asc";
    const savedCategory = localStorage.getItem("category") || "";
    const savedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

    setSortOrder(savedSortOrder);
    setCategory(savedCategory);
    setWishlist(savedWishlist);

    if (savedCategory) {
      filterProducts(savedCategory);
    } else {
      sortProducts(savedSortOrder);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem("sortOrder", sortOrder);
    sortProducts(sortOrder);
  }, [sortOrder]);

  useEffect(() => {
    localStorage.setItem("category", category);
    if (category === "") {
      setSortedProducts(products);
    } else {
      filterProducts(category);
    }
  }, [category]);

  const sortProducts = (order) => {
    const sorted = [...sortedProducts].sort((a, b) => {
      if (order === "asc") {
        return a.price - b.price;
      } else {
        return b.price - a.price;
      }
    });
    setSortedProducts(sorted);
  };

  const filterProducts = (category) => {
    const filtered = products.filter(
      (product) => product.category === category
    );
    setSortedProducts(filtered);
  };

  const handleSortChange = (event) => {
    const order = event.target.value;
    setSortOrder(order);
  };

  const handleCategoryChange = (event) => {
    const category = event.target.value;
    setCategory(category);
  };

  const addToWishlist = (product) => {
    setWishlist((prevWishlist) => {
      if (!prevWishlist.some((item) => item.id === product.id)) {
        return [...prevWishlist, product];
      }
      return prevWishlist;
    });
  };

  return (
    <Router>
      <div className="App">
        <div className="controls">
          <select value={sortOrder} onChange={handleSortChange}>
            <option value="asc">Price: Low to High</option>
            <option value="desc">Price: High to Low</option>
          </select>
          <select value={category} onChange={handleCategoryChange}>
            <option value="">All Categories</option>
            <option value="men's clothing">Men's Clothing</option>
            <option value="women's clothing">Women's Clothing</option>
            <option value="jewelery">Jewelery</option>
            <option value="electronics">Electronics</option>
          </select>
          <Link to="/wishlist">Go to Wishlist</Link>
        </div>
        <Routes>
          <Route path="/wishlist" element={<Wishlist wishlist={wishlist} />} />
          <Route
            path="/"
            element={
              <div className="products">
                {sortedProducts.map((product) => (
                  <div className="product-card" key={product.id}>
                    <img src={product.image} alt={product.title} />
                    <h3>{product.title}</h3>
                    <p>${product.price}</p>
                    <h2>{product.category}</h2>
                    <button onClick={() => addToWishlist(product)}>
                      Add to Wishlist
                    </button>
                  </div>
                ))}
              </div>
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
