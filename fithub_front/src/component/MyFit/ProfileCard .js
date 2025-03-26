import React from "react";
import "./profileCard.css";

const ProfileCard = () => {
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
        <button className="myfit-profile-button">프로필 편집</button>
        <button className="myfit-profile-button">My Fit 통계</button>
      </div>
      <div className="myfit-profile-summary">
        <h3>요약</h3>
        <ul>
          <li>총 운동 일수 : 21일</li>
          <li>총 운동 시간 : 53시간</li>
          <li>지난 1주 운동 일수 : 4일</li>
          <li>지난 1주 운동 시간 : 7시간</li>
        </ul>
      </div>
    </div>
  );
};

export default ProfileCard;
