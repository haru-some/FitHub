import { Route, Routes, useNavigate, useParams } from "react-router-dom";
import CommunityList from "./CommunityList";
import CommunityView from "./CommunityView";
import CommunityWrite from "./CommunityWrite";
import CommunityUpdate from "./CommunityUpdate";
import { useRecoilState } from "recoil";
import { logoutState, memberState } from "../utils/RecoilData";
import Swal from "sweetalert2";
import AdBanners from "../utils/AdBanners";

const CommunityMain = () => {
  const params = useParams();
  const [logoutST, setLogoutST] = useRecoilState(logoutState);
  const [member, setMember] = useRecoilState(memberState);
  const navigate = useNavigate();
  console.log(params["*"]);
  if (logoutST) {
    navigate("/");
    setLogoutST(false);
  } else {
    if (
      !member &&
      (params["*"].startsWith("write") || params["*"].startsWith("update"))
    ) {
      Swal.fire({
        title: "로그인 필요",
        text: "로그인이 필요한 서비스입니다.",
        icon: "warning",
        confirmButtonColor: "#589c5f",
        confirmButtonText: "확인",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login");
        }
      });
    }
  }
  return (
    <div className="community-main-wrap">
      <div className="ads ads-set">
        <AdBanners adsType={"h"} />
      </div>
      <div className="community-main">
        <Routes>
          <Route path="list/*" element={<CommunityList />} />
          <Route path="view/:communityNo" element={<CommunityView />} />
          <Route path="write" element={<CommunityWrite />} />
          <Route path="update/:communityNo" element={<CommunityUpdate />} />
        </Routes>
      </div>
      <div className="ads ads-set">
        <AdBanners adsType={"h"} />
      </div>
    </div>
  );
};

export default CommunityMain;
