import React, { useState, useEffect } from "react";
import axios from "axios";
import ShippingModal from "./ShippingModal"; // 모달 컴포넌트 임포트
import "./shopDetail.css";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { memberState, isLoginState } from "../utils/RecoilData";

const ShopOrder = () => {
  const [orders, setOrders] = useState([]);
  const [shippingData, setShippingData] = useState(null); // 배송 데이터 상태
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 열기 상태
  const navigate = useNavigate();
  const [memberInfo] = useRecoilState(memberState);
  const backServer = process.env.REACT_APP_BACK_SERVER;

  useEffect(() => {
    // 구매한 상품 get
    axios
      .get(`${backServer}/goods/sell/review/${memberInfo.memberNo}`)
      .then((res) => {
        console.log(res.data);
        setOrders(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [memberInfo, backServer]);

  const yymmDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`; // 'YYYY-MM-DD' 형식으로 반환
  };

  const handleTracking = (order) => {
    setShippingData(order.shippingData); // 모달에 사용할 배송 정보 설정
    setIsModalOpen(true); // 모달 열기
  };

  const closeModal = () => {
    setIsModalOpen(false); // 모달 닫기
  };

  return (
    <div className="order-list-wrap">
      <h2>주문/배송 리스트</h2>

      {orders.map((order) => (
        <div className="order-item" key={order.sellNo}>
          <div className="item-details">
            <h3>{order.goodsName}</h3>
            <p>가격 : {order.goodsPrice.toLocaleString()}원</p>
            <p>수량 : {order.goodsEa}</p>
            <p>구매일 : {yymmDate(order.sellDate)}</p>
            <button onClick={() => handleTracking(order)}>배송 조회</button> {/* 버튼 클릭 시 배송 조회 */}
          </div>
        </div>
      ))}

      <ShippingModal isOpen={isModalOpen} onClose={closeModal} shippingData={shippingData} />
    </div