import { Link, NavLink, Route, Routes } from "react-router-dom";
import AdminAds from "./AdminAds";
import "./admin.css";
import AdminMember from "./AdminMember";
import AdminContect from "./AdminContect";
import AdminStat from "./AdminStat";

const AdminMain = () => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  return (
    <section className="section admin-section">
      <div className="navi-bar">
        <Sidebar />
      </div>
      <div className="section-page">
        <Routes>
          <Route path="member" element={<AdminMember />} />
          <Route path="stat" element={<AdminStat />} />
          <Route path="contect" element={<AdminContect />} />
          <Route path="Ads" element={<AdminAds />} />
        </Routes>
      </div>
    </section>
  );
};

// 사이드바 컴포넌트
const Sidebar = () => {
  return (
    <div className="side-menu">
      <NavLink
        to="/admin/member"
        className={({ isActive }) => (isActive ? "active-tab" : "")}
      >
        회원 관리
      </NavLink>
      <NavLink
        to="/admin/stat"
        className={({ isActive }) => (isActive ? "active-tab" : "")}
      >
        통계 관리
      </NavLink>
      <NavLink
        to="/admin/contect"
        className={({ isActive }) => (isActive ? "active-tab" : "")}
      >
        문의 관리
      </NavLink>
      <NavLink
        to="/admin/ads"
        className={({ isActive }) => (isActive ? "active-tab" : "")}
      >
        광고 관리
      </NavLink>
    </div>
  );
};
export default AdminMain;
