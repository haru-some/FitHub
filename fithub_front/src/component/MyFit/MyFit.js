import { useEffect, useState } from "react";
import BasicDateCalendar from "./calendar";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import "dayjs/locale/ko"; // 한글 locale 추가
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
dayjs.locale("ko");
const MyFit = (props) => {
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
  const calory = props.calory;

  const [content, setContent] = useState();

  function convertNewlinesToBr(input) {
    if (!input) return "";
    return input.replace(/(\r\n|\n|\r)/g, "<br/>");
  }

  return (
    <>
      <div className="fit-wrap">
        <Calendar date={date} setDate={setDate} />
        <div className="exercise-record">
          <h2>
            {inputDate.isSame(today, "day") && record ? "운동기록" : title}
          </h2>

          {/* 내용 출력 */}

          <div
            className="exercise-record-content"
            dangerouslySetInnerHTML={{
              __html: (() => {
                if (inputDate.isBefore(today, "day")) {
                  return record
                    ? `<div class="overflow-wrap">${record.recordContent}</div>
                    <div class="time-wrap">
                    <span class="material-icons">alarm</span>
                    <span>${Math.floor(record.recordTime)}분</span>
                    </div>`
                    : "<div>완료한 운동을 기록하세요!</div>";
                } else if (inputDate.isSame(today, "day")) {
                  return record
                    ? `<div class="overflow-wrap">${record.recordContent}</div>
                    <div class="time-wrap">
                    <span class="material-icons">alarm</span>
                    <span>${Math.floor(record.recordTime)}분</span>
                    </div>`
                    : `${
                        routine
                          ? "<div class='overflow-wrap'>" +
                            routine.routineContent +
                            "</div>"
                          : "<div>설정한 루틴이 없습니다.</div>"
                      }<div>오늘의 운동을 완료했다면 기록해보세요!</div>`;
                } else {
                  return routine
                    ? "<div class='overflow-wrap'>" +
                        routine.routineContent +
                        "</div>"
                    : "<div>루틴을 설정해보세요!</div>";
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

      {record && (
        <div className="record-ai-summary">
          <h1>AI 요약</h1>
          <div className="ai-wrap">
            {calory === "요약중..." ? (
              <CircularProgress color="success" />
            ) : (
              <div
                className="ai-summary-content"
                dangerouslySetInnerHTML={{
                  __html: convertNewlinesToBr(calory),
                }}
              ></div>
            )}
          </div>
        </div>
      )}
    </>
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
