import { useEffect, useState } from "react";
import "./exerciseLog.css";
const ExerciseLog = (props) => {
  const dateFormat = props.dateFormat;
  console.log(dateFormat);
  const date = dateFormat.split("-");
  return (
    <div className="record-wrap">
      <h2>{`${date[0]}년 ${date[1]}월 ${date[2]}일 (${date[3]})`}</h2>
      <div className="time-inputs">
        <div>
          <label>시작 시각</label>
          <input type="time" />
        </div>
        <span>~</span>
        <div>
          <label>완료 시각</label>
          <input type="time" />
        </div>
      </div>
      <div className="exercise-content">
        <label>운동 내용</label>
        <textarea rows="4" placeholder="운동 내용을 입력하세요..."></textarea>
      </div>
      <button className="submit-button">기록하기</button>
    </div>
  );
};

export default ExerciseLog;
