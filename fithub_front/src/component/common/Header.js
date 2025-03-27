import { Link } from "react-router-dom";
import "./default.css";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  isLoginState,
  loginIdState,
  memberTypeState,
} from "../utils/RecoilData";
import axios from "axios";
import LogoutIcon from "@mui/icons-material/Logout";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import SettingsIcon from "@mui/icons-material/Settings";

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
            fitHub
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
          <Link to="/myfit/fit">My Fit</Link>
        </li>
        <li>
          <Link to="/community/list">Community</Link>
        </li>
        <li>
          <Link to="/shop">Market</Link>
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
    <ul className="member-menu">
      {isLogin ? (
        <>
          <li>
            <Link
              to={memberType === 1 ? "/admin" : "/member"}
              className="member-name"
            >
              {memberId}
            </Link>
          </li>
          <li>
            {memberType === 1 ? (
              <Link to="/admin/today">
                <SettingsIcon />
              </Link>
            ) : (
              <Link to="/cart">
                <ShoppingCartIcon />
              </Link>
            )}
          </li>
          <li>
            <Link to="/" onClick={logOut}>
              <LogoutIcon />
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
