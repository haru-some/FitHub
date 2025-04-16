import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MemberInfo from "./MemberInfo";
import ChangePw from "./ChangePw";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import "./member.css";
import ShopReview from "../shop/ShopReview";
import ShopOrder from "../shop/ShopOrder";
const menuItems = [
  { key: "info", label: "내 정보" },
  { key: "change-pw", label: "비밀번호 변경", path: "/mypage/change-pw" },
  { key: "reviews", label: "나의 리뷰 목록", path: "/mypage/reviews" },
  { key: "orders", label: "주문 목록 조회", path: "/mypage/orders" },
];
const MemberMain = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentKey = (() => {
    if (location.pathname.includes("reviews")) return "reviews";
    if (location.pathname.includes("orders")) return "orders";
    if (location.pathname.includes("change-pw")) return "change-pw";
    return "info";
  })();
  const renderContent = () => {
    switch (currentKey) {
      case "info":
        return <MemberInfo />;
      case "change-pw":
        return <ChangePw />;
      case "reviews":
        return <ShopReview />;
      case "orders":
        return <ShopOrder />;
      default:
        return null;
    }
  };
  const handleMenuClick = (item) => {
    if (item.path) {
      navigate(item.path);
    } else {
      navigate("/mypage");
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <section className="mypage-wrap">
      <aside className="mypage-sidebar">
        <h2>My Page</h2>
        {menuItems.map((item) => (
          <div
            key={item.key}
            className={`mypage-menu-item ${
              currentKey === item.key ? "active" : ""
            }`}
            onClick={() => handleMenuClick(item)}
          >
            <span>{item.label}</span>
            <ChevronRightIcon style={{ marginLeft: "auto", color: "#555" }} />
          </div>
        ))}
      </aside>
      <main className="mypage-main">{renderContent()}</main>
    </section>
  );
};
export default MemberMain;
