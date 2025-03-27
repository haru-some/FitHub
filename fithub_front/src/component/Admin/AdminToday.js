import React, { useEffect, useState } from "react";
import { ResponsivePieCanvas } from "@nivo/pie";
import { ResponsiveBar } from "@nivo/bar";
import { ResponsiveLine } from "@nivo/line";

// 메인 대시보드
const AdminToday = () => {
  const [memberData, setMemberData] = useState([
    {
      id: "남성",
      label: "남성",
      value: 863,
      color: "#6495ed",
    },
    {
      id: "여성",
      label: "여성",
      value: 242,
      color: "#c8739a",
    },
    {
      id: "비공개",
      label: "비공개",
      value: 341,
      color: "#c8bf73",
    },
  ]);
  const [salesData, setSalesData] = useState([
    {
      country: "",
      마켓: 88,
      마켓Color: "hsl(306, 70%, 50%)",
      광고: 130,
      광고Color: "hsl(353, 70%, 50%)",
    },
    {
      country: "",
      마켓: 88,
      마켓Color: "hsl(306, 70%, 50%)",
      광고: 130,
      광고Color: "hsl(353, 70%, 50%)",
    },
    {
      country: "",
      마켓: 88,
      마켓Color: "hsl(306, 70%, 50%)",
      광고: 130,
      광고Color: "hsl(353, 70%, 50%)",
    },
    {
      country: "",
      마켓: 88,
      마켓Color: "hsl(306, 70%, 50%)",
      광고: 130,
      광고Color: "hsl(353, 70%, 50%)",
    },
    {
      country: "",
      마켓: 88,
      마켓Color: "hsl(306, 70%, 50%)",
      광고: 130,
      광고Color: "hsl(353, 70%, 50%)",
    },
    {
      country: "",
      마켓: 88,
      마켓Color: "hsl(306, 70%, 50%)",
      광고: 130,
      광고Color: "hsl(353, 70%, 50%)",
    },
    {
      country: "",
      마켓: 88,
      마켓Color: "hsl(306, 70%, 50%)",
      광고: 130,
      광고Color: "hsl(353, 70%, 50%)",
    },
  ]);
  useEffect(() => {
    const arr = new Array();
    for (let i = 0; i < 7; i++) {
      const toDate = new Date();
      toDate.setDate(toDate.getDate() - i);
      const days = ["일", "월", "화", "수", "목", "금", "토"];
      if (i === 0) {
        arr.unshift("오늘(" + days[toDate.getDay()] + ")");
      } else {
        arr.unshift(days[toDate.getDay()]);
      }
    }
    setSalesData((prevData) =>
      prevData.map((item, index) => ({
        ...item,
        country: arr[index], // arr의 값을 순서대로 id에 넣음
      }))
    );
  }, []);
  return (
    <section className="section today-section">
      <h1 className="page-title">하루 통계</h1>
      <div className="chart-list">
        <div className="chart-first">
          <div className="chart-day-member">
            <h3>회원 통계</h3>
            <div style={{ height: "500px" }}>
              <MyResponsivePieCanvas memberData={memberData} />
            </div>
          </div>
          <VisitChart />
        </div>
        <div className="chart-second">
          <PostChart />
        </div>
        <div className="chart-third">
          <div className="chart-day-sales">
            <h3>매출 통계</h3>
            <div style={{ height: "300px" }}>
              <MyResponsiveBar salesData={salesData} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// 회원 통계 컴포넌트
const MyResponsivePieCanvas = (props) => {
  const memberData = props.memberData;
  const arr = new Array();
  for (let i = 0; i < memberData.length; i++) {
    arr.push(memberData[i].color);
  }
  return (
    <ResponsivePieCanvas
      data={memberData}
      margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
      innerRadius={0.5}
      padAngle={0.7}
      cornerRadius={3}
      activeOuterRadiusOffset={8}
      colors={arr}
      borderWidth={1}
      borderColor={{
        from: "color",
        modifiers: [["darker", "0"]],
      }}
      arcLinkLabelsSkipAngle={10}
      arcLinkLabelsTextColor="#fff"
      arcLinkLabelsThickness={2}
      arcLinkLabelsColor={{ from: "color", modifiers: [] }}
      arcLabelsTextColor={{
        from: "color",
        modifiers: [["darker", 2]],
      }}
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
      ]}
      motionConfig={{
        mass: 1,
        tension: 500,
        friction: 13,
        clamp: false,
        precision: 0.01,
        velocity: 0,
      }}
      legends={[
        {
          anchor: "right",
          direction: "column",
          justify: false,
          translateX: -9,
          translateY: 83,
          itemsSpacing: 5,
          itemWidth: 75,
          itemHeight: 29,
          itemTextColor: "#fff",
          itemDirection: "left-to-right",
          itemOpacity: 1,
          symbolSize: 24,
          symbolShape: "circle",
          effects: [
            {
              on: "hover",
              style: {
                itemTextColor: "#000",
              },
            },
          ],
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

const MyResponsiveBar = (props) => {
  const salesData = props.salesData;
  return (
    <ResponsiveBar
      data={salesData}
      keys={["마켓", "광고"]}
      indexBy="country"
      margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
      padding={0.3}
      valueScale={{ type: "linear" }}
      indexScale={{ type: "band", round: true }}
      colors={{ scheme: "nivo" }}
      defs={[
        {
          id: "dots",
          type: "patternDots",
          background: "inherit",
          color: "#38bcb2",
          size: 4,
          padding: 1,
          stagger: true,
        },
        {
          id: "lines",
          type: "patternLines",
          background: "inherit",
          color: "#eed312",
          rotation: -45,
          lineWidth: 6,
          spacing: 10,
        },
      ]}
      fill={[
        {
          match: {
            id: "fries",
          },
          id: "dots",
        },
        {
          match: {
            id: "sandwich",
          },
          id: "lines",
        },
      ]}
      borderColor={{
        from: "color",
        modifiers: [["darker", 1.6]],
      }}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "요일",
        legendPosition: "middle",
        legendOffset: 32,
        truncateTickAt: 0,
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "매출",
        legendPosition: "middle",
        legendOffset: -40,
        truncateTickAt: 0,
      }}
      labelSkipWidth={12}
      labelSkipHeight={12}
      labelTextColor={{
        from: "color",
        modifiers: [["darker", 1.6]],
      }}
      legends={[
        {
          dataFrom: "key",
          anchor: "bottom-right",
          direction: "column",
          justify: false,
          translateX: 120,
          translateY: 0,
          itemsSpacing: 2,
          itemWidth: 100,
          itemHeight: 20,
          itemDirection: "left-to-right",
          itemOpacity: 0.85,
          symbolSize: 20,
          effects: [
            {
              on: "hover",
              style: {
                itemOpacity: 1,
              },
            },
          ],
        },
      ]}
      role="application"
      ariaLabel="Nivo bar chart demo"
      barAriaLabel={(e) =>
        e.id + ": " + e.formattedValue + " in country: " + e.indexValue
      }
    />
  );
};

export default AdminToday;
