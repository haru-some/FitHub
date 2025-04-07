import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const SocialJoinGuard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const joinStage = localStorage.getItem("joinStage");
    const memberRaw = localStorage.getItem("recoil-persist");
    const loginType = JSON.parse(memberRaw)?.memberState?.loginType;

    const isSocial = loginType === "kakao" || loginType === "google";
    const isOnJoinPage = location.pathname.startsWith("/social-join");

    if (joinStage === "waiting" && isSocial && !isOnJoinPage) {
      navigate("/social-join");
    }
  }, [location.pathname, navigate]);

  return null;
};

export default SocialJoinGuard;
