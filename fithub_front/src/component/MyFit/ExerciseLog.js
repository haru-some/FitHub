import "./exerciseLog.css";
const ExerciseLog = () => {
  return (
    <div className="record-wrap">
      <h2>2025년 03월 14일</h2>
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
