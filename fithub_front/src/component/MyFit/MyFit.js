import { useEffect, useState } from "react";
import BasicDateCalendar from "./calendar";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import "dayjs/locale/ko"; // 한글 locale 추가
import axios from "axios";
dayjs.locale("ko");
const MyFit = (props) => {
  const setPageTitle = props.setPageTitle;
  const date = props.date;
  const setDate = props.setDate;
  const memberNo = props.memberNo;
  const setMemberNo = props.setMemberNo;
  const record = props.record;
  const setRecord = props.setRecord;
  const routine = props.routine;
  const setRoutine = props.setRoutine;
  const today = props.today;
  const title = props.title;
  const inputDate = props.inputDate;

  const [content, setContent] = useState();

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
                  <button
                    className="edit-button"
                    onClick={() => {
                      setPageTitle("운동 기록");
                    }}
                  >
                    기록 수정
                  </button>
                </Link>
              ) : (
                <Link to="/myfit/record">
                  <button
                    className="edit-button"
                    onClick={() => {
                      setPageTitle("운동 기록");
                    }}
                  >
                    기록하기
                  </button>
                </Link>
              );
            } else if (inputDate.isSame(today, "day")) {
              return record ? (
                <Link to="/myfit/record">
                  <button
                    className="edit-button"
                    onClick={() => {
                      setPageTitle("운동 기록");
                    }}
                  >
                    기록 수정
                  </button>
                </Link>
              ) : (
                <Link to="/myfit/record">
                  <button
                    className="edit-button"
                    onClick={() => {
                      setPageTitle("운동 기록");
                    }}
                  >
                    기록하기
                  </button>
                </Link>
              );
            } else {
              // 미래
              return routine ? null : (
                <Link to="/myfit/routine">
                  <button
                    className="edit-button"
                    onClick={() => {
                      setPageTitle("나의 루틴");
                    }}
                  >
                    루틴 설정하기
                  </button>
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
