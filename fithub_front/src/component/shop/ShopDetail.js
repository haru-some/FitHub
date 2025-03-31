import React from "react";
import "./shopDetail.css";

const ShopDetail = () => {
  const product = {
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

  return (
    <div style={styles.container}>
      <img src={product.image} alt={product.name} style={styles.image} />
      <div style={styles.info}>
        <h1>{product.name}</h1>
        <p>{product.description}</p>
        <p>제조일정: {product.manufacturingDate}</p>
        <p>상품 크기: {product.size}</p>
        <p>품질보증기한: {product.qualityGuarantee}</p>
        <p>적립 포인트: {product.points}p</p>
        <p>{product.bulkPurchaseDiscount}</p>
        <h2>{product.price.toLocaleString()}원</h2>
        <button style={styles.button}>구매하기</button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "row",
    padding: "20px",
    border: "1px solid #ddd",
    maxWidth: "800px",
    margin: "auto",
  },
  image: {
    width: "300px",
    height: "auto",
    marginRight: "20px",
  },
  info: {
    flex: 1,
  },
  button: {
    backgroundColor: "#4caf50",
    color: "white",
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default ShopDetail;
