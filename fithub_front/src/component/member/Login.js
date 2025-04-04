import axios from "axios";
import { useEffect, useState } from "react";
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
  const [member, setMember] = useState({ memberId: "", memberPw: "" });
  const [memberInfo, setMemberInfo] = useRecoilState(memberState);
  const [showPassword, setShowPassword] = useState(false);
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const navigate = useNavigate();

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const changeMember = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setMember({ ...member, [name]: value });
  };

  const login = () => {
    if (!member.memberId || !member.memberPw) {
      Swal.fire({
        title: "로그인 실패",
        text: "아이디 또는 비밀번호를 입력하세요.",
        icon: "info",
        confirmButtonText: "확인",
        confirmButtonColor: "#2b3a2e",
      });
      return;
    }
    axios
      .post(`${backServer}/member/login`, member)
      .then((res) => {
        setMemberInfo(res.data);
        axios.defaults.headers.common["Authorization"] = res.data.accessToken;
        window.localStorage.setItem("refreshToken", res.data.refreshToken);
        navigate("/");
      })
      .catch(() => {
        Swal.fire({
          title: "로그인 실패",
          text: "아이디 또는 비밀번호를 확인하세요.",
          icon: "warning",
          confirmButtonText: "확인",
          confirmButtonColor: "#2b3a2e",
        });
      });
  };

  const googleLogin = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      const accessToken = tokenResponse.access_token;

      // 백엔드에 access_token 전송
      axios
        .post(`${backServer}/oauth/google`, { access_token: accessToken })
        .then((res) => {
          setMemberInfo(res.data);
          axios.defaults.headers.common["Authorization"] = res.data.accessToken;
          window.localStorage.setItem("refreshToken", res.data.refreshToken);
          navigate("/");
        })
        .catch(() => {
          Swal.fire({
            title: "로그인 실패",
            text: "구글 로그인 처리 중 문제가 발생했습니다.",
            icon: "error",
          });
        });
    },
    onError: () => {
      Swal.fire({
        title: "로그인 실패",
        text: "구글 로그인 중 문제가 발생했습니다.",
        icon: "error",
      });
    },
    scope: "profile email", // 필요한 경우 openid 등도 추가 가능
  });

  const kakaoLogin = () => {
    if (!window.Kakao || !window.Kakao.Auth) {
      console.error("❌ Kakao SDK가 로드되지 않았거나 초기화되지 않았습니다.");
      return;
    }
    if (!window.Kakao.isInitialized()) {
      window.Kakao.init(process.env.REACT_APP_KAKAO_API_KEY);
    }
    window.Kakao.Auth.login({
      scope: "profile_nickname, account_email",
      success: function (authObj) {
        const accessToken = authObj.access_token;

        axios
          .post(`${backServer}/oauth/kakao`, { access_token: accessToken })
          .then((res) => {
            setMemberInfo(res.data);
            axios.defaults.headers.common["Authorization"] =
              res.data.accessToken;
            window.localStorage.setItem("refreshToken", res.data.refreshToken);
            navigate("/");
          })
          .catch(() => {
            Swal.fire({
              title: "로그인 실패",
              text: "카카오 로그인 처리 중 문제가 발생했습니다.",
              icon: "error",
              confirmButtonColor: "#2f3e2f",
            });
          });
      },
      fail: function (err) {
        console.error(err);
        Swal.fire({
          title: "로그인 실패",
          text: "카카오 로그인 중 문제가 발생했습니다.",
          icon: "error",
          confirmButtonColor: "#2f3e2f",
        });
      },
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
              variant="outlined"
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
              variant="outlined"
              value={member.memberPw}
              onChange={changeMember}
              sx={{
                "& label": {
                  backgroundColor: "white",
                  px: "4px",
                },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={toggleShowPassword}
                      edge="end"
                      aria-label="비밀번호 보기 토글"
                    >
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
