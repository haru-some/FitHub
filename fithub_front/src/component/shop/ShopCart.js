import React, { useState } from "react";
import "./shopCart.css";

const ShopCart = () => {
  const initialCartItems = [
    {
      id: 1,
      name: "비타민",
      price: 79800,
      quantity: 2,
      image: "/image/default_img.png",
    },
    {
      id: 2,
      name: "스포츠웨어",
      price: 25000,
      quantity: 1,
      image: "/image/default_img.png",
    },
    {
      id: 3,
      name: "단백질 보조제",
      price: 77760,
      quantity: 1,
      image: "/image/default_img.png",
    },
  ];

  const [cartItems, setCartItems] = useState(initialCartItems); // 상태로 cartItems 관리

  const handleIncrease = (id) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const handleDecrease = (id) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <div className="cart-container">
      <h2>장바구니</h2>
      <div className="cart-items">
        {cartItems.map((item) => (
          <div className="cart-item" key={item.id}>
            <img src={item.image} alt={item.name} />
            <div className="item-details">
              <h3>{item.name}</h3>
              <p>가격: {item.price.toLocaleString()}원</p>
              <div className="quantity-controls">
                <button onClick={() => handleDecrease(item.id)}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => handleIncrease(item.id)}>+</button>
              </div>
              <p>합계: {(item.price * item.quantity).toLocaleString()}원</p>
            </div>
          </div>
        ))}
      </div>
      <div className="cart-summary">
        <p>배송비: 0원</p>
        <h3>총 결제금액: {totalPrice.toLocaleString()} 원</h3>
        <button className="checkout-button">결제하기</button>
      </div>
    </div>
  );
};

export default ShopCart;
