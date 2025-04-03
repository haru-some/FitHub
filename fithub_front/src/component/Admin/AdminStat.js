import React, { useEffect, useState } from "react";
import { ResponsivePieCanvas } from "@nivo/pie";
import { ResponsiveBar } from "@nivo/bar";
import { ResponsiveLine } from "@nivo/line";
import { ResponsiveCalendar } from "@nivo/calendar";
import axios from "axios";
import { BrowserRouter, Route, Routes } from "react-router-dom";

// 메인 대시보드
const AdminStat = () => {
  const [tabChange, setTabChange] = useState(1);
  const [chartData, setChartData] = useState(null);
  const [week, setWeek] = useState([]);
  const [month, setMonth] = useState([]);

  useEffect(() => {
    //이번 달 데이터
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth(); // 0(1월) ~ 11(12월)
    const day = today.getDate(); // 오늘 날짜 (1~31)
    const newData = [];

    for (let i = 1; i <= day; i++) {
      const dateString = new Date(year, month, i + 1)
        .toISOString()
        .split("T")[0]; // YYYY-MM-DD 형식

      newData.push({
        day: dateString,
      });
    }
    setMonth(newData);

    //이번 주 데이터
    const weekArr = new Array();
    for (let i = 0; i < 7; i++) {
      const toDays = new Date();
      toDays.setDate(toDays.getDate() - i);
      const days = ["일", "월", "화", "수", "목", "금", "토"];
      if (i === 0) {
        weekArr.unshift("오늘(" + days[toDays.getDay()] + ")");
      } else {
        weekArr.unshift(days[toDays.getDay()]);
      }
    }
    setWeek((prevData) =>
      prevData.map((item, index) => ({
        ...item,
        country: weekArr[index],
      }))
    );
  }, []);
  console.log(month);
  console.log(week);
  const changeTab = (e) => {
    const member = e.target.id;
    if (member === "member") {
      setTabChange(1);
    } else {
      setTabChange(2);
    }
  };
  return (
    <section className="admin-stat-section">
      <div className="admin-member-tab">
        <div
          className={tabChange === 1 ? "page-title active-tab" : "page-title"}
          id="member"
          onClick={changeTab}
        >
          회원 활동 통계
        </div>
        <div
          className={tabChange === 2 ? "page-title active-tab" : "page-title"}
          id="board"
          onClick={changeTab}
        >
          매출 통계
        </div>
      </div>
      <div className="admin-stat-tab-content">
        {tabChange === 1 ? (
          <MemberStatChart chartData={chartData} setChartData={setChartData} />
        ) : (
          <SalesStatChart />
        )}
      </div>
    </section>
  );
};

/*---------- 회원 통계 탭 ----------*/
const MemberStatChart = (props) => {
  const setChartData = props.setChartData;
  const chartData = props.chartData;

  useEffect(() => {
    // 'client_id', 'client_secret', 'refresh_token'을 사용하여 갱신된 'access_token'을 요청한다.
    axios
      .post("https://accounts.google.com/o/oauth2/token", {
        client_id: `${process.env.REACT_APP_OAUTH_CLIENT_ID}`,
        client_secret: `${process.env.REACT_APP_OAUTH_CLIENT_SECRET}`,
        refresh_token: `${process.env.REACT_APP_OAUTH_REFRESH_TOKEN}`,
        grant_type: "refresh_token",
      })
      .then((response) => {
        // 만약 정상적으로 'access_token'을 받았다면, 기본 보고서(runReport)를 호출하는 요청을 보낸다.
        axios
          .post(
            `https://analyticsdata.googleapis.com/v1beta/properties/${process.env.REACT_APP_GA4_PROPERTY_ID}:runReport`,
            // runReport 요청에 필요한 'dimensions', 'metrics', 'dataRanges'를 data에 포함하여 전송한다.
            {
              dimensions: [{ name: "date" }],
              metrics: [
                { name: "activeUsers" },
                { name: "screenPageViews" },
                { name: "sessions" },
              ],
              dateRanges: [{ startDate: "2025-04-02", endDate: "today" }],
              keepEmptyRows: true,
            },
            // 이전에 전달받은 'access_token'을 headers에 담는다(인증).
            {
              headers: {
                Authorization: `Bearer ${response.data.access_token}`,
              },
            }
          )
          // 정상적으로 응답을 받았다면, 콘솔창에 runReport의 결과가 나타날 것이다.
          .then((response) => {
            console.log("ga4 데이터");
            console.log(response.data);
            console.log("ga4 목록");
            console.log(response.data.metricHeaders);
            console.log("ga4 날짜");
            console.log(response.data.rows[0].dimensionValues);
            console.log("ga4 값");
            console.log(response.data.rows[0].metricValues);
            setChartData(response.data);
          })
          // runReport가 정상적으로 호출되지 않았다면, [REPORT ERROR]라는 문구와 함께 콘솔창에 에러가 보일 것이다.
          .catch((error) => {
            console.log("[REPORT ERROR] ", error);
          });
      })
      // 'access_token'을 호출하는 것에 실패했다면, [TOKEN ERROR]라는 문구와 함께 콘솔창에 에러가 보일 것이다.
      .catch((error) => {
        console.log("[TOKEN ERROR] ", error);
      });
  }, []);
  return (
    <div className="member-stat-chart">
      <div className="chart-first">
        <div>첫번째 차트</div>
        <div style={{ height: "300px" }}>
          {chartData && <MyResponsiveBar chartData={chartData} />}
        </div>
      </div>
    </div>
  );
};

