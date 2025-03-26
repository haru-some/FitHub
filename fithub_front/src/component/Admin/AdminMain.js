import { Link, Route, Routes } from "react-router-dom";
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
      <ul>
        <li className="main-navi" onClick={activeTab}>
          <Link to="/admin/today">관리자 페이지</Link>
        </li>
        <li className="member-navi" onClick={activeTab}>
          <Link to="/admin/member">회원 관리</Link>
        </li>
        <li className="sales-navi" onClick={activeTab}>
          <Link to="/admin/sales">매출 관리</Link>
        </li>
        <li className="contect-navi" onClick={activeTab}>
          <Link to="/admin/contect">문의 확인</Link>
        </li>
        <li className="ads-navi" onClick={activeTab}>
          <Link to="/admin/ads">광고 관리</Link>
        </li>
      </ul>
    </div>
  );
};
export default AdminMain;
