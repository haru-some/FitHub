import { useEffect, useState } from "react";
import "./exerciseLog.css";
import axios from "axios";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
const ExerciseLog = (props) => {
  const memberNo = props.memberNo;
  const dateFormat = props.dateFormat;
  const date = dateFormat.split("-");

  const dateData = props.dateData;
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [text, setText] = useState("");
  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_BACK_SERVER}/myfit/record/${memberNo}?recordDate=${dateData}`
      )
      .then((res) => {
        console.log(res.data);
        setStartTime(res.data.recordStartTime);
        setEndTime(res.data.recordEndTime);
        setText(res.data ? res.data.recordContent : "");
      })
      .catch((err) => {});
  }, []);
  console.log(text);
  return (
    <div className="record-wrap">
      <h2>{`${date[0]}년 ${date[1]}월 ${date[2]}일 (${date[3]})`}</h2>
      <div className="time-inputs">
        <div>
          <label>시작 시각</label>
          {startTime && (
            <input
              type="time"
              value={startTime}
              onChange={(e) => {
                console.log(e.target.value);
                setStartTime(e.target.value);
              }}
            />
          )}
        </div>
        <span>~</span>
        <div>
          <label>완료 시각</label>
          {endTime && <input type="time" value={endTime} />}
        </div>
      </div>
      <div className="exercise-content">
        <label>운동 내용</label>
        <ReactQuill
          className="quill"
          theme="snow"
          placeholder="루틴을 입력하세요..."
          value={text}
          onChange={(value) => {
            setText(value);
          }}
        />
      </div>
      <button className="submit-button">기록하기</button>
    </div>
  );
};

export default ExerciseLog;
