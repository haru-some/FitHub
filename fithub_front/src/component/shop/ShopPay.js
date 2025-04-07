import React, { useState } from "react";
import "./shopDetail.css";

import { useRecoilState, useRecoilValue } from "recoil";
import { memberState, isLoginState } from "../utils/RecoilData";

function ShopPay() {
  const [memberInfo, setMemberInfo] = useRecoilState(memberState);
  const isLogin = useRecoilValue(isLoginState);

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

  return (
    <div className="shop-pay-wrap">
      <form onSubmit={handleSubmit}>
        <h2>FIT 주문/결제</h2>

        {/* 구매자 정보 섹션 */}
        <div className="giver-info">
          <h4>구매자 정보</h4>
          <table>
            <tbody>
              <tr>
                <td>이름:</td>
                <td>
                  <input
                    type="text"
                    name="buyerName"
                    value={formData.buyerName}
                    onChange={handleChange}
                    required
                  />
                </td>
              </tr>
              <tr>
                <td>연락처:</td>
                <td>
                  <input
                    type="text"
                    name="buyerContact"
                    value={formData.buyerContact}
                    onChange={handleChange}
                    required
                  />
                </td>
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
                    name="recipientName"
                    value={formData.recipientName}
                    onChange={handleChange}
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
                <td></td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="pay-info">
          {/* 결제 정보 섹션 */}
          <h4>결제 정보</h4>
          <table>
            <tbody>
              <tr>
                <td>결제 방법:</td>
                <td>
                  <select
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleChange}
                  >
                    <option value="bankTransfer">은행 송금</option>
                    <option value="creditCard">신용카드</option>
                  </select>
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

        {/* 제출 버튼 */}
        <button type="submit">결제하기</button>
      </form>
    </div>
  );
}

export default ShopPay;
