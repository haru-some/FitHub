import React, { useState, createContext } from "react";
import "./shopCart.css";

export const ShopCart = createContext();

export const ShopCartProvider = ({ childgen }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (item) => {
    setCartItems((prevItems) => [...prevItems, item]);
  };

  return (
    <ShopCart.Provider value={{ cartItems, addToCart }}>
      {childgen}
    </ShopCart.Provider>
  );
};
