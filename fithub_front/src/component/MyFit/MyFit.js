import { useState } from "react";
import BasicDateCalendar from "./calendar";

const MyFit = () => {
  const [date, setDate] = useState(null);
  console.log(date);
  return (
    <div className="fit-wrap">
      <Calendar date={date} setDate={setDate} />
      <ExerciseRecord />
    </div>
  );
};

const Calendar = (props) => {
  const date = props.date;
  const setDate = props.setDate;

  return (
    <div className="calendar">
      <BasicDateCalendar date={date} setDate={setDate} />
    </div>
  );
};

const ExerciseRecord = () => {
  return (
    <div className="exercise-record">
      <h2>운동 기록</h2>
      <div className="exercise-record-content">
        <p>유산소</p>
        <p>러닝 5KM</p>
        <p>하체</p>
        <p>스쿼트, 렉스텐션, 레그프레스, 레그컬스탠딩</p>
      </div>

      <button className="edit-button">기록 수정</button>
    </div>
  );
};

export default MyFit;
