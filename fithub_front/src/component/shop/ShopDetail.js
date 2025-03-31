import React, { useState } from "react";
import "./shopDetail.css";

import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const ShopDetail = () => {
  const [activeTab, setActiveTab] = useState("상품정보");
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();
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
      case "배송/결제":
        return <div>배송 정보</div>;
      case "반품/교환":
        return <div>반품 정보</div>;
      default:
        return null;
    }
  };

  const plusCart = () => {
    Swal.fire({
      icon: "success",
      title: "장바구니에 보관하였습니다.",
      showConfirmButton: false,
      timer: 2000,
    });
  };

  const doBuy = () => {
    Swal.fire({
      title: "구매할까요?",
      showCancelButton: true,
      confirmButtonText: "예",
      cancelButtonText: "아니오",
      confirmButtonColor: "#4caf50",
      cancelButtonColor: "#8CCC8F",
    }).then((result) => {
      if (result.isConfirmed) {
        navigate("/purchase"); // 구매 페이지로 이동
      } else {
        Swal.fire({
          icon: "info",
          title: "구매가 취소되었습니다.",
          showConfirmButton: false,
          cancelButtonColor: "#8CCC8F",
          timer: 2000,
        });
      }
    });
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
          <h3>{goods.price.toLocaleString()}원</h3>

          <div className="price-box">
            <div className="quantity-controls">
              <button onClick={handleDecrease}>-</button>
              <span>{quantity}</span>
              <button onClick={handleIncrease}>+</button>
            </div>
            <h2>총 가격: {(goods.price * quantity).toLocaleString()}원</h2>
          </div>
          <div className="goods-buy">
            <button onClick={plusCart}>장바구니</button>
            <button onClick={doBuy}>구매하기</button>
          </div>
        </div>
      </div>

      <div className="tabs">
        {["상품정보", "리뷰", "배송/결제", "반품/교환"].map((tab) => (
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
