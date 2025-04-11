import { useEffect, useState } from "react";
import "./shopCart.css";
import axios from "axios";
import { useRecoilState, useRecoilValue } from "recoil";
import { memberState, isLoginState } from "../utils/RecoilData";
import ClearIcon from "@mui/icons-material/Clear";
import Swal from "sweetalert2";

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
          ? prev.filter((id) => id !== cartNo)
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
  const cartDelete = (cartNo) => {
    Swal.fire({
      title: "삭제하시겠습니까?",
      text: "이 작업은 되돌릴 수 없습니다.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#45a049",
      cancelButtonColor: "#d33",
      confirmButtonText: "예, 삭제합니다!",
      cancelButtonText: "아니요, 취소합니다.",
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`${backServer}/goods/cart/${cartNo}`).then((res) => {
          console.log(res);
          // 성공적으로 삭제된 후 상태 업데이트
          setCart(cart.filter((cart) => cart.cartNo !== cartNo));
        });
        // 상태에서 즉각 삭제하는 경우
        // setCart(cart.filter((cart) => cart.cartNo !== cartNo));
      }
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
            onChange={handleSelectAllChange}
          />{" "}
          전체 선택
          {cart.map((item) => (
            <div className="cart-item" key={item.cartNo}>
              <input
                type="checkbox"
                checked={selectAll || selectedItems.includes(item.cartNo)}
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
                <div className="cart-detail1">
                  <h3>{item.goodsName}</h3>
                  <p>가격 : {item.goodsPrice.toLocaleString()} 원</p>
                  <div className="quantity-controls">
                    <span>수량 : {item.goodsEa} (ea)</span>
                  </div>
                  <p>
                    합계 : {(item.goodsPrice * item.goodsEa).toLocaleString()}{" "}
                    원
                  </p>
                </div>
                <div className="cart-detail2">
                  <button
                    onClick={() => handlePurchaseItem(item)} // 구매 버튼 클릭 시 호출
                    className="purchase-button"
                  >
                    구매
                  </button>
                  <button
                    className="delete-button-item"
                    onClick={(e) => {
                      e.stopPropagation(); // 버튼 클릭 시 카드 클릭 이벤트 방지
                      handleDeleteItem(item.cartNo);
                      cartDelete(item.cartNo);
                    }}
                  >
                    <ClearIcon />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="cart-summary">
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
