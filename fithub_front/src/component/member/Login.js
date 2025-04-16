import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import Swal from "sweetalert2";
import { memberState } from "../utils/RecoilData";
import "./member.css";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import { useGoogleLogin } from "@react-oauth/google";

const Login = () => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const navigate = useNavigate();
  const [member, setMember] = useState({ memberId: "", memberPw: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [memberInfo, setMemberInfo] = useRecoilState(memberState);

  const toggleShowPassword = () => setShowPassword((prev) => !prev);

  const changeMember = (e) => {
    const { name, value } = e.target;
    setMember((prev) => ({ ...prev, [name]: value }));
  };

  const login = () => {
    if (!member.memberId || !member.memberPw) {
      Swal.fire("로그인 실패", "아이디 또는 비밀번호를 입력하세요.", "info");
      return;
    }
    axios
      .post(`${backServer}/member/auth/login`, member)
      .then((res) => {
        if (res.data.warningLevel === 3) {
          Swal.fire(
            "로그인 제한",
            "블랙회원으로 로그인이 제한됩니다. 관리자에게 문의하세요.",
            "error"
          );
          return;
        }
        localStorage.removeItem("joinStage");
        setMemberInfo(res.data);
        axios.defaults.headers.common["Authorization"] = res.data.accessToken;
        localStorage.setItem("refreshToken", res.data.refreshToken);
        navigate("/");
      })
      .catch(() => {
        Swal.fire(
          "로그인 실패",
          "아이디 또는 비밀번호를 확인하세요.",
          "warning"
        );
      });
  };

  const handleSocialLogin = (provider, accessToken) => {
    axios
      .post(`${backServer}/oauth/${provider}`, { access_token: accessToken })
      .then((res) => {
        if (res.data.isNew) {
          localStorage.setItem("joinStage", "waiting");
          localStorage.setItem("joinOauthId", res.data.oauthId);
          localStorage.setItem("joinLoginType", res.data.loginType);
          localStorage.setItem("joinEmail", res.data.email);
          localStorage.setItem("joinName", res.data.name);
          navigate("/social-join");
        } else {
          setMemberInfo(res.data);
          axios.defaults.headers.common["Authorization"] = res.data.accessToken;
          localStorage.setItem("refreshToken", res.data.refreshToken);
          navigate("/");
        }
      })
      .catch(() => {
        Swal.fire(
          "로그인 실패",
          `${provider} 로그인 처리 중 문제가 발생했습니다.`,
          "error"
        );
      });
  };

  const googleLogin = useGoogleLogin({
    onSuccess: (res) => handleSocialLogin("google", res.access_token),
    onError: () =>
      Swal.fire("로그인 실패", "구글 로그인 중 문제가 발생했습니다.", "error"),
    scope: "profile email",
    prompt: "login",
  });
  const kakaoLogin = () => {
    if (!window.Kakao?.Auth) return;
    if (!window.Kakao.isInitialized()) {
      window.Kakao.init(process.env.REACT_APP_KAKAO_API_KEY);
    }
    window.Kakao.Auth.login({
      scope: "profile_nickname, account_email",
      success: ({ access_token }) => handleSocialLogin("kakao", access_token),
      fail: () =>
        Swal.fire(
          "로그인 실패",
          "카카오 로그인 중 문제가 발생했습니다.",
          "error"
        ),
    });
  };
  return (
    <section className="member-wrap">
      <div className="member-left" />
      <div className="member-right">
        <h4 className="member-welcome">WELCOME BACK 👋🏻</h4>
        <h2 className="member-title">로그인</h2>
        <p className="member-sub">
          처음이신가요?{" "}
          <Link to="/jointerms">
            <strong>지금 바로 시작해보세요 - 무료입니다!</strong>
          </Link>
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            login();
          }}
        >
          <Box className="member-input-wrap" sx={{ width: "100%" }}>
            <TextField
              fullWidth
              id="memberId"
              name="memberId"
              label="아이디"
              value={member.memberId}
              onChange={changeMember}
            />
          </Box>
          <Box className="member-input-wrap" sx={{ width: "100%" }}>
            <TextField
              fullWidth
              id="memberPw"
              name="memberPw"
              label="비밀번호"
              type={showPassword ? "text" : "password"}
              value={member.memberPw}
              onChange={changeMember}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={toggleShowPassword} edge="end">
                      {showPassword ? (
                        <VisibilityIcon />
                      ) : (
                        <VisibilityOffIcon />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <button type="submit" className="btn-primary lg full">
            로그인
          </button>

          <div className="member-link-box">
            <Link to="/jointerms">회원가입</Link>
            <span> | </span>
            <Link to="/find">아이디</Link>
            <span>/</span>
            <Link to="/find">비밀번호 찾기</Link>
          </div>

          <div className="login-divider-wrap">
            <hr className="divider" />
            <span className="divider-text">간편 로그인</span>
            <hr className="divider" />
          </div>

          <button
            type="button"
            className="social-login-btn"
            onClick={googleLogin}
          >
            <img src="/image/google_login.png" alt="Google 로그인" />
          </button>
          <button
            type="button"
            className="social-login-btn"
            onClick={kakaoLogin}
          >
            <img src="/image/kakao_login.png" alt="Kakao 로그인" />
          </button>
        </form>
      </div>
    </section>
  );
};

export default Login;
