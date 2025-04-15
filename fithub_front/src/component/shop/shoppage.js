import Swal from "sweetalert2"; // SweetAlert 임포트

const MyComponent = () => {
  // ... 다른 상태 및 핸들러 정의

  const plusCart = () => {
    if (!goods.memberNo) {
      Swal.fire({
        title: "회원이 아닙니다.",
        text: "회원 가입 후 장바구니 기능을 이용해 주세요.",
        icon: "warning",
        confirmButtonText: "확인",
      });
      return; // 회원이 아닐 경우 함수 종료
    }

    // 여기에 장바구니에 추가하는 로직을 추가합니다
    // 예: axios.post(`${backServer}/cart/add`, { goodsNo: goods.goodsNo, quantity });
  };

  return (
    <div className="shop-detail-wrap">
      <div className="main-detail">
        <div className="goods-image">
          <img
            src={
              goods.goodsImage
                ? `${backServer}/shop/thumb/${goods.goodsImage}`
                : "/image/default_img.png" // 기본 이미지 처리
            }
            alt={goods.goodsName} // 기본 상품명 처리
          />
        </div>
        <div className="goods-info">
          <div className="ex-box">
            <h1>{goods.goodsName}</h1>
            <div dangerouslySetInnerHTML={{ __html: goods.goodsExplain }} />
          </div>
          <h3>{goods.goodsPrice.toLocaleString()}원</h3>

          <div className="price-box">
            <div className="quantity-controls">
              <button onClick={handleDecrease}>-</button>
              <span>{quantity}</span>
              <button onClick={handleIncrease}>+</button>
            </div>
            <h2>총 가격: {(goods.goodsPrice * quantity).toLocaleString()}원</h2>
          </div>
          <div className="goods-buy">
            <button onClick={plusCart}>장바구니</button>
            <button onClick={doBuy}>구매하기</button>
          </div>
        </div>
      </div> 
    </div>
  );
};

export default MyComponent;



{isLogin && memberInfo?.memberLevel === 1 ? (