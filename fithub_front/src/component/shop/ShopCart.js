import { useEffect, useState } from "react";
import "./shopCart.css";
import axios from "axios";
import { useRecoilState, useRecoilValue } from "recoil";
import { memberState, isLoginState } from "../utils/RecoilData";

const ShopCart = () => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const [memberInfo] = useRecoilState(memberState);
  const isLogin = useRecoilValue(isLoginState);
  const [cart, setCart] = useState([]);
  const [selectedItems, setSelectedItems] = useState({}); // 체크박스 상태 관리

  // 장바구니 데이터 로드
  useEffect(() => {
    if (isLogin) {
      axios
        .get(`${backServer}/goods/cart/read/${memberInfo.memberNo}`)
        .then((res) => {
          console.log(res.data);
          setCart(res.data);

          // 초기 체크박스 상태 설정
          const initialSelected = {};
          res.data.forEach((item) => {
            initialSelected[item.id] = false; // item.id를 사용하여 초기화
          });
          setSelectedItems(initialSelected);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [isLogin, backServer, memberInfo.memberNo]);

  const handleCheckboxChange = (id) => {
    setSelectedItems((prev) => ({
      ...prev,
      [id]: !prev[id], // 현재 체크 상태 반전
    }));
  };

  const handleDeleteSelected = () => {
    // 선택된 항목들에 대한 ID 리스트 생성
    const idsToDelete = Object.keys(selectedItems).filter(
      (id) => selectedItems[id]
    );

    // 선택된 항목이 없을 경우 알림
    if (idsToDelete.length === 0) {
      alert("삭제할 항목을 선택하세요.");
      return;
    }

    axios
      .post(`${backServer}/goods/cart/delete`, { ids: idsToDelete })
      .then((res) => {
        // 삭제 후 장바구니 업데이트
        setCart(
          cart.filter((item) => !idsToDelete.includes(item.id.toString()))
        );
        setSelectedItems((prev) => {
          const newSelected = { ...prev };
          idsToDelete.forEach((id) => delete newSelected[id]); // 선택된 항목 초기화
          return newSelected;
        });
      })
      .catch((err) => {
        console.error("Error deleting selected items:", err);
      });
  };

  return (
    <div className="cart-wrap">
      <div className="cart-container">
        <h2>장바구니</h2>
        <div className="cart-items">
          {cart.map((item) => (
            <div className="cart-item" key={item.id}>
              <input
                type="checkbox"
                checked={selectedItems[item.id] || false} // 각 항목의 체크 상태 확인
                onChange={() => handleCheckboxChange(item.id)}
              />
              <img
                src={
                  item.goodsImage
                    ? `${backServer}/shop/thumb/${item.goodsImage}`
                    : "/image/default_img.png"
                }
                alt={item.goodsName}
              />
              <div className="item-details">
                <h3>{item.goodsName}</h3>
                <p>가격 : {item.goodsPrice.toLocaleString()} 원</p>
                <div className="quantity-controls">
                  <span>수량 : {item.goodsEa} (ea)</span>
                </div>
                <p>
                  합계 : {(item.goodsPrice * item.goodsEa).toLocaleString()} 원
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="cart-summary">
          <p>배송비: 0원</p>
          <h3>
            총 결제금액:{" "}
            {cart
              .reduce((acc, item) => acc + item.goodsPrice * item.goodsEa, 0)
              .toLocaleString()}{" "}
            원
          </h3>
          <button className="checkout-button">결제하기</button>
          <button className="delete-button" onClick={handleDeleteSelected}>
            선택 항목 삭제
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShopCart;
