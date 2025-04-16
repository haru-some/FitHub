import {
  Link,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import Footer from "./component/common/Footer";
import Header from "./component/common/Header";
import Main from "./component/common/Main";
import MyFitMain from "./component/MyFit/MyFitMain";
import axios from "axios";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  loginIdState,
  logoutState,
  memberState,
} from "./component/utils/RecoilData";
import { useEffect } from "react";
import TopButton from "./component/utils/TopButton";
import AdminMain from "./component/Admin/AdminMain";
import ShopList from "./component/shop/ShopList";
import Login from "./component/member/Login";
import CommunityMain from "./component/community/CommunityMain";
import JoinTerms from "./component/member/JoinTerms";
import MemberJoin from "./component/member/MemberJoin";
import ShopDetail from "./component/shop/ShopDetail";
import FindInfo from "./component/member/FindInfo";
import MemberMain from "./component/member/MemberMain";
import ShopCart, { ShopCartProvider } from "./component/shop/ShopCart";
import MemberChat from "./component/common/MemberChat";
import SocialJoin from "./component/member/SocialJoin";
import ShopPay from "./component/shop/ShopPay";
import ShopReview from "./component/shop/ShopReview";
import LogoutCallback from "./component/common/LogoutCallback";
import SocialJoinGuard from "./component/member/SocialJoinGuard";
import ShopModify from "./component/shop/ShopModify";
import Swal from "sweetalert2";

function App() {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const navigate = useNavigate();
  const loginMember = useRecoilValue(memberState);
  const location = useLocation();
  const isMainPage = location.pathname === "/";

  const [memberInfo, setMemberInfo] = useRecoilState(memberState);

  useEffect(() => {
    const joinStage = localStorage.getItem("joinStage");
    if (joinStage !== "waiting") {
      refreshLogin();
      const interval = setInterval(refreshLogin, 60 * 50 * 1000);
      return () => clearInterval(interval); // 메모리 누수 방지
    }
  }, []);

  const refreshLogin = () => {
    const refreshToken = window.localStorage.getItem("refreshToken");
    if (refreshToken !== null) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${refreshToken}`;
      axios
        .get(`${backServer}/member/auth/refresh`)
        .then((res) => {
          setMemberInfo(res.data);
          axios.defaults.headers.common["Authorization"] = res.data.accessToken;
          window.localStorage.setItem("refreshToken", res.data.refreshToken);
        })
        .catch((error) => {
          console.error(error);
          setMemberInfo(null);
          delete axios.defaults.headers.common["Authorization"];
          window.localStorage.removeItem("refreshToken");
        });
    }
  };
  useEffect(() => {
    if (loginMember && window.location.pathname === "/login") {
      navigate("/");
    }
  }, [loginMember]);
  useEffect(() => {
    if (window.Kakao && !window.Kakao.isInitialized()) {
      window.Kakao.init(process.env.REACT_APP_KAKAO_API_KEY);
    }
  }, []);
  useEffect(() => {
    const joinStage = localStorage.getItem("joinStage");
    const memberStateRaw = localStorage.getItem("recoil-persist");
    const loginType = JSON.parse(memberStateRaw)?.memberState?.loginType;

    const isSocialUser = loginType === "kakao" || loginType === "google";
    const isOnJoinPage = window.location.pathname.startsWith("/social-join");

    if (joinStage === "waiting" && isSocialUser && !isOnJoinPage) {
      navigate("/social-join");
    }
  }, []);
  console.log(loginMember);
  function checkMemberLevelOnce() {
    if (loginMember !== null) {
      const member = loginMember.warningLevel;

      // 경고창을 이미 본 적 있는지 확인
      const alreadyWarned = localStorage.getItem("warningLevel2Warned");

      if (member === 2 && !alreadyWarned) {
        Swal.fire("경고", "경고 대상입니다. 조심해주세요.", "warning");

        // 경고창을 본 상태로 기록
        localStorage.setItem("warningLevel2Warned", "true");
      }
    }
  }

  // 페이지 로드 시 실행
  checkMemberLevelOnce();

  return (
    <div className={`wrap ${isMainPage ? "main-bg" : ""}`}>
      <SocialJoinGuard />
      <Header />
      <main className="content">
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout/callback" element={<LogoutCallback />} />
          <Route path="/jointerms" element={<JoinTerms />} />
          <Route path="/join" element={<MemberJoin />} />
          <Route path="/social-join" element={<SocialJoin />} />
          <Route path="/find" element={<FindInfo />} />
          <Route path="/mypage/*" element={<MemberMain />} />
          <Route path="/community/*" element={<CommunityMain />} />
          <Route path="/myfit/*" element={<MyFitMain />} />
          <Route path="/admin/*" element={<AdminMain />} />
          <Route path="/shop/*" element={<ShopList />} />
          <Route path="/shop/detail/:goodsNo" element={<ShopDetail />} />
          <Route path="/shop/modify/:goodsNo" element={<ShopModify />} />
          <Route path="/cart" element={<ShopCart />} />
          <Route path="/shop/pay/:goodsNo" element={<ShopPay />} />
          <Route path="/chat" element={<MemberChat />} />
        </Routes>
      </main>
      <TopButton />
      <Footer />
    </div>
  );
}

export default App;
