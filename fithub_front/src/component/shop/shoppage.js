IMP.request_pay(
  {
    channelKey: "your_channel_key_here",
    pay_method: "card",
    merchant_uid: "order_no_" + Date.now(),
    name: `주문: ${itemsToPurchase.map((item) => item.goodsName).join(", ")}`,
    amount: totalAmount, // 결제 금액
    buyer_email: "test@portone.io",
    buyer_name: memberInfo.memberName,
    buyer_tel: memberInfo.memberPhone,
    buyer_addr: memberInfo.memberAddr,
    buyer_postcode: "120-120",
  },
  function (rsp) {
    if (rsp.success) {
      // 결제 성공 시 처리
    } else {
      // 결제 실패 시 처리
      console.error("Payment Failed:", rsp);
    }
  }
);
