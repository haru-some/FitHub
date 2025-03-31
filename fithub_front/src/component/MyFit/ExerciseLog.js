import { useEffect, useState } from "react";
import "./exerciseLog.css";
import axios from "axios";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import { useNavigate } from "react-router-dom";
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
  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_BACK_SERVER}/myfit/record/${memberNo}?recordDate=${dateData}`
      )
      .then((res) => {
        console.log(res.data);
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
          <label>시작 시각</label>

          <input
            type="time"
            value={startTime}
            onChange={(e) => {
              setStartTime(e.target.value);
            }}
          />
        </div>
        <span>~</span>
        <div>
          <label>완료 시각</label>

          <input
            type="time"
            value={endTime}
            onChange={(e) => {
              setEndTime(e.target.value);
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
          placeholder="루틴을 입력하세요..."
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
          console.log(obj);
          axios
            .put(
              `${process.env.REACT_APP_BACK_SERVER}/myfit/record/${memberNo}`,
              obj
            )
            .then((res) => {
              console.log(res.data);
              setIsUpdate(isUpdate + 1);
              navigate("/myfit/fit");
            })
            .catch((err) => {});
        }}
      >
        기록하기
      </button>
    </div>
  );
};

export default ExerciseLog;
