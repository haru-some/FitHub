import React, { useState, useEffect } from "react";
import axios from "axios";
import "./shopDetail.css";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { memberState, isLoginState, logoutState } from "../utils/RecoilData";
import Swal from "sweetalert2";
import ShippingModal from "./ShippingModal"; // 모달 컴포넌트 임포트

import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";

const ShopOrder = () => {
  const [orders, setOrders] = useState([]);
  const [shippingData, setShippingData] = useState(null); // 배송 데이터 상태
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 열기 상태
  const navigate = useNavigate();
  const memberInfo = useRecoilValue(memberState);
  const isLogin = useRecoilValue(isLoginState);
  const backServer = process.env.REACT_APP_BACK_SERVER;

  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;

  // 현재 페이지에 표시될 주문 계산
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
  const [logoutST, setLogoutST] = useRecoilState(logoutState);

  // 총 페이지 수 계산
  const totalPages = Math.ceil(orders.length / ordersPerPage);

  // 페이지 변경 핸들러
  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleNextPage = () => {
    if (currentPage < Math.ceil(orders.length / ordersPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  useEffect(() => {
    if (!memberInfo) {
      navigate("/");
      Swal.fire({
        title: "이용 불가",
        text: "로그인이 필요한 서비스입니다.",
        icon: "warning",
        confirmButtonColor: "#589c5f",
        confirmButtonText: "로그인",
      });
    }
  }, []);

  useEffect(() => {
    if (logoutST) {
      navigate("/");
      setLogoutST(false);
    }
  }, [logoutST]);

  useEffect(() => {
    // 구매한 상품 가져오기
    axios
      .get(`${backServer}/goods/sell/review/${memberInfo?.memberNo}`)
      .then((res) => {
        setOrders(res.data);
      })
      .catch((err) => {});
  }, [setOrders, memberInfo]);

  const yymmDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`; // 'YYYY-MM-DD' 형식으로 반환
  };

  const handleTracking = (order) => {
    setShippingData(order.sellDate); // 모달에 사용할 배송 정보 설정
    setIsModalOpen(true); // 모달 열기
  };

  const closeModal = () => {
    setIsModalOpen(false); // 모달 닫기
  };
  return (
    <div className="order-list-wrap">
      <h2>주문/배송 리스트</h2>
      {currentOrders.length === 0 ? (
        <p style={{ marginTop: "10px" }}>주문/배송한 상품이 없습니다.</p>
      ) : (
        currentOrders.map((order) => (
          <div className="order-item" key={order.sellNo}>
            <div className="item-details">
              <h3>{order.goodsName}</h3>
              <p>가격 : {order.goodsPrice.toLocaleString()}원</p>
              <p>수량 : {order.goodsEa}</p>
              <p>구매일 : {yymmDate(order.sellDate)}</p>
            </div>
            <div className="order-actions">
              <button onClick={handleTracking}>배송 조회</button>
            </div>
          </div>
        ))
      )}
      <div className="pagination-controls">
        <button onClick={handlePrevPage} disabled={currentPage === 1}>
          <NavigateBeforeIcon />
        </button>
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
        <button
          onClick={handleNextPage}
          disabled={currentPage === Math.ceil(orders.length / ordersPerPage)}
        >
          <NavigateNextIcon />
        </button>
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

export default ShopOrder;
