import React, { useEffect, useState } from "react";
import "./routineSetting.css";
import axios from "axios";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import { useNavigate } from "react-router-dom";

const days = ["월", "화", "수", "목", "금", "토", "일"];

const RoutineSetting = (props) => {
  const isUpdate = props.isUpdate;
  const setIsUpdate = props.setIsUpdate;
  const [obj, setObj] = useState({
    월: "",
    화: "",
    수: "",
    목: "",
    금: "",
    토: "",
    일: "",
  });

  const date = props.date;
  const [weekday, setWeekDay] = useState(date.format("dddd").charAt(0));
  const [text, setText] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    setText(obj[weekday]);
  }, [weekday]);
  const memberNo = props.memberNo;
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACK_SERVER}/myfit/routine/${memberNo}`)
      .then((res) => {
        const newObj = {};
        days.forEach((item) => {
          newObj[item] = res.data[item] ? res.data[item].routineContent : "";
        });
        setObj(newObj);
        setText(res.data[weekday] ? res.data[weekday].routineContent : "");
      })
      .catch((err) => {});
  }, []);

  return (
    <div className="routine-wrap">
      <div className="routine-days">
        {days.map((day) => (
          <button
            key={day}
            className={day === weekday ? "selected" : ""}
            onClick={(e) => {
              setWeekDay(day);

              setObj({ ...obj, [weekday]: text });
            }}
          >
            {day}
          </button>
        ))}
      </div>
      <p>요일별로 나만의 루틴을 작성해보세요!</p>
      <div className="routine-content">
        <label>루틴</label>
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
        className="save-button"
        onClick={() => {
          const updatedObj = { ...obj, [weekday]: text };
          setObj({ ...obj, [weekday]: text });

          axios
            .put(
              `${process.env.REACT_APP_BACK_SERVER}/myfit/routine/${memberNo}`,
              updatedObj
            )
            .then((res) => {
              console.log(res.data);
              setIsUpdate(isUpdate + 1);
              navigate("/myfit/fit");
            })
            .catch((err) => {});
        }}
      >
        루틴 설정
      </button>
    </div>
  );
};

export default RoutineSetting;