/*---------- 매출 통계 탭 ----------*/
const SalesStatChart = () => {
  /*
  useEffect(() => {
    //방문 데이터 입력
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth(); // 0(1월) ~ 11(12월)
    const day = today.getDate(); // 오늘 날짜 (1~31)
    const newData = [];

    for (let i = 1; i <= day; i++) {
      const dateString = new Date(year, month, i + 1)
        .toISOString()
        .split("T")[0]; // YYYY-MM-DD 형식
      const randomValue = Math.floor(Math.random() * 100) + 1; // 1~100 사이 랜덤 숫자

      newData.push({
        value: randomValue,
        day: dateString,
      });
    }
    setVisitData(newData);

    //매출 데이터 입력
    const salesArr = new Array();
    for (let i = 0; i < 7; i++) {
      const toDays = new Date();
      toDays.setDate(toDays.getDate() - i);
      const days = ["일", "월", "화", "수", "목", "금", "토"];
      if (i === 0) {
        salesArr.unshift("오늘(" + days[toDays.getDay()] + ")");
      } else {
        salesArr.unshift(days[toDays.getDay()]);
      }
    }
    setSalesData((prevData) =>
      prevData.map((item, index) => ({
        ...item,
        country: salesArr[index],
      }))
    );
  }, []);
  */
  return (
    <div className="sales-stat-chart">
      <div className="chart-first">
        <div className="chart-day-member">
          <h3>총 회원 통계</h3>
          <div style={{ height: "300px" }}>
            {/* <MyResponsivePieCanvas /> */}
          </div>
        </div>
        <div className="chart-day-visit">
          <h3>사이트 방문 통계</h3>
          <div style={{ height: "300px" }}>
            {/* {visitData && <MyResponsiveCalendar visitData={visitData} />} */}
          </div>
        </div>
      </div>
      <div className="chart-second">
        <div className="chart-day-post">
          <h3>게시글 생성 통계</h3>
          <div style={{ height: "300px" }}></div>
        </div>
      </div>
      <div className="chart-third">
        <div className="chart-day-sales">
          <h3>매출 통계</h3>
          <div style={{ height: "300px" }}>
            {/* {salesData && <MyResponsiveBar salesData={salesData} />} */}
          </div>
        </div>
      </div>
    </div>
  );
};
/*---------- 방문자 통계 차트 ----------*/
const MyResponsiveBar = (props) => {
  const chartData = props.chartData;
  console.log(chartData.metricHeaders[0].name);
  const [data, setData] = useState([
    {
      date: "AD",
      "hot dog": 153,
      "hot dogColor": "hsl(348, 70%, 50%)",
      burger: 157,
      burgerColor: "hsl(86, 70%, 50%)",
      sandwich: 164,
      sandwichColor: "hsl(283, 70%, 50%)",
      kebab: 90,
      kebabColor: "hsl(357, 70%, 50%)",
      fries: 21,
      friesColor: "hsl(300, 70%, 50%)",
      donut: 83,
      donutColor: "hsl(216, 70%, 50%)",
    },
  ]);
  useEffect(() => {
    for (let i = 0; i < 2; i++) {
      setData([
        {
          ...data,
          date: "AD",
          "hot dog": 153,
          "hot dogColor": "hsl(348, 70%, 50%)",
          burger: 157,
          burgerColor: "hsl(86, 70%, 50%)",
          sandwich: 164,
          sandwichColor: "hsl(283, 70%, 50%)",
          kebab: 90,
          kebabColor: "hsl(357, 70%, 50%)",
          fries: 21,
          friesColor: "hsl(300, 70%, 50%)",
          donut: 83,
          donutColor: "hsl(216, 70%, 50%)",
        },
      ]);
    }
  }, []);
  return (
    <ResponsiveBar
      data={data}
      keys={["hot dog", "burger", "sandwich", "kebab", "fries", "donut"]}
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
        legend: "date",
        legendPosition: "middle",
        legendOffset: 32,
        truncateTickAt: 0,
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "Count",
        legendPosition: "middle",
        legendOffset: -40,
        truncateTickAt: 0,
      }}
      enableTotals={true}
      totalsOffset={6}
      labelSkipWidth={12}
      labelSkipHeight={12}
      labelTextColor="white"
      legends={[
        {
          dataFrom: "keys",
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

export default AdminStat;
