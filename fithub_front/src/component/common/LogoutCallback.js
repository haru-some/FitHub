import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { memberState } from "../utils/RecoilData";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LogoutCallback = () => {
  const [_, setMemberInfo] = useRecoilState(memberState);
  const navigate = useNavigate();

  useEffect(() => {
    setMemberInfo(null);
    delete axios.defaults.headers.common["Authorization"];
    window.localStorage.removeItem("refreshToken");
    navigate("/login", { replace: true });
  }, [setMemberInfo, navigate]);

  return null;
};

export default LogoutCallback;
