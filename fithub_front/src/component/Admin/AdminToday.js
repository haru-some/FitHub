import React from "react";

// 메인 대시보드
const AdminToday = () => {
  return (
    <section className="section today-section">
      <h1 className="page-title">하루 통계</h1>
      <div className="chart-list">
        <div className="chart-first">
          <MemberChart />
          <SiteVisitChart />
        </div>
        <div className="chart-second">
          <PostChart />
        </div>
        <div className="chart-third">
          <SalesChart />
        </div>
      </div>
    </section>
  );
};

// 회원 통계 컴포넌트
const MemberChart = () => {
  return (
    <div>
      <h3>회원 통계</h3>
    </div>
  );
};

// 사이트 방문 통계 컴포넌트
const SiteVisitChart = () => {
  return (
    <div>
      <h3>사이트 방문 통계</h3>
    </div>
  );
};

// 게시글 생성 통계 컴포넌트
const PostChart = () => {
  return (
    <div>
      <h3>게시글 생성 통계</h3>
    </div>
  );
};

// 매출 통계 컴포넌트
const SalesChart = () => {
  return (
    <div>
      <h3>매출 통계</h3>
    </div>
  );
};

export default AdminToday;
