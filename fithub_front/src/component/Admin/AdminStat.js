import React, { useEffect, useState } from "react";
import { ResponsivePie } from "@nivo/pie";
import { ResponsiveBar } from "@nivo/bar";
import { ResponsiveLine } from "@nivo/line";
import { ResponsiveCalendar } from "@nivo/calendar";
import axios from "axios";
import { BrowserRouter, Route, Routes } from "react-router-dom";

// 메인 대시보드
const AdminStat = () => {
  const [tabChange, setTabChange] = useState(1);
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
          상품 통계
        </div>
      </div>
      <div className="admin-stat-tab-content">
        {tabChange === 1 ? <MemberStatChart /> : <SalesStatChart />}
      </div>
    </section>
  );
};

/*---------- 회원 통계 탭 ----------*/
const MemberStatChart = () => {
  const [chartData, setChartData] = useState(null);
  const [lineChartData, setLineChartData] = useState([]);
  const [pieChartData, setPieChartData] = useState([
    { id: "관리자", label: "관리자", value: 0, color: "hsl(182, 70%, 50%)" },
    {
      id: "일반회원",
      label: "일반회원",
      value: 0,
      color: "hsl(100, 70%, 50%)",
    },
    { id: "탈퇴회원", label: "탈퇴회원", value: 0, color: "hsl(40, 70%, 50%)" },
    {
      id: "강제탈퇴회원",
      label: "강제탈퇴회원",
      value: 0,
      color: "hsl(0, 70%, 50%)",
    },
  ]);

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
              metrics: [{ name: "activeUsers" }, { name: "sessions" }],
              dateRanges: [{ startDate: "2025-03-27", endDate: "today" }],
              keepEmptyRows: true,
              orderBys: [
                {
                  dimension: {
                    dimensionName: "date",
                    orderType: "ALPHANUMERIC", // date는 YYYYMMDD 형식이라 알파벳 정렬도 문제 없음
                  },
                  desc: false, // 오름차순
                },
              ],
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

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACK_SERVER}/admin/getMember`)
      .then((res) => {
        console.log(res);
        setPieChartData([
          {
            id: "관리자",
            label: "관리자",
            value: res.data.adminCount,
            color: "hsl(182, 70%, 50%)",
          },
          {
            id: "일반회원",
            label: "일반회원",
            value: res.data.memberCount,
            color: "hsl(100, 70%, 50%)",
          },
          {
            id: "탈퇴회원",
            label: "탈퇴회원",
            value: res.data.delMemberCount,
            color: "hsl(40, 70%, 50%)",
          },
          {
            id: "강퇴된 회원",
            label: "강퇴된 회원",
            value: res.data.kickMemberCount,
            color: "hsl(0, 70%, 50%)",
          },
        ]);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    if (chartData?.metricHeaders?.length) {
      setType([
        chartData.metricHeaders[0].name,
        chartData.metricHeaders[1].name,
      ]);
    }
  }, [chartData]);

  const [type, setType] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const changeType = (click) => {
    setActiveIndex(click);
    switch (click) {
      case 0:
        setType([
          chartData.metricHeaders[0].name,
          chartData.metricHeaders[1].name,
        ]);
        break;
      case 1:
        setType([chartData.metricHeaders[0].name]);
        break;
      case 2:
        setType([chartData.metricHeaders[1].name]);
        break;
    }
  };
  return (
    <div className="member-stat-chart">
      <div className="chart-first">
        <div>회원 방문 통계</div>
        <div className="chart-div" style={{ height: "300px" }}>
          {chartData && <MyResponsiveBar chartData={chartData} type={type} />}
        </div>
        <div className="chart-filter">
          <div
            onClick={() => changeType(0)}
            className={`filter ${activeIndex === 0 ? "active-filter" : ""}`}
          >
            전체
          </div>
          <div
            onClick={() => changeType(1)}
            className={`filter ${activeIndex === 1 ? "active-filter" : ""}`}
          >
            방문자 수
          </div>
          <div
            onClick={() => changeType(2)}
            className={`filter ${activeIndex === 2 ? "active-filter" : ""}`}
          >
            재방문 수
          </div>
        </div>
      </div>
      <div>
        <div>회원 이용 통계</div>
        <div className="chart-div" style={{ height: "400px" }}>
          <MyResponsiveLine
            lineChartData={lineChartData}
            setLineChartData={setLineChartData}
          />
        </div>
      </div>
      <div>
        <div>세번째 차트</div>
        <div className="chart-div" style={{ height: "300px" }}>
          <MyResponsivePie pieChartData={pieChartData} />
        </div>
      </div>
    </div>
  );
};

/*---------- 매출 통계 탭 ----------*/
const SalesStatChart = () => {
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACK_SERVER}/admin/salesStat`)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
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
  const type = props.type;
  const [data, setData] = useState([{}]);

  useEffect(() => {
    const newData = Array.from(
      { length: chartData.rows.length },
      (_, index) => ({
        date: chartData.rows[index]?.dimensionValues[0]?.value,
        activeUsers: chartData.rows[index]?.metricValues[0].value,
        sessions: chartData.rows[index]?.metricValues[1].value,
      })
    );

    setData(newData);
  }, []);
  const colorMap = {
    activeUsers: "hsl(348, 58.30%, 58.60%)",
    sessions: "hsl(221, 70.20%, 50.00%)",
  };
  return (
    <ResponsiveBar
      data={data}
      keys={type}
      indexBy="date"
      margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
      padding={0.3}
      valueScale={{ type: "linear" }}
      indexScale={{ type: "band", round: true }}
      colors={({ id }) => colorMap[id]}
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

/* 회원 이용 통계 */
/*
const MyResponsiveLine = ({ lineChartData, setLineChartData }) => {
  useEffect(() => {
    // access_token을 발급받은 후 runReport 요청
    axios
      .post("https://accounts.google.com/o/oauth2/token", {
        client_id: process.env.REACT_APP_OAUTH_CLIENT_ID,
        client_secret: process.env.REACT_APP_OAUTH_CLIENT_SECRET,
        refresh_token: process.env.REACT_APP_OAUTH_REFRESH_TOKEN,
        grant_type: "refresh_token",
      })
      .then((response) => {
        const accessToken = response.data.access_token;

        return axios.post(
          `https://analyticsdata.googleapis.com/v1beta/properties/${process.env.REACT_APP_GA4_PROPERTY_ID}:runReport`,
          {
            dimensions: [{ name: "date" }],
            metrics: [
              { name: "screenPageViews" },
              { name: "averageSessionDuration" },
            ],
            dateRanges: [{ startDate: "2025-03-27", endDate: "today" }],
            keepEmptyRows: true,
            orderBys: [
              {
                dimension: {
                  dimensionName: "date",
                  orderType: "ALPHANUMERIC",
                },
                desc: false,
              },
            ],
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
      })
      .then((response) => {
        const rows = response.data.rows || [];

        // GA4 데이터 → Nivo 데이터 형식으로 변환
        const viewsData = [];
        const sessionData = [];

        rows.forEach((row) => {
          const date = row.dimensionValues[0].value;
          const pageViews = parseInt(row.metricValues[0].value, 10);
          const sessionDuration = parseFloat(row.metricValues[1].value);

          viewsData.push({ x: date, y: pageViews });
          sessionData.push({ x: date, y: sessionDuration });
        });
        console.log("📊 변환된 데이터:", viewsData, sessionData);
        setLineChartData([
          { id: "페이지뷰", color: "hsl(220, 70%, 50%)", data: viewsData },
          {
            id: "평균 세션 시간",
            color: "hsl(120, 70%, 50%)",
            data: sessionData,
          },
        ]);
      })
      .catch((error) => {
        console.error("GA4 API 호출 실패:", error);
      });
  }, []);

  return (
    <div>
      {lineChartData && lineChartData.length > 0 && (
        <ResponsiveLine
          data={lineChartData}
          margin={{ top: 50, right: 60, bottom: 50, left: 60 }}
          xScale={{ type: "point" }}
          yScale={{ type: "linear", stacked: false, min: "auto", max: "auto" }}
          axisBottom={{
            orient: "bottom",
            legend: "날짜",
            legendOffset: 36,
            legendPosition: "middle",
          }}
          axisLeft={{
            orient: "left",
            legend: "수치",
            legendOffset: -40,
            legendPosition: "middle",
          }}
          colors={{ scheme: "category10" }}
          pointSize={8}
          pointColor={{ theme: "background" }}
          pointBorderWidth={2}
          pointBorderColor={{ from: "serieColor" }}
          useMesh={true}
          legends={[
            {
              anchor: "bottom-right",
              direction: "column",
              justify: false,
              translateX: 100,
              translateY: 0,
              itemsSpacing: 4,
              itemDirection: "left-to-right",
              itemWidth: 120,
              itemHeight: 20,
              symbolSize: 12,
              symbolShape: "circle",
            },
          ]}
          tooltip={({ point }) => (
            <div
              style={{
                background: "white",
                padding: "8px 12px",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            >
              <strong>{point.serieId}</strong>: {point.data.yFormatted}
              <br />
              <span>{point.data.xFormatted}</span>
            </div>
          )}
        />
      )}
    </div>
  );
};
*/
const MyResponsiveLine = ({ lineChartData, setLineChartData }) => {
  useEffect(() => {
    // access_token을 발급받은 후 runReport 요청
    axios
      .post("https://accounts.google.com/o/oauth2/token", {
        client_id: process.env.REACT_APP_OAUTH_CLIENT_ID,
        client_secret: process.env.REACT_APP_OAUTH_CLIENT_SECRET,
        refresh_token: process.env.REACT_APP_OAUTH_REFRESH_TOKEN,
        grant_type: "refresh_token",
      })
      .then((response) => {
        const accessToken = response.data.access_token;

        return axios.post(
          `https://analyticsdata.googleapis.com/v1beta/properties/${process.env.REACT_APP_GA4_PROPERTY_ID}:runReport`,
          {
            dimensions: [{ name: "date" }],
            metrics: [
              { name: "screenPageViews" },
              { name: "averageSessionDuration" },
            ],
            dateRanges: [{ startDate: "2025-03-27", endDate: "today" }],
            keepEmptyRows: true,
            orderBys: [
              {
                dimension: {
                  dimensionName: "date",
                  orderType: "ALPHANUMERIC",
                },
                desc: false,
              },
            ],
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
      })
      .then((response) => {
        const rows = response.data.rows || [];

        // GA4 데이터 → Nivo 데이터 형식으로 변환
        const viewsData = [];
        const sessionData = [];

        rows.forEach((row) => {
          const date = row.dimensionValues[0].value;
          const pageViews = parseInt(row.metricValues[0].value, 10);
          const sessionDuration = parseFloat(row.metricValues[1].value);

          viewsData.push({ x: date, y: pageViews });
          sessionData.push({ x: date, y: sessionDuration });
        });
        console.log("📊 변환된 데이터:", viewsData, sessionData);
        setLineChartData([
          { id: "페이지뷰", color: "hsl(220, 70%, 50%)", data: viewsData },
          {
            id: "평균 세션 시간",
            color: "hsl(120, 70%, 50%)",
            data: sessionData,
          },
        ]);
      })
      .catch((error) => {
        console.error("GA4 API 호출 실패:", error);
      });
  }, []);
  return (
    <ResponsiveLine
      data={lineChartData}
      margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
      xScale={{ type: "point" }}
      yScale={{
        type: "linear",
        min: "auto",
        max: "auto",
        stacked: true,
        reverse: false,
      }}
      yFormat=" >-.2f"
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "날짜",
        legendOffset: 36,
        legendPosition: "middle",
        truncateTickAt: 0,
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "수치",
        legendOffset: -40,
        legendPosition: "middle",
        truncateTickAt: 0,
      }}
      pointSize={10}
      pointColor={{ theme: "background" }}
      pointBorderWidth={2}
      pointBorderColor={{ from: "serieColor" }}
      pointLabel="data.yFormatted"
      pointLabelYOffset={-12}
      enableTouchCrosshair={true}
      useMesh={true}
      legends={[
        {
          anchor: "bottom-right",
          direction: "column",
          justify: false,
          translateX: 100,
          translateY: 0,
          itemsSpacing: 0,
          itemDirection: "left-to-right",
          itemWidth: 80,
          itemHeight: 20,
          itemOpacity: 0.75,
          symbolSize: 12,
          symbolShape: "circle",
          symbolBorderColor: "rgba(0, 0, 0, .5)",
          effects: [
            {
              on: "hover",
              style: {
                itemBackground: "rgba(0, 0, 0, .03)",
                itemOpacity: 1,
              },
            },
          ],
        },
      ]}
    />
  );
};

const MyResponsivePie = ({ pieChartData }) => {
  return (
    <ResponsivePie
      data={pieChartData}
      margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
      innerRadius={0.5}
      padAngle={0.7}
      cornerRadius={3}
      activeInnerRadiusOffset={20}
      activeOuterRadiusOffset={20}
      borderWidth={1}
      borderColor={{
        from: "color",
        modifiers: [["darker", 0.2]],
      }}
      arcLinkLabelsSkipAngle={10}
      arcLinkLabelsTextColor="#333333"
      arcLinkLabelsThickness={2}
      arcLinkLabelsColor={{ from: "color", modifiers: [] }}
      arcLabelsSkipAngle={10}
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
      motionConfig={{
        mass: 1,
        tension: 500,
        friction: 10,
        clamp: false,
        precision: 0.01,
        velocity: 0,
      }}
      legends={[
        {
          anchor: "bottom",
          direction: "row",
          justify: false,
          translateX: 0,
          translateY: 56,
          itemsSpacing: 0,
          itemWidth: 100,
          itemHeight: 18,
          itemTextColor: "#999",
          itemDirection: "left-to-right",
          itemOpacity: 1,
          symbolSize: 18,
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

export default AdminStat;
