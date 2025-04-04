import { Link, Route, Routes } from "react-router-dom";
import Footer from "./component/common/Footer";
import Header from "./component/common/Header";
import Main from "./component/common/Main";
import MyFitMain from "./component/MyFit/MyFitMain";
import axios from "axios";
import { useRecoilState, useRecoilValue } from "recoil";
import { loginIdState, memberState } from "./component/utils/RecoilData";
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
import ShopCart from "./component/shop/ShopCart";
import MemberChat from "./component/common/MemberChat";
import { GoogleOAuthProvider } from "@react-oauth/google";
import LogoutCallback from "./component/common/LogoutCallback";

function App() {
  const loginMember = useRecoilValue(memberState);
  const [memberInfo, setMemberInfo] = useRecoilState(memberState);
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const socketServer = backServer.replace("http://", "ws://"); //ws://192.168.10.3:8888
  useEffect(() => {
    refreshLogin();
    window.setInterval(refreshLogin, 60 * 50 * 1000);
  }, []);
  const refreshLogin = () => {
    const refreshToken = window.localStorage.getItem("refreshToken");
    if (refreshToken !== null) {
      axios.defaults.headers.common["Authorization"] = refreshToken;
      axios
        .get(`${backServer}/member/refresh`)
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
    if (loginMember) {
    }
  }, []);
  useEffect(() => {
    if (window.Kakao && !window.Kakao.isInitialized()) {
      window.Kakao.init(process.env.REACT_APP_KAKAO_API_KEY);
    }
  }, []);

  return (
    <div className="wrap">
      <Header />
      <main className="content">
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout/callback" element={<LogoutCallback />} />
          <Route path="/jointerms" element={<JoinTerms />} />
          <Route path="/join" element={<MemberJoin />} />
          <Route path="/find" element={<FindInfo />} />
          <Route path="/mypage" element={<MemberMain />} />
          <Route path="/community/*" element={<CommunityMain />} />
          <Route path="/myfit/*" element={<MyFitMain />} />
          <Route path="/admin/*" element={<AdminMain />} />
          <Route path="/shop/*" element={<ShopList />} />
          <Route path="/shop/detail/:goodsNo" element={<ShopDetail />} />
          <Route path="/cart" element={<ShopCart />} />
          <Route path="/chat" element={<MemberChat />} />
        </Routes>
      </main>
      <TopButton />
      <Footer />
    </div>
  );
}

export default App;
