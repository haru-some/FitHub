import { Link, useNavigate } from "react-router-dom";
import "./default.css";
import { useRecoilState, useRecoilValue } from "recoil";
import { memberState, isLoginState } from "../utils/RecoilData";
import axios from "axios";
import LogoutIcon from "@mui/icons-material/Logout";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import SettingsIcon from "@mui/icons-material/Settings";
import { useEffect, useState } from "react";
import MarkUnreadChatAltIcon from "@mui/icons-material/MarkUnreadChatAlt";
import SmsIcon from "@mui/icons-material/Sms";

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
          <Link to="/shop/list">Market</Link>
        </li>
      </ul>
    </nav>
  );
};

const HeaderLink = () => {
  const [memberInfo, setMemberInfo] = useRecoilState(memberState);
  const isLogin = useRecoilValue(isLoginState);
  const navigate = useNavigate();
  const [chatAlarm, setChatAlarm] = useState("N"); // 기본값 'N'

  // useEffect(() => {
  //   if (isLogin) {
  //     const fetchChatAlarm = async () => {
  //       try {
  //         const response = await axios.get(
  //           `/api/chat/alarm/${memberInfo.memberId}`
  //         );
  //         setChatAlarm(response.data.messageAlarm); // "Y" 또는 "N"
  //       } catch (error) {
  //         console.error("채팅 알람 정보를 불러오는데 실패했습니다.", error);
  //       }
  //     };

  //     fetchChatAlarm();

  //     // WebSocket 연결
  //     const socket = new WebSocket("ws://localhost:8080/ws/chat");

  //     socket.onmessage = (event) => {
  //       const data = JSON.parse(event.data);
  //       if (data.type === "message") {
  //         setChatAlarm("Y"); // 새 메시지가 오면 'Y'로 변경
  //       }
  //     };

  //     return () => socket.close();
  //   }
  // }, [isLogin, memberInfo]);

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
            <Link to="/chat">
              {chatAlarm === "Y" ? (
                <MarkUnreadChatAltIcon style={{ color: "#589c5f" }} />
              ) : (
                <SmsIcon />
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
            <Link to="/">
              <LogoutIcon onClick={logOut} />
            </Link>
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
