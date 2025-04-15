import React, { useEffect, useState } from "react";
import { ResponsivePie } from "@nivo/pie";
import { ResponsiveBar } from "@nivo/bar";
import { ResponsiveLine } from "@nivo/line";
import axios from "axios";

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
        <div className="tab-div">
          <div
            className={tabChange === 1 ? "page-title active-tab" : "page-title"}
            id="member"
            onClick={changeTab}
          >
            회원 활동 통계
          </div>
        </div>
        <div className="tab-div">
          <div
            className={tabChange === 2 ? "page-title active-tab" : "page-title"}
            id="board"
            onClick={changeTab}
          >
            상품 통계
          </div>
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
        chartData.metricHeaders[0].name && "당일 방문자",
        chartData.metricHeaders[1].name && "재 방문자",
      ]);
    }
  }, [chartData]);

  const [type, setType] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const changeType = (click) => {
    setActiveIndex(click);
    switch (click) {
      case 0:
        setType(["당일 방문자", "재 방문자"]);
        break;
      case 1:
        setType(["당일 방문자"]);
        break;
      case 2:
        setType(["재 방문자"]);
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
          {lineChartData && setLineChartData && (
            <MyResponsiveLine
              lineChartData={lineChartData}
              setLineChartData={setLineChartData}
            />
          )}
        </div>
      </div>
      <div>
        <div>회원 수</div>
        <div className="chart-div" style={{ height: "300px" }}>
          {pieChartData && <MyResponsivePie pieChartData={pieChartData} />}
        </div>
      </div>
    </div>
  );
};

/*---------- 매출 통계 탭 ----------*/
const SalesStatChart = () => {
  const [totalPrice, setTotalPrice] = useState([]);
  const [totalSell, setTotalSell] = useState([]);
  const [weekPrice, setWeekPrice] = useState([]);
  const [monthPrice, setMonthPrice] = useState([]);
  // 보충제: 1,
  // 비타민: 2,
  // 스포츠웨어남: 3,
  // 스포츠웨어여: 4,
  // 운동기구: 5,

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACK_SERVER}/admin/totalPrice`)
      .then((res) => {
        console.log(res);
        setTotalPrice([
          {
            id: res.data[0].goodsCategory === 1 && "보충제",
            label: res.data[0].goodsCategory === 1 && "보충제",
            value: res.data[0].categoryTotalPrice,
            color: "hsl(182, 70%, 50%)",
          },
          {
            id: res.data[1].goodsCategory === 2 && "비타민",
            label: res.data[1].goodsCategory === 2 && "비타민",
            value: res.data[1].categoryTotalPrice,
            color: "hsl(100, 70%, 50%)",
          },
          {
            id: res.data[2].goodsCategory === 3 && "스포츠웨어(남)",
            label: res.data[2].goodsCategory === 3 && "스포츠웨어(남)",
            value: res.data[2].categoryTotalPrice,
            color: "hsl(40, 70%, 50%)",
          },
          {
            id: res.data[3].goodsCategory === 4 && "스포츠웨어(여)",
            label: res.data[3].goodsCategory === 4 && "스포츠웨어(여)",
            value: res.data[3].categoryTotalPrice,
            color: "hsl(0, 70%, 50%)",
          },
          {
            id: res.data[4].goodsCategory === 5 && "운동기구",
            label: res.data[4].goodsCategory === 5 && "운동기구",
            value: res.data[4].categoryTotalPrice,
            color: "hsl(0, 70%, 50%)",
          },
        ]);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  const totalSum = totalPrice.reduce((acc, cur) => acc + cur.value, 0);
  const formattedSum = totalSum.toLocaleString();

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACK_SERVER}/admin/totalSell`)
      .then((res) => {
        console.log(res);
        setTotalSell(
          res.data.map((item) => ({
            id: item.goodsName,
            label: item.goodsName,
            value: item.totalSell,
          }))
        );
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  const totalCount = totalSell.reduce((acc, cur) => acc + cur.value, 0);
  const [daySales, setDaySales] = useState([]);
  const [type, setType] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  /*------------------------------------ 절대 건들지마 ------------------*/
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACK_SERVER}/admin/weekSales`)
      .then((res) => {
        console.log(res.data);
        setWeekPrice(
          res.data.map((item) => ({
            country: item.saleDate,
            "일 매출": item.totalDayPrice,
          }))
        );
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACK_SERVER}/admin/monthSales`)
      .then((res) => {
        setMonthPrice(
          res.data.map((item) => ({
            country: item.weekNo + "주차",
            "주간 매출": item.totalWeekPrice,
          }))
        );
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    // 초기값으로 주간 매출 세팅
    if (weekPrice.length > 0) {
      setDaySales(weekPrice);
      setType(["일 매출", "주간 매출"]);
    }
  }, [weekPrice]);

  const changeType = (click) => {
    setActiveIndex(click);
    switch (click) {
      case 0:
        setDaySales(weekPrice);
        break;
      case 1:
        setDaySales(monthPrice);
        break;
    }
  };

  return (
    <div className="sales-stat-chart">
      <div className="chart-first">
        <div className="chart-day-member">
          <h3>카테고리별 매출 통계 - 총 {formattedSum}원</h3>
          <div className="chart-div" style={{ height: "300px" }}>
            {totalPrice && <MyResponsivePie pieChartData={totalPrice} />}
          </div>
        </div>
        <div className="chart-day-visit">
          <h3>상품별 판매 갯수 - 총 {totalCount}개</h3>
          <div className="chart-div" style={{ height: "300px" }}>
            {totalSell && <MyResponsivePie pieChartData={totalSell} />}
          </div>
        </div>
      </div>
      <div className="chart-third">
        <div className="chart-day-sales">
          <h3>매출 통계</h3>
          <div className="chart-div" style={{ height: "300px" }}>
            {daySales && type && (
              <MyResponsiveBar2 daySales={daySales} type={type} />
            )}
          </div>
          <div className="chart-filter">
            <div
              onClick={() => changeType(0)}
              className={`filter ${activeIndex === 0 ? "active-filter" : ""}`}
            >
              주간 매출 통계
            </div>
            <div
              onClick={() => changeType(1)}
              className={`filter ${activeIndex === 1 ? "active-filter" : ""}`}
            >
              월간 매출 통계
            </div>
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
      (_, index) => {
        const rawDate = chartData.rows[index]?.dimensionValues[0]?.value;
        const formattedDate = rawDate
          ? `${rawDate.slice(0, 4)}-${rawDate.slice(4, 6)}-${rawDate.slice(
              6,
              8
            )}`
          : "";

        return {
          date: formattedDate,
          "당일 방문자": chartData.rows[index]?.metricValues[0].value,
          "재 방문자": chartData.rows[index]?.metricValues[1].value,
        };
      }
    );

    setData(newData);
  }, []);

  const colorMap = {
    "당일 방문자": "hsl(348, 58.30%, 58.60%)",
    "재 방문자": "hsl(221, 70.20%, 50.00%)",
  };
  return (
    <>
      {data && type && (
        <ResponsiveBar
          data={data}
          keys={type}
          indexBy="date"
          margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
          padding={0.3}
          valueScale={{ type: "linear" }}
          indexScale={{ type: "band", round: true }}
          colors={({ id }) => colorMap[id]}
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
      )}
    </>
  );
};

