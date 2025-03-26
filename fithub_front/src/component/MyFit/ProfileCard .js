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
          <div>
            <h3>요약</h3>
            <ul>
              <li>총 운동 일수 : 21일</li>
              <li>총 운동 시간 : 53시간</li>
              <li>지난 1주 운동 일수 : 4일</li>
              <li>지난 1주 운동 시간 : 7시간</li>
            </ul>
          </div>
        ) : (
          <div>
            <h3>그래프 들어갈 자리</h3>
            <ResponsiveLine />
          </div>
        )}
      </div>
    </div>
  );
};

const data = [
  {
    id: "japan",
    data: [
      { x: "January", y: 55 },
      { x: "February", y: 80 },
      { x: "March", y: 45 },
    ],
  },
];
const MyLineChart = () => (
  <div style={{ height: 400 }}>
    <ResponsiveLine
      data={data}
      margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
      xScale={{ type: "point" }}
      yScale={{ type: "linear", min: "auto", max: "auto" }}
      axisBottom={{
        orient: "bottom",
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
      }}
      axisLeft={{
        orient: "left",
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
      }}
      colors={{ scheme: "nivo" }}
    />
  </div>
);

export default ProfileCard;
