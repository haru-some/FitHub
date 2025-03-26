import { Link, NavLink, Route, Routes } from "react-router-dom";
import AdminToday from "./AdminToday";
import AdminAds from "./AdminAds";
import "./admin.css";
import { useRef } from "react";
import AdminSales from "./AdminSales";
import AdminMember from "./AdminMember";
import AdminContect from "./AdminContect";

const AdminMain = () => {
  return (
    <section className="section admin-section">
      <Sidebar />
      <Routes>
        <Route path="today" element={<AdminToday />} />
        <Route path="member" element={<AdminMember />} />
        <Route path="sales" element={<AdminSales />} />
        <Route path="contect" element={<AdminContect />} />
        <Route path="Ads" element={<AdminAds />} />
      </Routes>
    </section>
  );
};

// 사이드바 컴포넌트
const Sidebar = () => {
  const ref = useRef();
  const activeTab = (e) => {
    const tab = e.target.value;
  };
  return (
    <div className="side-menu">
      <NavLink
        to="/admin/today"
        className={({ isActive }) => (isActive ? "active-tab" : "")}
      >
        관리자 페이지
      </NavLink>
      <NavLink
        to="/admin/member"
        className={({ isActive }) => (isActive ? "active-tab" : "")}
      >
        회원 통계
      </NavLink>
      <NavLink
        to="/admin/sales"
        className={({ isActive }) => (isActive ? "active-tab" : "")}
      >
        매출 통계
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
