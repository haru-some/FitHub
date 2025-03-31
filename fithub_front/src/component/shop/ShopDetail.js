import React, { useState } from "react";
import "./shopDetail.css";

const ShopDetail = () => {
  const [activeTab, setActiveTab] = useState("상품정보");
  const [quantity, setQuantity] = useState(1);
  const handleIncrease = () => {
    setQuantity(quantity + 1);
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const goods = {
    name: "고려은단 멀티비타민",
    price: 49800,
    image: "your-image-url.jpg",
    description: "비타민 덩어리! 다양한 영양소!",
    manufacturingDate: "2024-08-16",
    size: "80정 (55x55x115mm)",
    qualityGuarantee: "2025-09-16",
    points: 500,
    bulkPurchaseDiscount: "50,000원 이상 구매 시 무료배송",
  };

  const renderContent = () => {
    switch (activeTab) {
      case "상품정보":
        return <div>상품 정보</div>;
      case "리뷰":
        return <div>리뷰 정보</div>;
      case "배송":
        return <div>배송 정보</div>;
      case "반품":
        return <div>반품 정보</div>;
      default:
        return null;
    }
  };

  return (
    <div className="shop-detail-wrap">
      <div className="main-detail">
        <div className="goods-image">
          <img src="/image/default_img.png" alt={goods.name} />
        </div>
        <div className="goods-info">
          <h1>{goods.name}</h1>
          <p>{goods.description}</p>
          <p>제조일정: {goods.manufacturingDate}</p>
          <p>상품 크기: {goods.size}</p>
          <p>품질보증기한: {goods.qualityGuarantee}</p>
          <p>적립 포인트: {goods.points}p</p>
          <p>{goods.bulkPurchaseDiscount}</p>
          <h2>{goods.price.toLocaleString()}원</h2>
          <h2>총 가격: {(goods.price * quantity).toLocaleString()}원</h2>

          <div className="quantity-controls">
            <button onClick={handleDecrease}>-</button>
            <span>{quantity}</span>
            <button onClick={handleIncrease}>+</button>
          </div>
          <button>구매하기</button>
        </div>
      </div>
      <div className="tabs">
        {["상품정보", "리뷰", "배송", "반품"].map((tab) => (
          <button
            key={tab}
            className={activeTab === tab ? "active" : ""}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="tab-content">{renderContent()}</div>
    </div>
  );
};

export default ShopDetail;
