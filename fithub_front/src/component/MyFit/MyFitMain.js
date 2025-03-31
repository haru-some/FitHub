import { Link, NavLink, Route, Routes } from "react-router-dom";
import "./myfit.css";
import MyFit from "./MyFit";
import ExerciseLog from "./ExerciseLog";
import RoutineSetting from "./RoutineSetting";
import ProfileCard from "./ProfileCard ";
import { useEffect, useRef, useState } from "react";
import { selectClasses } from "@mui/material";
import dayjs from "dayjs";
import "dayjs/locale/ko"; // 한글 locale 추가
import axios from "axios";
import { useRecoilState } from "recoil";
import { memberState } from "../utils/RecoilData";

const MyFitMain = () => {
  const [member, setMember] = useRecoilState(memberState);
  const memberNo = member.memberNo;
  const [record, setRecord] = useState(null);
  const [routine, setRoutine] = useState(null);
  const today = dayjs();

  const [date, setDate] = useState(dayjs());
  const [pageTitle, setPageTitle] = useState("My Fit");

  const zeroDate =
    String(date.$M + 1).length === 1 ? "0" + (date.$M + 1) : date.$M + 1;

  const inputDate = dayjs(date.$y + "-" + (date.$M + 1) + "-" + date.$D);
  const weekday = date.format("dddd").charAt(0);
  const [title, setTitle] = useState(weekday + "요일 루틴");

  const dateFormat =
    date.$y + "-" + (date.$M + 1) + "-" + date.$D + "-" + weekday;

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
          setRoutine(res.data);
        })
        .catch((err) => {});
    }
  }, [date]);

  return (
    <div className="myfit-wrap">
      <h1>{pageTitle}</h1>
      <div className="myfit-content">
        <Sidebar setPageTitle={setPageTitle} />
        <div className="myfit-content-box">
          <Routes>
            <Route
              path="fit"
              element={
                <MyFit
                  date={date}
                  setDate={setDate}
                  setPageTitle={setPageTitle}
                  memberNo={memberNo}
                  record={record}
                  setRecord={setRecord}
                  routine={routine}
                  setRoutine={setRoutine}
                  today={today}
                  title={title}
                  inputDate={inputDate}
                />
              }
            />
            <Route
              path="record"
              element={<ExerciseLog dateFormat={dateFormat} />}
            />
            <Route
              path="routine"
              element={
                <RoutineSetting
                  memberNo={memberNo}
                  date={date}
                  routine={routine}
                  setRoutine={setRoutine}
                />
              }
            />
            <Route path="activity/*" element={<ProfileCard />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

const Sidebar = (props) => {
  const setPageTitle = props.setPageTitle;
  const changeTitle = (e) => {
    setPageTitle(e.target.innerText);
  };
  return (
    <div className="sidebar">
      <div className="sidebar-box">
        <NavLink
          to="/myfit/fit"
          className={({ isActive }) => (isActive ? "active" : "")}
          onClick={changeTitle}
        >
          My Fit
        </NavLink>
        <NavLink
          to="/myfit/routine"
          className={({ isActive }) => (isActive ? "active" : "")}
          onClick={changeTitle}
        >
          나의 루틴
        </NavLink>
        <NavLink
          to="/myfit/activity"
          className={({ isActive }) => (isActive ? "active" : "")}
          onClick={changeTitle}
        >
          내 활동
        </NavLink>
      </div>
    </div>
  );
};

export default MyFitMain;
