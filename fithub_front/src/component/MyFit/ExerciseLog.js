import { useEffect, useRef, useState } from "react";
import "./exerciseLog.css";
import axios from "axios";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
const ExerciseLog = (props) => {
  const isUpdate = props.isUpdate;
  const setIsUpdate = props.setIsUpdate;
  const memberNo = props.memberNo;
  const dateFormat = props.dateFormat;
  const date = dateFormat.split("-");

  const dateData = props.dateData;
  const [startTime, setStartTime] = useState("12:00");
  const [endTime, setEndTime] = useState("12:00");
  const [text, setText] = useState("");
  const [recordNo, setRecordNo] = useState(0);

  const startTimeRef = useRef(null);
  const endTimeRef = useRef(null);

  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_BACK_SERVER}/myfit/record/${memberNo}?recordDate=${dateData}`
      )
      .then((res) => {
        setStartTime(res.data ? res.data.recordStartTime : "12:00");
        setEndTime(res.data ? res.data.recordEndTime : "12:00");
        setText(res.data ? res.data.recordContent : "");
        setRecordNo(res.data ? res.data.recordNo : 0);
      })
      .catch((err) => {});
  }, []);

  const navigate = useNavigate();
  return (
    <div className="record-wrap">
      <h2>{`${date[0]}년 ${date[1]}월 ${date[2]}일 (${date[3]})`}</h2>
      <div className="time-inputs">
        <div>
          <label htmlFor="start-time">시작 시각</label>

          <input
            ref={startTimeRef}
            id="start-time"
            type="time"
            value={startTime}
            onChange={(e) => {
              setStartTime(e.target.value);
            }}
            onClick={() => {
              startTimeRef.current?.showPicker?.();
            }}
          />
        </div>
        <span>~</span>
        <div>
          <label htmlFor="end-time">완료 시각</label>

          <input
            ref={endTimeRef}
            id="end-time"
            type="time"
            value={endTime}
            onChange={(e) => {
              setEndTime(e.target.value);
            }}
            onClick={() => {
              endTimeRef.current?.showPicker?.();
            }}
          />
        </div>
      </div>
      <div className="exercise-content">
        <label>운동 내용</label>
        <ReactQuill
          className="quill"
          theme="snow"
          value={text}
          onChange={(value) => {
            setText(value);
          }}
          placeholder="기록을 입력하세요..."
        />
      </div>
      <button
        className="submit-button"
        onClick={() => {
          const obj = {
            recordContent: text,
            recordDate: dateData,
            recordStartTime: startTime,
            recordEndTime: endTime,
            recordNo: recordNo,
          };
          if (obj.recordStartTime < obj.recordEndTime) {
            axios
              .put(
                `${process.env.REACT_APP_BACK_SERVER}/myfit/record/${memberNo}`,
                obj
              )
              .then((res) => {
                setIsUpdate(isUpdate + 1);
                navigate("/myfit/fit");
              })
              .catch((err) => {});
          } else {
            Swal.fire({
              title: "시간 확인",
              text: "완료시각은 시작시각보다 이후여야 합니다.",
              icon: "warning",
              confirmButtonColor: "#589c5f",
              confirmButtonText: "확인",
            });
          }
        }}
      >
        기록하기
      </button>
    </div>
  );
};

export default ExerciseLog;
