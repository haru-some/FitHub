import React, { useState } from "react";
import ShippingModal from "./ShippingModal"; // ShippingModal 컴포넌트 임포트

const OrderList = ({ orders }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;

  // 현재 페이지에 표시될 주문 계산
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

  // 총 페이지 수 계산
  const totalPages = Math.ceil(orders.length / ordersPerPage);

  // 페이지 변경 핸들러
  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // 배송 조회 버튼 핸들러
  const handleTracking = (order) => {
    setShippingData(order.shippingInfo); // 실제 배송 정보를 설정하는 로직
    setIsModalOpen(true); // 모달 열기
  };

  return (
    <div className="order-list-wrap">
      <h2>주문/배송 리스트</h2>

      {currentOrders.map((order) => (
        <div className="order-item" key={order.sellNo}>
          <div className="item-details">
            <h3>{order.goodsName}</h3>
            <p>가격 : {order.goodsPrice.toLocaleString()}원</p>
            <p>수량 : {order.goodsEa}</p>
            <p>구매일 : {yymmDate(order.sellDate)}</p>
          </div>
          <div className="order-actions">
            <button onClick={() => handleTracking(order)}>배송 조회</button>
          </div>
        </div>
      ))}

      <div className="pagination-controls">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => goToPage(index + 1)}
            disabled={currentPage === index + 1}
            className={currentPage === index + 1 ? "active" : ""}
          >
            {index + 1}
          </button>
        ))}
      </div>

      <ShippingModal
        isOpen={isModalOpen}
        onClose={closeModal}
        shippingData={shippingData}
        setShippingData={setShippingData}
      />
    </div>
  );
};

export default OrderList;
