import React, { useEffect, useState } from "react";
import "./shopDetail.css";
import { useRecoilState, useRecoilValue } from "recoil";
import { memberState, isLoginState } from "../utils/RecoilData";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";

function ShopPay() {
  const [memberInfo, setMemberInfo] = useRecoilState(memberState);
  const isLogin = useRecoilValue(isLoginState);
  const { goodsNo } = useParams(); // URL에서 goodsNo 가져오기
  const [goods, setGoods] = useState(null); // 상품 정보를 저장할 상태
  const location = useLocation();
  const { quantity = 1 } = location.state || {}; // 기본값 설정

  const backServer = process.env.REACT_APP_BACK_SERVER;

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
        setGoods(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [goodsNo]);

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
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const paySubmit = (e) => {
    e.preventDefault();

    const paymentData = {
      ...formData,
      goodsNo: goods.goodsNo,
      goodsName: goods.goodsName,
      goodsPrice: goods.goodsPrice,
      quantity: quantity,
      totalPrice:
        goods.goodsPrice * quantity +
        (goods.goodsPrice * quantity >= 30000 ? 0 : 3000),
    };

    console.log("결제 데이터:", paymentData);

    axios
      .post(`${backServer}/goods/sell/add`, formData)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });

    // // 결제 API 호출
    // const IMP = window.IMP; // iamport
    // if (!IMP) {
    //   alert("Iamport 라이브러리가 로드되지 않았습니다.");
    //   return;
    // }

    // IMP.request_pay(
    //   {
    //     channelKey: "channel-key-d2893ebf-5998-4ab3-93e2-1847d2f13c8b",
    //     pay_method: "card",
    //     merchant_uid: "order_no_" + Date.now(), // Unique order number
    //     name: `주문: ${goods.goodsName}`,
    //     amount: paymentData.totalPrice, // Payment amount
    //     buyer_email: "test@portone.io",
    //     buyer_name: formData.takerName,
    //     buyer_tel: formData.takerPhone,
    //     buyer_addr: formData.takerAddr,
    //     buyer_postcode: "120-120", // 필요시 수정
    //   },
    //   (rsp) => {
    //     if (rsp.success) {
    //       console.log("Payment Success:", rsp);
    //       axios
    //         .post(`${backServer}/goods/sell/add/`, formData)
    //         .then((res) => {
    //           console.log(res);
    //         })
    //         .catch((err) => {
    //           console.log(err);
    //         });
    //     } else {
    //       console.log("Payment Failed:", rsp);
    //     }
    //   }
    // );
  };

  if (!goods) {
    return <div>로딩 중...</div>; // 상품 데이터가 로드되지 않았을 경우
  }
  return (
    <div className="shop-pay-wrap">
      <form onSubmit={paySubmit}>
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
                    name="takerPhone"
                    value={formData.takerPhone}
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
                    name="takerAddr"
                    value={formData.takerAddr}
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
                  {goods.goodsName} / 수량: <span>{quantity}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="pay-info">
          <h4>
            결제 정보
            <span className="accountForShip">(3만 이상 구입 무료)</span>
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
                    (goods.goodsPrice * quantity >= 30000 ? 0 : 3000)}{" "}
                  원
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div>
          <label>
            <input type="checkbox" name="agreement" />
            약관에 동의합니다.
          </label>
        </div>

        <button type="submit">결제하기</button>
      </form>
    </div>
  );
}

export default ShopPay;
