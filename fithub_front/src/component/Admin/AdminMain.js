import { Route, Routes } from "react-router-dom";
import AdminToday from "./AdminToday";
import AdminAds from "./AdminAds";

const AdminMain = () => {
  return (
    <section className="section admin-section">
      <div className="page-title">관리자 페이지</div>
      <Routes>
        <Route path="/admin" element={<AdminToday />} />

        <Route path="/admin/Ads" element={<AdminAds />} />
      </Routes>
    </section>
  );
};

export default AdminMain;
