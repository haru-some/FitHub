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

  const [visitData, setVisitData] = useState(null);

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
        {tabChange === 1 ? <MemberStatChart /> : <SalesStatChart />}
      </div>
    </section>
  );
};

const MemberStatChart = () => {
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
            console.log(response);
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
  });
  return (
    <div className="member-stat-chart">
      <div className="chart-first">
        <div>첫번째 차트</div>
      </div>
    </div>
  );
};

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

export default AdminStat;
