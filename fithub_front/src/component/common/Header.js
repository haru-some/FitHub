import { Link } from "react-router-dom";
import "./default.css";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  isLoginState,
  loginIdState,
  memberTypeState,
} from "../utils/RecoilData";
import axios from "axios";

const Header = () => {
  return (
    <header className="header">
      <div className="header-inner">
        <div className="header-logo">
          <img
            src="/image/Fithub_logo.png"
            alt="FitHub Logo"
            className="logo-img"
          />
          <Link to="/" className="header-logo-text">
            FitHub
          </Link>
        </div>
        <MainNavi />
        <HeaderLink />
      </div>
    </header>
  );
};

const MainNavi = () => {
  return (
    <nav className="nav">
      <ul>
        <li>
          <Link to="/">Main</Link>
        </li>
        <li>
          <Link to="/myfit">My Fit</Link>
        </li>
        <li>
          <Link to="/community">Community</Link>
        </li>
        <li>
          <Link to="/market">Market</Link>
        </li>
      </ul>
    </nav>
  );
};

const HeaderLink = () => {
  const [memberId, setMemberId] = useRecoilState(loginIdState);
  const [memberType, setMemberType] = useRecoilState(memberTypeState);
  const isLogin = useRecoilValue(isLoginState);
  const logOut = () => {
    setMemberId("");
    setMemberType(0);
    delete axios.defaults.headers.common["Authorization"];
    window.localStorage.removeItem("refreshToken");
  };
  return (
    <ul className="user-menu">
      {isLogin ? (
        <>
          <li>
            <Link to="/member">{memberId}</Link>
          </li>
          <li>
            <Link to="/" onClick={logOut}>
              로그아웃
            </Link>
          </li>
        </>
      ) : (
        <>
          <li>
            <Link to="/login">로그인</Link>
          </li>
          <li>
            <Link to="/join" className="signup">
              회원가입
            </Link>
          </li>
        </>
      )}
    </ul>
  );
};

export default Header;
