import React from "react";
import "./shopDetail.css";

const ShippingModal = ({ isOpen, onClose, shippingData }) => {
  if (!isOpen) return null;

  return (
    <div className="shipping-modal-wrap">
      <div className="modal-overlay">
        <div className="modal-content">
          <h2>배송조회</h2>
          <p>송장번호: 321678912324897</p>
          <table>
            <thead>
              <tr>
                <th>처리일시</th>
                <th>배송단계</th>
                <th>처리장소</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>2025-04-17</td>
                <td>배송 중</td>
                <td>옥천 집하장</td>
              </tr>

              {/* {shippingData.trackings.map((tracking, index) => (
                <tr key={index}>
                  <td>{tracking.sellDate}</td>
                  <td>{tracking.stage}</td>
                <td>{tracking.location}</td>
                </tr>
              ))} */}
            </tbody>
          </table>
          <button className="check-button" onClick={onClose}>
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShippingModal;
