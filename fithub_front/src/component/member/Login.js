import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import Swal from "sweetalert2";
import { loginIdState, memberTypeState } from "../utils/RecoilData";
import "./member.css";

const Login = () => {
  const [memberId, setMemberId] = useRecoilState(loginIdState);
  const [memberType, setMemberType] = useRecoilState(memberTypeState);
  const [member, setMember] = useState({ memberId: "", memberPw: "" });
  const navigate = useNavigate();
  const backServer = process.env.REACT_APP_BACK_SERVER;

  const changeMember = (e) => {
    const { name, value } = e.target;
    setMember({ ...member, [name]: value });
  };

  const login = () => {
    if (!member.memberId || !member.memberPw) {
      Swal.fire({
        title: "로그인 실패",
        text: "아이디 또는 비밀번호를 입력하세요.",
        icon: "info",
        confirmButtonText: "확인",
        confirmButtonColor: "#333",
      });
      return;
    }

    axios
      .post(`${backServer}/member/login`, member)
      .then((res) => {
        setMemberId(res.data.memberId);
        setMemberType(res.data.memberType);
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
          confirmButtonColor: "#333",
        });
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
          <Link to="/join">
            <strong>지금 바로 시작해보세요 - 무료입니다!</strong>
          </Link>
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            login();
          }}
        >
          <div className="member-input-wrap">
            <label htmlFor="memberId">ID</label>
            <input
              type="text"
              id="memberId"
              name="memberId"
              value={member.memberId}
              onChange={changeMember}
            />
          </div>
          <div className="member-input-wrap">
            <label htmlFor="memberPw">PASSWORD</label>
            <input
              type="password"
              id="memberPw"
              name="memberPw"
              value={member.memberPw}
              onChange={changeMember}
            />
          </div>
          <button type="submit" className="btn-primary lg full">
            로그인
          </button>

          <div className="member-link-box">
            <Link to="/join">회원가입</Link>
            <span>|</span>
            <Link to="/findid">아이디</Link>
            <span>/</span>
            <Link to="/findpw">비밀번호 찾기</Link>
          </div>

          <hr className="divider" />
          <p className="easy-login-title">간편 로그인</p>
          <button
            type="button"
            className="login-btn-image google-login"
            aria-label="Google 로그인"
          />
          <button
            type="button"
            className="login-btn-image kakao-login"
            aria-label="Kakao 로그인"
          />
        </form>
      </div>
    </section>
  );
};

export default Login;
