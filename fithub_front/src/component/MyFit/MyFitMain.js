import { Link, Route, Routes } from "react-router-dom";
import "./myfit.css";
import MyFit from "./MyFit";
import ExerciseLog from "./ExerciseLog";
import RoutineSetting from "./RoutineSetting";
import ProfileCard from "./ProfileCard ";
const MyFitMain = () => {
  return (
    <div className="myfit-wrap">
      <h1>My Fit</h1>
      <div className="myfit-content">
        <Sidebar />
        <div className="myfit-content-box">
          <Routes>
            <Route path="fit" element={<MyFit />} />
            <Route path="record" element={<ExerciseLog />} />
            <Route path="routine" element={<RoutineSetting />} />
            <Route path="activity" element={<ProfileCard />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-box">
        <Link to="/myfit/fit">My Fit</Link>
        <Link to="/myfit/routine">나의 루틴</Link>
        <Link to="/myfit/activity">내 활동</Link>
      </div>
    </div>
  );
};

export default MyFitMain;
