import { useEffect, useState } from "react";
import BasicDateCalendar from "./calendar";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import "dayjs/locale/ko"; // 한글 locale 추가
import axios from "axios";
dayjs.locale("ko");
const MyFit = (props) => {
  const date = props.date
  const setDate = props.setDate
  const [memberNo, setMemberNo] = useState(1);
  const [record, setRecord] = useState(null);
  const [routine, setRoutine] = useState(null);
  const zeroDate =
    String(date.$M + 1).length === 1 ? "0" + (date.$M + 1) : date.$M + 1;

  const inputDate = dayjs(date.$y + "-" + (date.$M + 1) + "-" + date.$D);
  const today = dayjs();
  const [content, setContent] = useState();
  const weekday = date.format("dddd").charAt(0);
  const [title, setTitle] = useState(weekday + "요일 루틴");

  useEffect(() => {
    if (inputDate.isBefore(today, "day")) {
      setTitle("운동기록");
      //과거이면 기록 조회
      axios
        .get(
          `${
            process.env.REACT_APP_BACK_SERVER
          }/myfit/record/${memberNo}?recordDate=${
            date.$y + "-" + zeroDate + "-" + date.$D
          }`
        )
        .then((res) => {
          console.log(res);
          setRecord(res.data);
        })
        .catch((err) => {});
    } else {
      if (inputDate.isSame(today, "day")) {
        axios
          .get(
            `${
              process.env.REACT_APP_BACK_SERVER
            }/myfit/record/${memberNo}?recordDate=${
              date.$y + "-" + zeroDate + "-" + date.$D
            }`
          )
          .then((res) => {
            console.log(res);
            setRecord(res.data);
          })
          .catch((err) => {});
      }
      setTitle(weekday + "요일 루틴");
      //오늘이나 미래이면 루틴 조회
      axios
        .get(
          `${process.env.REACT_APP_BACK_SERVER}/myfit/routine/${memberNo}?routineDay=${weekday}`
        )
        .then((res) => {
          console.log(res);
          setRoutine(res.data);
        })
        .catch((err) => {});
    }
  }, [date]);

  return (
    <div className="fit-wrap">
      <Calendar date={date} setDate={setDate} />
      <div className="exercise-record">
        <h2>{inputDate.isSame(today, "day") && record ? "운동기록" : title}</h2>

        {/* 내용 출력 */}
        <div
          className="exercise-record-content"
          dangerouslySetInnerHTML={{
            __html: (() => {
              if (inputDate.isBefore(today, "day")) {
                return record
                  ? record.recordContent
                  : "완료한 운동을 기록하세요!";
              } else if (inputDate.isSame(today, "day")) {
                return record
                  ? record.recordContent
                  : `${
                      routine ? routine.routineContent : "<h4>루틴없음</h4>"
                    }<br><br>오늘의 운동을 완료했다면 기록해보세요!`;
              } else {
                return routine ? routine.routineContent : "루틴없음";
              }
            })(),
          }}
        ></div>

        {/* 버튼 출력 */}
        <div className="button-wrap">
          {(() => {
            if (inputDate.isBefore(today, "day")) {
              return record ? (
                <Link to="/myfit/record">
                  <button className="edit-button">기록 수정</button>
                </Link>
              ) : (
                <Link to="/myfit/record">
                  <button className="edit-button">기록하기</button>
                </Link>
              );
            } else if (inputDate.isSame(today, "day")) {
              return record ? (
                <Link to="/myfit/record">
                  <button className="edit-button">기록 수정</button>
                </Link>
              ) : (
                <Link to="/myfit/record">
                  <button className="edit-button">기록하기</button>
                </Link>
              );
            } else {
              // 미래
              return routine ? null : (
                <Link to="/myfit/routine">
                  <button className="edit-button">루틴 설정하기</button>
                </Link>
              );
            }
          })()}
        </div>
      </div>
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

export default MyFit;
