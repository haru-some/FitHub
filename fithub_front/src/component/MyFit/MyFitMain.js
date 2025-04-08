import {
  Link,
  NavLink,
  Route,
  Routes,
  useNavigate,
  useParams,
} from "react-router-dom";
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
import Follow from "./Follow";
import Swal from "sweetalert2";
import ChatMain from "./ChatMain";
import DmList from "./DmList";

const MyFitMain = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [pageTitle, setPageTitle] = useState(
    params["*"].includes("fit")
      ? "My Fit"
      : params["*"].includes("routine")
      ? "나의 루틴"
      : params["*"].includes("activity")
      ? "내 활동"
      : "운동기록"
  );
  const [member, setMember] = useRecoilState(memberState);
  const [record, setRecord] = useState(null);
  const [routine, setRoutine] = useState(null);
  const today = dayjs();

  const path = params["*"]; // activity/:memberNo" or "follow/:memberNo/:type

  const isActivity = path.startsWith("activity");
  const isFollow = path.startsWith("follow");

  let flag = true; // 기본은 보이게

  if (isActivity || isFollow) {
    const pathMemberNo = Number(path.split("/")[1]); // 두 경우 다 두 번째가 memberNo
    flag = pathMemberNo === member?.memberNo;
  }

  const [date, setDate] = useState(() => {
    const savedDate = localStorage.getItem("selectedDate");
    return savedDate ? dayjs(savedDate) : dayjs();
  });

  const [isUpdate, setIsUpdate] = useState(0);

  const y = String(date.$y);
  const m = String(date.$M + 1).padStart(2, "0");
  const d = String(date.$D).padStart(2, "0");
  const dateData = y + "-" + m + "-" + d;
  const inputDate = dayjs(date.$y + "-" + (date.$M + 1) + "-" + date.$D);
  const weekday = date.format("dddd").charAt(0);
  const [title, setTitle] = useState(weekday + "요일 루틴");
  const dateFormat =
    date.$y + "-" + (date.$M + 1) + "-" + date.$D + "-" + weekday;

  useEffect(() => {
    if (!member) return;
    if (inputDate.isBefore(today, "day")) {
      setTitle("운동기록");
      //과거이면 기록 조회
      axios
        .get(
          `${process.env.REACT_APP_BACK_SERVER}/myfit/record/${member.memberNo}?recordDate=${dateData}`
        )
        .then((res) => {
          setRecord(res.data);
        })
        .catch((err) => {});
    } else {
      if (inputDate.isSame(today, "day")) {
        axios
          .get(
            `${process.env.REACT_APP_BACK_SERVER}/myfit/record/${member.memberNo}?recordDate=${dateData}`
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
          `${process.env.REACT_APP_BACK_SERVER}/myfit/routine/${member.memberNo}?routineDay=${weekday}`
        )
        .then((res) => {
          setRoutine(res.data);
        })
        .catch((err) => {});
    }
  }, [date, isUpdate]);

  useEffect(() => {
    const path = params["*"];

    if (path.startsWith("fit")) {
      setPageTitle("My Fit");
    } else if (path.startsWith("routine")) {
      setPageTitle("나의 루틴");
    } else if (path.startsWith("activity")) {
      setPageTitle("활동 로그");
    } else if (path.startsWith("record")) {
      setPageTitle("운동 기록");
    } else if (path.startsWith("follow")) {
      const type = path.split("/")[2]; // follow/:memberNo/:type
      if (type === "1") {
        setPageTitle("팔로워");
      } else if (type === "2") {
        setPageTitle("팔로잉");
      } else {
        setPageTitle("팔로우");
      }
    } else {
      setPageTitle("페이지");
    }
  }, [params]);

  useEffect(() => {
    if (!member) {
      Swal.fire({
        title: "로그인 필요",
        text: "로그인 후 이용하세요",
        icon: "warning",
        confirmButtonColor: "#589c5f",
        confirmButtonText: "로그인",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login");
        }
      });
    }
  }, [member]);

  const [list, setList] = useState([]);

  if (!member) return null;
  return (
    <div className="myfit-wrap">
      <h1>{pageTitle}</h1>
      <div className="myfit-content">
        <Sidebar memberNo={member.memberNo} flag={flag} />
        <div className="myfit-content-box">
          <Routes>
            <Route
              path="fit"
              element={
                <MyFit
                  date={date}
                  setDate={setDate}
                  memberNo={member.memberNo}
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
              element={
                <ExerciseLog
                  dateFormat={dateFormat}
                  memberNo={member.memberNo}
                  dateData={dateData}
                  isUpdate={isUpdate}
                  setIsUpdate={setIsUpdate}
                />
              }
            />
            <Route
              path="routine"
              element={
                <RoutineSetting
                  memberNo={member.memberNo}
                  date={date}
                  routine={routine}
                  setRoutine={setRoutine}
                  isUpdate={isUpdate}
                  setIsUpdate={setIsUpdate}
                />
              }
            />
            <Route path="activity/:memberNo" element={<ProfileCard />} />
            <Route path="follow/:memberNo/:type" element={<Follow />} />
            <Route path="chat/:senderNo/:receiverNo" element={<ChatMain />} />
            <Route path="dm/:memberNo" element={<DmList />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

const Sidebar = (props) => {
  const memberNo = props.memberNo;
  const flag = props.flag;
  return (
    <div className={flag ? "sidebar" : "sidebar hidden"}>
      <div className="sidebar-box">
        <NavLink
          to="/myfit/fit"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          My Fit
        </NavLink>
        <NavLink
          to="/myfit/routine"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          나의 루틴
        </NavLink>
        <NavLink
          to={`/myfit/activity/${memberNo}`}
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          내 활동
        </NavLink>
        <NavLink
          to={`/myfit/dm/${memberNo}`}
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          DM List
        </NavLink>
      </div>
    </div>
  );
};

export default MyFitMain;
