import React, { useState } from "react";
import "./routineSetting.css";

const days = ["월", "화", "수", "목", "금", "토", "일"];

const RoutineSetting = () => {
  const [selectedDay, setSelectedDay] = useState("목");
  const [routine, setRoutine] = useState("");

  return (
    <div className="routine-wrap">
      <div className="routine-days">
        {days.map((day) => (
          <button
            key={day}
            className={day === selectedDay ? "selected" : ""}
            onClick={() => setSelectedDay(day)}
          >
            {day}
          </button>
        ))}
      </div>
      <p>요일별로 나만의 루틴을 작성해보세요!</p>
      <div className="routine-content">
        <label>루틴</label>
        <textarea
          rows="4"
          value={routine}
          onChange={(e) => setRoutine(e.target.value)}
          placeholder="루틴을 입력하세요..."
        ></textarea>
      </div>
      <button className="save-button">루틴 설정</button>
    </div>
  );
};

export default RoutineSetting;
