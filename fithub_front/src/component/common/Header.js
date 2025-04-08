import { Link, useNavigate } from "react-router-dom";
import "./default.css";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  memberState,
  isLoginState,
  alarmWsState,
  refreshState,
} from "../utils/RecoilData";
import axios from "axios";
import LogoutIcon from "@mui/icons-material/Logout";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import SettingsIcon from "@mui/icons-material/Settings";
import { useEffect, useState } from "react";
import MarkUnreadChatAltIcon from "@mui/icons-material/MarkUnreadChatAlt";
import ChatIcon from "@mui/icons-material/Chat";

const Header = () => {
  const [chatAlarm, setChatAlarm] = useState("N"); // 기본값 'N'
  const [refresh, setRefresh] = useRecoilState(refreshState);
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const [alarmWs, setAlarmWs] = useRecoilState(alarmWsState);
  const socketServer = backServer.replace("http://", "ws://"); //ws://192.168.10.3:8888
  const loginMember = useRecoilValue(memberState);
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
      alarmWs.onopen = start;
      alarmWs.onmessage = receive;
      alarmWs.onclose = end;
    }
  }, [alarmWs]);

  const start = () => {
    console.log("알람소켓 오픈");
  };
  const receive = (receiveData) => {
    const data = JSON.parse(receiveData.data);
    console.log("안읽은 메시지: " + data.readYetCount);
    console.log("알람소켓 데이터 받음");
    const readYetCount = data.readYetCount;
    const refresh = data.refreshRequest;
    console.log(refresh);
    if (readYetCount > 0) {
      setChatAlarm("Y");
    } else {
      setChatAlarm("N");
    }

    if (refresh === "refresh") {
      setRefresh(!refresh);
    }
  };
  const end = () => {
    console.log("알람소켓 닫힘");
  };

  // useEffect(() => {
  //   alarmWs.onmessage = receive;
  // }, [chatAlarm, refresh]);

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
        <HeaderLink chatAlarm={chatAlarm} />
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

const HeaderLink = (props) => {
  const [memberInfo, setMemberInfo] = useRecoilState(memberState);
  const isLogin = useRecoilValue(isLoginState);
  const navigate = useNavigate();
  const chatAlarm = props.chatAlarm;

  const logOut = () => {
    if (memberInfo?.loginType === "kakao") {
      const kakaoClientId = process.env.REACT_APP_KAKAO_API_KEY;
      const redirectUri = `${window.location.origin}/logout/callback`;
      window.location.href = `https://kauth.kakao.com/oauth/logout?client_id=${kakaoClientId}&logout_redirect_uri=${redirectUri}`;
      return;
    }
    if (memberInfo?.loginType === "google") {
      const redirectUri = `${window.location.origin}/logout/callback`;
      const logoutUrl = `https://accounts.google.com/Logout?continue=https://appengine.google.com/_ah/logout?continue=${redirectUri}`;
      window.location.href = logoutUrl;
      return;
    }
    setMemberInfo(null);
    delete axios.defaults.headers.common["Authorization"];
    window.localStorage.removeItem("refreshToken");
    navigate("/login");
  };

  return (
    <ul className="member-menu">
      {isLogin ? (
        <>
          <li>
            <Link to={`/myfit/dm/${memberInfo.memberNo}`}>
              {chatAlarm === "Y" ? (
                <MarkUnreadChatAltIcon style={{ color: "#589c5f" }} />
              ) : (
                <ChatIcon />
              )}
            </Link>
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
            <button onClick={logOut} className="logout-btn">
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
