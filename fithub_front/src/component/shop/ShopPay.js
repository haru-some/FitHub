import React, { useEffect, useState } from "react";
import "./shopDetail.css";

import { useRecoilState, useRecoilValue } from "recoil";
import { memberState, isLoginState } from "../utils/RecoilData";
import { useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
import axios from "axios";

function ShopPay() {
  const [memberInfo, setMemberInfo] = useRecoilState(memberState);
  const isLogin = useRecoilValue(isLoginState);

  const { goodsNo } = useParams(); // URL에서 goodsNo 가져오기
  const [goods, setGoods] = useState(null); // 상품 정보를 저장할 상태
  const location = useLocation();
  const { quantity = 1 } = location.state || {}; // 기본값 설정

  const backServer = process.env.REACT_APP_BACK_SERVER;
  const [productAmount, setProductAmount] = useState(1);
  const productPrice = 3000;

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdn.iamport.kr/v1/iamport.js";
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      window.IMP.init("imp71036841"); // 라이브러리가 로드된 후 init 호출
    };

    return () => {
      document.body.removeChild(script); // Clean up
    };
  }, []);

  // 상품 데이터 가져오기
  useEffect(() => {
    axios
      .get(`${backServer}/goods/${goodsNo}`)
      .then((res) => {
        console.log(res);
        setGoods(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [goodsNo]);

  const handleAmountChange = (operation) => {
    if (operation === "-" && productAmount > 1) {
      setProductAmount(productAmount - 1);
    } else if (operation === "+") {
      setProductAmount(productAmount + 1);
    }
  };

  const clickBuy = () => {
    const date = new Date();
    const dateString =
      date.getFullYear() +
      "" +
      (date.getMonth() + 1) +
      "" +
      date.getDate() +
      "" +
      date.getHours() +
      "" +
      date.getMinutes() +
      "" +
      date.getSeconds();

    const IMP = window.IMP; // Assuming Iamport is loaded externally
    if (!IMP) {
      alert("Iamport 라이브러리를 로드할 수 없습니다.");
      return;
    }

    IMP.request_pay(
      {
        channelKey: "channel-key-d2893ebf-5998-4ab3-93e2-1847d2f13c8b",
        pay_method: "card",
        merchant_uid: "order_no_" + dateString, // Unique order number
        name: "주문명: 결제테스트",
        amount: totalPrice, // Payment amount
        buyer_email: "test@portone.io",
        buyer_name: "구매자이름",
        buyer_tel: "010-1234-5678",
        buyer_addr: "서울특별시 강남구 삼성동",
        buyer_postcode: "123-456",
      },
      (rsp) => {
        if (rsp.success) {
          // Logic to handle successful payment
          console.log("Payment Success:", rsp);
        } else {
          console.log("Payment Failed:", rsp);
        }
      }
    );
  };

  const [formData, setFormData] = useState({
    memberName: "",
    goodsNo: "",
    goodsName: "",
    goodsImage: "",
    goodsPrice: "",
    quantity: "",
    memberAddr: "",
    takerName: "",
    takerPhone: "",
    takerAddr: "",
    paymentMethod: "bankTransfer",
    agreement: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // 여기에 폼 제출 로직을 추가하세요.
    console.log(formData);
  };

  if (!goods) {
    return <div>로딩 중...</div>; // 상품 데이터가 로드되지 않았을 경우
  }
  const totalPrice = goods.goodsPrice * { quantity };
  return (
    <div className="shop-pay-wrap">
      <form onSubmit={handleSubmit}>
        <h2>FIT 주문/결제</h2>

        <div className="giver-info">
          <h4>구매자 정보</h4>
          <table>
            <tbody>
              <tr>
                <td>이름:</td>
                <td>{memberInfo.memberName}</td>
              </tr>
              <tr>
                <td>연락처:</td>
                <td>{memberInfo.memberPhone}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="taker-info">
          {/* 받는 사람 정보 섹션 */}
          <h4>받는 사람 정보</h4>
          <table>
            <tbody>
              <tr>
                <td>이름:</td>
                <td>
                  <input
                    type="text"
                    name="takerName"
                    value={formData.takerName}
                    onChange={handleChange}
                    placeholder={memberInfo.memberName}
                    required
                  />
                </td>
              </tr>
              <tr>
                <td>연락처:</td>
                <td>
                  <input
                    type="text"
                    name="recipientContact"
                    value={formData.recipientContact}
                    onChange={handleChange}
                    placeholder={memberInfo.memberPhone}
                    required
                  />
                </td>
              </tr>
              <tr>
                <td>주소:</td>
                <td>
                  <input
                    type="text"
                    name="recipientAddress"
                    value={formData.recipientAddress}
                    onChange={handleChange}
                    placeholder={memberInfo.memberAddr}
                    required
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="ship-info">
          <h4>배송 정보</h4>
          <table>
            <tbody>
              <tr>
                <td>상품명</td>
                <td>
                  {goods.goodsName} 수량: <span>{quantity}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="pay-info">
          {/* 결제 정보 섹션 */}
          <h4>
            결제 정보<span className="accountForShip">(3만이상 구입 무료)</span>
          </h4>
          <table>
            <tbody>
              <tr>
                <td>총 상품가격:</td>
                <td>{goods.goodsPrice * quantity} 원</td>
              </tr>
              <tr>
                <td>배송비:</td>
                <td>{goods.goodsPrice * quantity >= 30000 ? 0 : 3000} 원</td>
              </tr>
              <tr>
                <td>결제 금액:</td>
                <td>
                  {goods.goodsPrice * quantity +
                    (goods.goodsPrice * quantity >= 30000 ? 0 : 3000)}
                  원
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        {/* 동의 체크박스 */}
        <div>
          <label>
            <input
              type="checkbox"
              name="agreement"
              checked={formData.agreement}
              onChange={handleChange}
            />
            약관에 동의합니다.
          </label>
        </div>

        <button type="submit" onClick={clickBuy}>
          결제하기
        </button>
      </form>
    </div>
  );
}

export default ShopPay;
