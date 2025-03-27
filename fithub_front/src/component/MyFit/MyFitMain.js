import { Link, NavLink, Route, Routes } from "react-router-dom";
import "./myfit.css";
import MyFit from "./MyFit";
import ExerciseLog from "./ExerciseLog";
import RoutineSetting from "./RoutineSetting";
import ProfileCard from "./ProfileCard ";
import { useRef, useState } from "react";
import { selectClasses } from "@mui/material";
import dayjs from "dayjs";
import "dayjs/locale/ko"; // 한글 locale 추가

const MyFitMain = () => {
  const [date, setDate] = useState(dayjs());
  const [pageTitle, setPageTitle] = useState("My Fit");
  return (
    <div className="myfit-wrap">
      <h1>{pageTitle}</h1>
      <div className="myfit-content">
        <Sidebar setPageTitle={setPageTitle} />
        <div className="myfit-content-box">
          <Routes>
            <Route path="fit" element={<MyFit date={date} setDate={setDate} />} />
            <Route path="record" element={<ExerciseLog />} />
            <Route path="routine" element={<RoutineSetting date={date} />} />
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
