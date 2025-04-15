import React, { useState } from "react";

const ReviewList = ({ sell }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 5;

  // sell 배열을 슬라이스하기 위한 인덱스 계산
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = sell.slice(indexOfFirstReview, indexOfLastReview);

  // 총 페이지 수 계산
  const totalPages = Math.ceil(sell.length / reviewsPerPage);

  // 페이지 번호 배열 생성
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  // 페이지 변경을 위한 함수
  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div>
      <h2>작성 가능한 리뷰</h2>
      {currentReviews && currentReviews.length > 0 ? (
        currentReviews.map((item, index) => (
          <div
            className="review-item"
            key={`sell-${indexOfFirstReview + index}`}
          >
            <div className="product-info">
              <div>상품명: {item.goodsName}</div>
              <div>상품번호 :{item.sellNo}</div>
              <div>
                상품 총 가격 : {item.goodsTotalPrice} 원 (수량 : {item.goodsEa})
              </div>
              <div className="goods-no">{item.goodsNo}</div>
            </div>
            <button
              className="write-review-button"
              onClick={() => {
                setGoodsNo(item.goodsNo);
                setIsModalOpen(true);
                setGoodsName(item.goodsName);
              }}
            >
              리뷰 작성
            </button>
          </div>
        ))
      ) : (
        <p>구매한 상품이 없습니다.</p>
      )}
      <div className="pagination-controls">
        {pageNumbers.map((number) => (
          <button
            key={number}
            onClick={() => goToPage(number)}
            disabled={currentPage === number}
            className={currentPage === number ? "active" : ""}
          >
            {number}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ReviewList;
