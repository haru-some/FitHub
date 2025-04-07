import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const SocialJoinGuard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const clearJoinStorage = () => {
    [
      "joinStage",
      "joinOauthId",
      "joinLoginType",
      "joinEmail",
      "joinName",
    ].forEach((key) => localStorage.removeItem(key));
  };

  useEffect(() => {
    const joinStage = localStorage.getItem("joinStage");
    const oauthId = localStorage.getItem("joinOauthId");
    const loginType = localStorage.getItem("joinLoginType");
    const isOnJoinPage = location.pathname.startsWith("/social-join");

    if (!oauthId || !loginType) {
      clearJoinStorage();
      return;
    }

    if (joinStage === "waiting" && !isOnJoinPage) {
      navigate("/social-join");
    }
  }, [location.pathname, navigate]);

  return null;
};

export default SocialJoinGuard;
