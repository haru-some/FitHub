import { Link, useNavigate } from "react-router-dom";
import "./default.css";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  memberState,
  isLoginState,
  alarmWsState,
  refreshState,
  logoutState,
} from "../utils/RecoilData";
import axios from "axios";
import LogoutIcon from "@mui/icons-material/Logout";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import SettingsIcon from "@mui/icons-material/Settings";
import { useEffect, useState } from "react";
import MarkUnreadChatAltIcon from "@mui/icons-material/MarkUnreadChatAlt";
import ChatIcon from "@mui/icons-material/Chat";
import Swal from "sweetalert2";

const Header = () => {
  const [chatAlarm, setChatAlarm] = useState(0);
  const [refresh, setRefresh] = useRecoilState(refreshState);
  const [alarmWs, setAlarmWs] = useRecoilState(alarmWsState);
  const socketServer = process.env.REACT_APP_BACK_SERVER.replace(
    "http://",
    "ws://"
  );
  const loginMember = useRecoilValue(memberState);
  const navigate = useNavigate();
  const setMemberInfo = useSetRecoilState(memberState);

  const logOut = () => {
    if (loginMember?.loginType === "kakao") {
      const kakaoClientId = process.env.REACT_APP_KAKAO_API_KEY;
      const redirectUri = `${window.location.origin}/logout/callback`;
      window.location.href = `https://kauth.kakao.com/oauth/logout?client_id=${kakaoClientId}&logout_redirect_uri=${redirectUri}`;
      return;
    }

    if (loginMember?.loginType === "google") {
      const redirectUri = `${window.location.origin}/logout/callback`;
      const logoutUrl = `https://accounts.google.com/Logout?continue=https://appengine.google.com/_ah/logout?continue=${redirectUri}`;
      window.location.href = logoutUrl;
      return;
    }

    setMemberInfo(null);
    delete axios.defaults.headers.common["Authorization"];
    window.localStorage.removeItem("refreshToken");
    navigate("/");
  };

  useEffect(() => {
    if (loginMember) {
      const socket = new WebSocket(
        `${socketServer}/alarm?memberNo=${loginMember.memberNo}`
      );
      setAlarmWs(socket);
    } else {
      if (alarmWs) {
        alarmWs.close();
        setAlarmWs(null);
      }
    }
  }, [loginMember]);

  useEffect(() => {
    if (alarmWs) {
      alarmWs.onopen = () => {};
      alarmWs.onmessage = (receiveData) => {
        const data = JSON.parse(receiveData.data);
        const readYetCount = data.readYetCount;
        const refreshString = data.refreshRequest;
        setChatAlarm(readYetCount);
        if (refreshString === "refresh") {
          setRefresh((prev) => prev + 1);
        }
      };
      alarmWs.onclose = () => {};
    }
  }, [alarmWs]);

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
        <HeaderLink chatAlarm={chatAlarm} logOut={logOut} />
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
          <Link to="/shop/list">Market</Link>
        </li>
      </ul>
    </nav>
  );
};

const HeaderLink = ({ chatAlarm, logOut }) => {
  const [logoutST, setLogoutST] = useRecoilState(logoutState);
  const [memberInfo, setMemberInfo] = useRecoilState(memberState);
  const isLogin = useRecoilValue(isLoginState);
  const navigate = useNavigate();

  useEffect(() => {
    if (memberInfo?.warningLevel === 3) {
      setLogoutST(true);
      logOut();
      Swal.fire("블랙당한 시끼", "어딜 오려고 다시 돌아가", "warning");
    }
  }, [memberInfo]);

  return (
    <ul className="member-menu">
      {isLogin ? (
        <>
          <li className="chat-icon-wrap">
            <Link to={`/myfit/dm/${memberInfo.memberNo}`}>
              {chatAlarm > 0 ? (
                <MarkUnreadChatAltIcon style={{ color: "#589c5f" }} />
              ) : (
                <ChatIcon />
              )}
            </Link>
            {chatAlarm > 0 && (
              <div className="unread-count">
                <span>{chatAlarm}</span>
              </div>
            )}
          </li>
          <li>
            <Link to="/mypage" className="member-name">
              {memberInfo?.memberId}
            </Link>
          </li>
          <li>
            {memberInfo?.memberLevel === 1 ? (
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
            <button
              onClick={() => {
                setLogoutST(true);
                logOut();
              }}
              className="logout-btn"
            >
              <LogoutIcon />
            </button>
          </li>
        </>
      ) : (
        <>
          <li>
            <Link to="/login">로그인</Link>
          </li>
          <li>
            <Link to="/jointerms" className="signup">
              회원가입
            </Link>
          </li>
        </>
      )}
    </ul>
  );
};

export default Header;
