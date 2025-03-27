import React, { useEffect, useState } from "react";
import { ResponsivePieCanvas } from "@nivo/pie";
import { Height } from "@mui/icons-material";
import { useUtils } from "@mui/x-date-pickers/internals";

// 메인 대시보드
const AdminToday = () => {
  return (
    <section className="section today-section">
      <h1 className="page-title">하루 통계</h1>
      <div className="chart-list">
        <div className="chart-first">
          <MemberChart />
          <VisitChart />
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
  const [data, setData] = useState([
    {
      id: "남성",
      label: "남성",
      value: 863,
      color: "rgb(1, 50, 248)",
    },
    {
      id: "여성",
      label: "여성",
      value: 242,
      color: "rgb(240, 44, 10)",
    },
    {
      id: "기타",
      label: "기타",
      value: 133,
      color: "rgb(165, 3, 234)",
    },
    {
      id: "비공개",
      label: "비공개",
      value: 341,
      color: "hsl(128, 78.00%, 49.80%)",
    },
  ]);

  return (
    <div className="chart-day-member">
      <h3>회원 통계</h3>
      <div style={{ height: "500px" }}>
        <MyResponsivePieCanvas data={data} />
      </div>
    </div>
  );
};
const MyResponsivePieCanvas = (props) => {
  const data = props.data;
  return (
    <ResponsivePieCanvas
      data={data}
      margin={{ top: 40, right: 200, bottom: 40, left: 80 }}
      innerRadius={0.5}
      padAngle={0.7}
      cornerRadius={3}
      activeOuterRadiusOffset={8}
      colors={{ scheme: "paired" }}
      borderColor={{
        from: "color",
        modifiers: [["darker", 0.6]],
      }}
      arcLinkLabelsSkipAngle={10}
      arcLinkLabelsTextColor="#333333"
      arcLinkLabelsThickness={2}
      arcLinkLabelsColor={{ from: "color" }}
      arcLabelsSkipAngle={10}
      arcLabelsTextColor="#333333"
      defs={[
        {
          id: "dots",
          type: "patternDots",
          background: "inherit",
          color: "rgba(255, 255, 255, 0.3)",
          size: 4,
          padding: 1,
          stagger: true,
        },
        {
          id: "lines",
          type: "patternLines",
          background: "inherit",
          color: "rgba(255, 255, 255, 0.3)",
          rotation: -45,
          lineWidth: 6,
          spacing: 10,
        },
      ]}
      fill={[
        {
          match: {
            id: "ruby",
          },
          id: "dots",
        },
        {
          match: {
            id: "c",
          },
          id: "dots",
        },
        {
          match: {
            id: "go",
          },
          id: "dots",
        },
        {
          match: {
            id: "python",
          },
          id: "dots",
        },
        {
          match: {
            id: "scala",
          },
          id: "lines",
        },
        {
          match: {
            id: "lisp",
          },
          id: "lines",
        },
        {
          match: {
            id: "elixir",
          },
          id: "lines",
        },
        {
          match: {
            id: "javascript",
          },
          id: "lines",
        },
      ]}
      legends={[
        {
          anchor: "right",
          direction: "column",
          justify: false,
          translateX: 140,
          translateY: 0,
          itemsSpacing: 2,
          itemWidth: 60,
          itemHeight: 14,
          itemTextColor: "#999",
          itemDirection: "left-to-right",
          itemOpacity: 1,
          symbolSize: 14,
          symbolShape: "circle",
        },
      ]}
    />
  );
};
// 사이트 방문 통계 컴포넌트
const VisitChart = () => {
  return (
    <div className="chart-day-visit">
      <h3>사이트 방문 통계</h3>
    </div>
  );
};

// 게시글 생성 통계 컴포넌트
const PostChart = () => {
  return (
    <div className="chart-day-post">
      <h3>게시글 생성 통계</h3>
    </div>
  );
};

// 매출 통계 컴포넌트
const SalesChart = () => {
  const [toWeek, setToWeek] = useState([]);
  useEffect(() => {
    const toDate = new Date();
    console.log(toDate);
  }, []);
  const data = {
    labels: toWeek,
    datasets: [
      {
        label: "My First Dataset",
        data: [65, 59, 80, 81, 56, 55, 40],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(255, 159, 64, 0.2)",
          "rgba(255, 205, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(201, 203, 207, 0.2)",
        ],
        borderColor: [
          "rgb(255, 99, 132)",
          "rgb(255, 159, 64)",
          "rgb(255, 205, 86)",
          "rgb(75, 192, 192)",
          "rgb(54, 162, 235)",
          "rgb(153, 102, 255)",
          "rgb(201, 203, 207)",
        ],
        borderWidth: 1,
      },
    ],
  };
  return (
    <div className="chart-day-sales">
      <h3>매출 통계</h3>
      <div style={{ height: "300px" }}>
        <SalesChart />
      </div>
    </div>
  );
};

export default AdminToday;
