const plusCart = () => {
  if (!goods) {
    Swal.fire({
      icon: "error",
      title: "상품이 없습니다.",
      showConfirmButton: false,
      timer: 1500,
    });
    return;
  }

  const cartItem = {
    goodsImage: goods.goodsImage,
    goodsName: goods.goodsName,
    goodsPrice: goods.goodsPrice,
    totalPrice: goods.goodsPrice * quantity,
    quantity: quantity, // 수량도 추가
  };

  // 장바구니에 추가하는 API 요청
  axios
    .post(`${backServer}/cart/add`, cartItem) // 적절한 API 엔드포인트로 수정하세요.
    .then((response) => {
      if (response.status === 200) {
        addToCart(cartItem); // 장바구니에 추가
        Swal.fire({
          icon: "success",
          title: "장바구니에 보관하였습니다.",
          showConfirmButton: false,
          timer: 2000,
        });
      }
    })
    .catch((error) => {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "장바구니 추가에 실패했습니다.",
        text: "다시 시도해 주세요.",
        showConfirmButton: true,
      });
    });
};
