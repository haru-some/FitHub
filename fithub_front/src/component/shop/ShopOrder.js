import React, { useState, useEffect } from "react";
import axios from "axios";
import "./shopDetail.css";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { memberState, isLoginState } from "../utils/RecoilData";

const ShopOrder = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  const [memberInfo, setMemberInfo] = useRecoilState(memberState);
  const isLogin = useRecoilValue(isLoginState);
  const backServer = process.env.REACT_APP_BACK_SERVER;

  useEffect(() => {
    //구매한 상품 get
    axios
      .get(`${backServer}/goods/sell/review/${memberInfo.memberNo}`)
      .then((res) => {
        console.log(res.data);
        setOrders(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [setOrders]);

  return (
    <div className="order-list-wrap">
      <h2>주문/배송 리스트</h2>
      {orders.map((order) => (
        <div className="order-item" key={order.sellNo}>
          <div className="item-image">
            <img src={order.goodsImage} alt={order.goodsName} />
          </div>
          <div className="item-details">
            <h3>{order.goodsName}</h3>
            <p>가격: {order.goodsPrice.toLocaleString()}원</p>
            <p>수량: {order.quantity}</p>
            <p>배송일: {order.deliveryDate}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ShopOrder;
