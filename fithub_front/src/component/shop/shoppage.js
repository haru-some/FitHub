const renderContent = () => {
  switch (activeTab) {
    case "상품정보":
      return <div style={{ textAlign: "center" }}>상품정보</div>;
    case "리뷰":
      return <div>리뷰 정보</div>;
    case "배송/결제":
      return <div>배송 정보</div>;
    case "반품/교환":
      return <div>반품 정보</div>;
    default:
      return null;
  }
};
