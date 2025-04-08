import { useState } from "react";

const ShopReview = () => {
  const [activeTab, setActiveTab] = useState("작성가능한 리뷰");

  const renderContent = () => {
    switch (activeTab) {
      case "작성가능한 리뷰":
        return (
          <div>
            <div>작성가능한 리뷰</div>
            <div className="review-item">
              <img src="product_image_url" alt="상품 이미지" />
              <div className="product-info">
                <h3>상품명</h3>
                <p>주문번호: 7010125031110061253</p>
                <p>유통기한: 2025-03-13</p>
              </div>
              <button className="write-review-button">리뷰 작성</button>
            </div>
          </div>
        );
      case "내가 작성한 리뷰":
        return <div>내가 작성한 리뷰</div>;
      default:
        return null;
    }
  };
  return (
    <div className="Myreview-wrap">
      <div className="review-tabs">
        <div className="tabs">
          {["작성가능한 리뷰", "내가 작성한 리뷰"].map((tab) => (
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
    </div>
  );
};
export default ShopReview;
