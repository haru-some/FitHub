import React, { useState } from "react";
import "./profileCard.css";
import { Link, Route, Routes } from "react-router-dom";
import { ResponsiveLine } from "@nivo/line";

const ProfileCard = () => {
  const [act, setAct] = useState(1);
  return (
    <div className="myfit-profile-card">
      <div className="myfit-profile-header">
        <div className="myfit-profile-icon">
          <i className="fas fa-user"></i>{" "}
          {/* You can replace this with an actual image */}
        </div>
        <div className="myfit-profile-info">
          <div className="name-wrap">
            <h2>홍길동</h2>
          </div>
          <div className="myfit-profile-stats">
            <div>
              <p>0</p>
              <p>게시물</p>
            </div>
            <div>
              <p>6</p>
              <p>팔로워</p>
            </div>
            <div>
              <p>6</p>
              <p>팔로잉</p>
            </div>
          </div>
        </div>
      </div>
      <div className="myfit-profile-actions">
        <Link to="/member/info">
          <button className="myfit-profile-button">프로필 편집</button>
        </Link>
        <button
          className="myfit-profile-button"
          onClick={() => {
            setAct(act === 1 ? 2 : 1);
          }}
        >
          {act === 1 ? "My Fit 통계" : "My Fit 요약"}
        </button>
      </div>
      <div className="myfit-profile-summary">
        {act === 1 ? (
          <div className="summary-wrap">
            <h3>요약</h3>
            <ul>
              <li>
                <span>총 운동 일수 : </span>
                <span>21일</span>
              </li>
              <li>
                <span>총 운동 시간 : </span>
                <span>53시간</span>
              </li>
              <li>
                <span>지난 1주 운동 일수 : </span>
                <span>4일</span>
              </li>
              <li>
                <span>지난 1주 운동 시간 : </span>
                <span>7시간</span>
              </li>
            </ul>
          </div>
        ) : (
          <div>
            <h3>주간 운동 통계</h3>
            <div className="chart-wrap">
              <MyLineChart />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const MyLineChart = () => {
  const dates = [];
  const today = new Date();

  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(today.getDate() - i);

    // 날짜 포맷 (예: YYYY-MM-DD)
    const formatted = date.toISOString().split("T")[0];
    dates.push(formatted);
  }
  const data = [
    {
      id: "japan",
      color: "hsl(327, 70%, 50%)",
      data: [
        {
          x: dates[0],
          y: 2,
        },
        {
          x: dates[1],
          y: 3,
        },
        {
          x: dates[2],
          y: 4,
        },
        {
          x: dates[3],
          y: 1,
        },
        {
          x: dates[4],
          y: 4,
        },
        {
          x: dates[5],
          y: 2,
        },
        {
          x: dates[6],
          y: 5,
        },
      ],
    },
  ];

  return (
    <div style={{ height: 400, width: 700 }}>
      <ResponsiveLine
        data={data}
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
          legend: "주간 운동 통계",
          legendOffset: 36,
          legendPosition: "middle",
          truncateTickAt: 0,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "운동 시간",
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
    </div>
  );
};

export default ProfileCard;
