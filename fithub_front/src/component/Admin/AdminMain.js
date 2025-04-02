import { Link, NavLink, Route, Routes, useNavigate } from "react-router-dom";
import AdminAds from "./AdminAds";
import "./admin.css";
import AdminMember from "./AdminMember";
import AdminStat from "./AdminStat";
import AdminChat from "./AdminChat";
import { useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { isLoginState, memberState } from "../utils/RecoilData";

const AdminMain = () => {
  const isLogin = useRecoilValue(isLoginState);
  const [memberInfo, setMemberInfo] = useRecoilState(memberState);
  const navigate = useNavigate();
  // 관리자(member_level === 1)만 접근 가능하도록 설정
  useEffect(() => {
    if (!isLogin || memberInfo?.memberLevel !== 1) {
      alert("관리자만 접근 가능합니다.");
      navigate("/");
    }
  }, [isLogin, memberInfo, navigate]);

  return (
    <section className="section admin-section">
      <div className="navi-bar">
        <Sidebar />
      </div>
      <div className="section-page">
        <Routes>
          <Route path="member" element={<AdminMember />} />
          <Route path="stat" element={<AdminStat />} />
          <Route path="chat" element={<AdminChat />} />
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
        to="/admin/chat"
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
