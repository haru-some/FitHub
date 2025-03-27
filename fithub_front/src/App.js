import { Link, Route, Routes } from "react-router-dom";
import Footer from "./component/common/Footer";
import Header from "./component/common/Header";
import Main from "./component/common/Main";
import MyFitMain from "./component/MyFit/MyFitMain";
import axios from "axios";
import { useRecoilState } from "recoil";
import { loginIdState, memberLevelState } from "./component/utils/RecoilData";
import { useEffect } from "react";
import TopButton from "./component/utils/TopButton";
import AdminMain from "./component/Admin/AdminMain";
import ShopList from "./component/shop/ShopList";
import Login from "./component/member/Login";
import CommunityMain from "./component/community/CommunityMain";
import JoinTerms from "./component/member/JoinTerms";

function App() {
  const [memberId, setMemberId] = useRecoilState(loginIdState);
  const [memberLevel, setMemberLevel] = useRecoilState(memberLevelState);
  const backServer = process.env.REACT_APP_BACK_SERVER;
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
          setMemberId(res.data.memberId);
          setMemberLevel(res.data.memberLevel);
          axios.defaults.headers.common["Authorization"] = res.data.accessToken;
          window.localStorage.setItem("refreshToken", res.data.refreshToken);
        })
        .catch((error) => {
          console.error(error);
          setMemberId("");
          setMemberLevel(0);
          delete axios.defaults.headers.common["Authorization"];
          window.localStorage.removeItem("refreshToken");
        });
    }
  };
  return (
    <div className="wrap">
      <Header />
      <main className="content">
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/login" element={<Login />} />
          <Route path="/jointerms" element={<JoinTerms />} />
          <Route path="/community/*" element={<CommunityMain />} />
          <Route path="/myfit/*" element={<MyFitMain />} />
          <Route path="/admin/*" element={<AdminMain />} />
          <Route path="shop" element={<ShopList />} />
        </Routes>
      </main>
      <TopButton />
      <Footer />
    </div>
  );
}

export default App;