const MyResponsiveBar2 = ({ daySales, type }) => (
  <>
    {daySales && type && (
      <ResponsiveBar
        data={daySales}
        keys={type}
        indexBy="country"
        margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
        padding={0.3}
        valueScale={{ type: "linear" }}
        indexScale={{ type: "band", round: true }}
        colors={{ scheme: "nivo" }}
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
          legend: "날짜",
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
    )}
  </>
);

/* 회원 이용 통계 */
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
          const rawDate = row.dimensionValues[0].value;
          const formattedDate = rawDate
            ? `${rawDate.slice(0, 4)}-${rawDate.slice(4, 6)}-${rawDate.slice(
                6,
                8
              )}`
            : "";

          const pageViews = parseInt(row.metricValues[0].value, 10);
          const sessionDuration = parseFloat(row.metricValues[1].value);

          viewsData.push({ x: formattedDate, y: pageViews });
          sessionData.push({ x: formattedDate, y: sessionDuration });
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
    <>
      {Array.isArray(lineChartData) &&
        lineChartData.length > 0 &&
        lineChartData.some(
          (serie) => Array.isArray(serie.data) && serie.data.length > 0
        ) && (
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
            colors={{ scheme: "accent" }}
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
        )}
    </>
  );
};

const MyResponsivePie = ({ pieChartData }) => {
  return (
    <>
      {pieChartData && (
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
              anchor: "right",
              direction: "column",
              justify: false,
              translateX: -20,
              translateY: 56,
              itemsSpacing: 1,
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
      )}
    </>
  );
};

export default AdminStat;
