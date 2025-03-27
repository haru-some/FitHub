import { useEffect, useState } from "react";
import BasicDateCalendar from "./calendar";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import "dayjs/locale/ko"; // 한글 locale 추가
import axios from "axios";
dayjs.locale("ko");
const MyFit = () => {
  const [date, setDate] = useState(dayjs());
  const [memberNo, setMemberNo] = useState(1);
  const [record, setRecord] = useState(null);

  const inputDate = dayjs(date.$y + "-" + (date.$M + 1) + "-" + date.$D);
  const today = dayjs();

  const weekday = date.format("dddd").charAt(0);
  console.log(weekday);

  useEffect(() => {
    if (inputDate.isBefore(today, "day")) {
      //과거이면 기록 조회
      axios
        .get(
          `${process.env.REACT_APP_BACK_SERVER}/myfit/record/${memberNo}?recordDate=${inputDate}`
        )
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {});
    } else {
      //오늘이나 미래이면 루틴 조회
      axios
        .get(
          `${process.env.REACT_APP_BACK_SERVER}/myfit/routine/${memberNo}?routineDay=${weekday}`
        )
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {});
    }
  }, [date]);

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
      <Link to="/myfit/record">
        <button className="edit-button">기록 수정</button>
      </Link>
    </div>
  );
};

export default MyFit;
