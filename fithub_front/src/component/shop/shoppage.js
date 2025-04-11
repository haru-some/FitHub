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
  const [selectedItems, setSelectedItems] = useState([]); // 선택된 항목 ID 관리
  const [selectAll, setSelectAll] = useState(false); // 전체 선택 상태 관리

  // 장바구니 데이터 로드
  useEffect(() => {
    if (isLogin) {
      axios
        .get(`${backServer}/goods/cart/read/${memberInfo.memberNo}`)
        .then((res) => {
          console.log(res.data);
          setCart(res.data);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [isLogin, backServer, memberInfo.memberNo]);

  const handleCheckboxChange = (cartNo) => {
    setSelectedItems(
      (prev) =>
        prev.includes(cartNo)
          ? prev.filter((id) => id !== cartNo) // 이미 선택된 항목이면 제거
          : [...prev, cartNo] // 선택되지 않은 항목이면 추가
    );
    setSelectAll(false); // 개별 항목을 선택할 경우 전체 선택 해제
  };

  const handleDeleteSelected = () => {
    const idsToDelete = selectAll
      ? cart.map((item) => item.cartNo)
      : selectedItems;

    if (idsToDelete.length === 0) {
      alert("삭제할 항목을 선택하세요.");
      return;
    }

    axios
      .post(`${backServer}/goods/cart/delete`, { cartNos: idsToDelete })
      .then((res) => {
        // 삭제 후 장바구니 업데이트
        setCart(cart.filter((item) => !idsToDelete.includes(item.cartNo)));
        setSelectedItems([]); // 선택 초기화
        setSelectAll(false); // 전체 선택 상태 초기화
      })
      .catch((err) => {
        console.error("Error deleting selected item:", err);
      });
  };

  const handleSelectAllChange = () => {
    setSelectAll((prev) => {
      const newSelectAll = !prev;
      if (newSelectAll) {
        setSelectedItems(cart.map((item) => item.cartNo)); // 모든 항목 선택
      } else {
        setSelectedItems([]); // 모든 항목 선택 해제
      }
      return newSelectAll; // 새 상태 반환
    });
  };

  const handlePurchaseItem = (item) => {
    // 구매 기능 구현
    console.log("구매하실 항목:", item);
    // 이후 결제 페이지로 리다이렉트하거나 결제 처리를 진행해야 합니다.
  };

  const handleDeleteItem = (cartNo) => {
    axios
      .post(`${backServer}/goods/cart/delete`, { cartNos: [cartNo] })
      .then((res) => {
        // 삭제 후 장바구니 업데이트
        setCart(cart.filter((item) => item.cartNo !== cartNo));
      })
      .catch((err) => {
        console.error("Error deleting item:", err);
      });
  };

  return (
    <div className="cart-wrap">
      <div className="cart-container">
        <h2>장바구니</h2>
        <div className="cart-items">
          <input
            type="checkbox"
            checked={selectAll}
            onChange={handleSelectAllChange} // 전체 선택 체크박스 변경 이벤트
          />{" "}
          전체 선택
          {cart.map((item) => (
            <div className="cart-item" key={item.cartNo}>
              <input
                type="checkbox"
                checked={selectAll || selectedItems.includes(item.cartNo)} // 각 항목의 체크 상태 확인
                onChange={() => handleCheckboxChange(item.cartNo)}
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
                <button
                  onClick={() => handlePurchaseItem(item)} // 구매 버튼 클릭 시 호출
                  className="purchase-button"
                >
                  구매
                </button>
                <button
                  onClick={() => handleDeleteItem(item.cartNo)} // 삭제 버튼 클릭 시 항목 삭제
                  className="delete-button-item"
                >
                  삭제
                </button>
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
