import { useState } from "react";
import MemberInfo from "./MemberInfo";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import "./member.css";
import ChangePw from "./ChangePw";
import ShopReview from "../shop/ShopReview";

const MemberMain = () => {
  const [activeMenu, setActiveMenu] = useState("info");
  const menuItems = [
    { key: "info", label: "내 정보" },
    { key: "password", label: "비밀번호 변경" },
    { key: "reviews", label: "나의 리뷰 목록" },
    { key: "orders", label: "주문 목록 조회" },
  ];

  const renderContent = () => {
    switch (activeMenu) {
      case "info":
        return <MemberInfo />;
      case "password":
        return <ChangePw />;
      case "reviews":
        return (
          <div>
            <h2>나의 리뷰 목록</h2>
            <ShopReview />
          </div>
        );
      case "orders":
        return (
          <div className="mypage-content">
            <h2>주문 목록 조회</h2>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <section className="mypage-wrap">
      <aside className="mypage-sidebar">
        <h2>My Page</h2>
        {menuItems.map((item) => (
          <div
            key={item.key}
            className={`mypage-menu-item ${
              activeMenu === item.key ? "active" : ""
            }`}
            onClick={() => setActiveMenu(item.key)}
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
