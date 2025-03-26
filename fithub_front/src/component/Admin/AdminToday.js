import React from "react";

// 메인 대시보드
const AdminToday = () => {
  return (
    <section className="section admin-section">
      <Sidebar />
      <div className="p-6 bg-gray-900 text-white w-full">
        <h1 className="text-2xl font-bold mb-4">오늘의 통계</h1>
        <div className="grid grid-cols-2 gap-4">
          <MemberStats />
          <SiteVisitStats />
        </div>
        <div className="mt-4">
          <PostStats />
        </div>
        <div className="mt-4">
          <SalesStats />
        </div>
      </div>
    </section>
  );
};

// 통계 컴포넌트
const StatsCard = ({ title }) => (
  <div className="p-4 bg-white rounded-2xl shadow-md">
    <h2 className="text-lg font-bold mb-2">{title}</h2>
  </div>
);

// 회원 통계 컴포넌트
const MemberStats = () => <StatsCard title="금일 회원 통계" />;

// 사이트 방문 통계 컴포넌트
const SiteVisitStats = () => <StatsCard title="금일 사이트 접속 통계" />;

// 게시글 생성 통계 컴포넌트
const PostStats = () => <StatsCard title="금일 게시글 생성 통계" />;

// 매출 통계 컴포넌트
const SalesStats = () => <StatsCard title="금일 매출 통계" />;

// 사이드바 컴포넌트
const Sidebar = () => (
  <div className="w-64 p-4 bg-gray-800 text-white h-screen">
    <h2 className="text-xl font-bold mb-4">관리자 페이지</h2>
    <ul>
      <li className="mb-2">회원 관리</li>
      <li className="mb-2">매출 관리</li>
      <li className="mb-2">문의 확인</li>
      <li className="mb-2">광고 협의</li>
    </ul>
  </div>
);

export default AdminToday;
