import { useRef, useState, useEffect } from "react";
import "./member.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import MenuItem from "@mui/material/MenuItem";
import Slide from "@mui/material/Slide";

const MemberJoin = () => {
  const navigate = useNavigate();
  const backServer = process.env.REACT_APP_BACK_SERVER;

  const [member, setMember] = useState({
    memberId: "",
    memberPw: "",
    memberName: "",
    memberPhone: "",
    memberEmailFront: "",
    memberEmailBack: "",
    authCode: "",
  });
  const [memberPwRe, setMemberPwRe] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordRe, setShowPasswordRe] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState("gmail.com");
  const [showAuthInput, setShowAuthInput] = useState(false);
  const [authTimer, setAuthTimer] = useState(180);

  const pwMsgRef = useRef();
  const emailMsgRef = useRef();

  const toggleShowPassword = () => setShowPassword(!showPassword);
  const toggleShowPasswordRe = () => setShowPasswordRe(!showPasswordRe);

  const inputMemberData = (e) => {
    const { name, value } = e.target;
    setMember({ ...member, [name]: value });
  };
  const inputMemberPwRe = (e) => setMemberPwRe(e.target.value);

  const [idCheck, setIdCheck] = useState(0);
  const checkId = () => {
    const idReg = /^[a-zA-Z0-9]{6,12}$/;
    if (idReg.test(member.memberId)) {
      axios
        .get(`${backServer}/member/exists?memberId=${member.memberId}`)
        .then((res) => setIdCheck(res.data === 0 ? 1 : 3));
    } else {
      setIdCheck(2);
    }
  };

  const checkPw = () => {
    pwMsgRef.current.classList.remove("valid", "invalid");
    if (member.memberPw === memberPwRe) {
      pwMsgRef.current.classList.add("valid");
      pwMsgRef.current.innerText = "비밀번호가 일치합니다.";
    } else {
      pwMsgRef.current.classList.add("invalid");
      pwMsgRef.current.innerText = "비밀번호가 일치하지 않습니다.";
    }
  };

  const handleDomainChange = (e) => {
    const value = e.target.value;
    setSelectedDomain(value);
    setMember({
      ...member,
      memberEmailBack: value === "직접입력" ? "" : value,
    });
  };

  const sendAuthCode = () => {
    setShowAuthInput(true);
    setAuthTimer(180);
    console.log(
      `Sending auth code to: ${member.memberEmailFront}@${member.memberEmailBack}`
    );
  };

  useEffect(() => {
    if (showAuthInput && authTimer > 0) {
      const timer = setTimeout(() => {
        setAuthTimer(authTimer - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [showAuthInput, authTimer]);

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? "0" + sec : sec}`;
  };

  const checkAuthCode = () => {
    emailMsgRef.current.classList.remove("valid", "invalid");
    if (member.authCode === "123456") {
      emailMsgRef.current.classList.add("valid");
      emailMsgRef.current.innerText = "인증번호가 확인되었습니다.";
    } else {
      emailMsgRef.current.classList.add("invalid");
      emailMsgRef.current.innerText = "인증번호가 일치하지 않습니다.";
    }
  };

  const joinMember = () => {
    if (idCheck === 1 && pwMsgRef.current.classList.contains("valid")) {
      const email = `${member.memberEmailFront}@${member.memberEmailBack}`;
      axios
        .post(`${backServer}/member`, {
          ...member,
          memberEmail: email,
        })
        .then((res) => {
          if (res.data === 1) navigate("/login");
        })
        .catch(() => {});
    } else {
      Swal.fire({
        title: "회원가입 실패",
        text: "입력값을 확인하세요",
        icon: "info",
        confirmButtonColor: "#2f3e2f",
        confirmButtonText: "확인",
      });
    }
  };

  return (
    <section className="join-wrap">
      <h2 className="join-title">회원가입</h2>
      <form
        className="join-form"
        onSubmit={(e) => {
          e.preventDefault();
          joinMember();
        }}
      >
        <Box className="join-input-wrap">
          <TextField
            fullWidth
            id="memberId"
            name="memberId"
            label="아이디"
            value={member.memberId}
            onChange={inputMemberData}
            onBlur={checkId}
          />
        </Box>
        <p
          className={
            idCheck === 0
              ? "join-input-msg"
              : idCheck === 1
              ? "join-input-msg valid"
              : "join-input-msg invalid"
          }
        >
          {idCheck === 0
            ? ""
            : idCheck === 1
            ? "사용가능한 아이디입니다."
            : idCheck === 2
            ? "아이디는 영어 대소문자 숫자로 6~12글자 입니다."
            : "이미 사용중인 아이디 입니다."}
        </p>

        <Box className="join-input-wrap">
          <TextField
            fullWidth
            id="memberPw"
            name="memberPw"
            label="비밀번호"
            type={showPassword ? "text" : "password"}
            value={member.memberPw}
            onChange={inputMemberData}
            onBlur={checkPw}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={toggleShowPassword} edge="end">
                    {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <Box className="join-input-wrap">
          <TextField
            fullWidth
            id="memberPwRe"
            name="memberPwRe"
            label="비밀번호 확인"
            type={showPasswordRe ? "text" : "password"}
            value={memberPwRe}
            onChange={inputMemberPwRe}
            onBlur={checkPw}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={toggleShowPasswordRe} edge="end">
                    {showPasswordRe ? (
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
        <p className="join-input-msg" ref={pwMsgRef}></p>

        <Box className="join-input-wrap">
          <TextField
            fullWidth
            id="memberName"
            name="memberName"
            label="이름"
            value={member.memberName}
            onChange={inputMemberData}
          />
        </Box>

        <Box className="join-input-wrap email-wrap">
          <Box sx={{ display: "flex", gap: 1 }}>
            <TextField
              name="memberEmailFront"
              label="이메일 아이디"
              value={member.memberEmailFront}
              onChange={inputMemberData}
              sx={{ flex: 2 }}
            />
            <span style={{ alignSelf: "center" }}>@</span>
            {selectedDomain === "직접입력" ? (
              <TextField
                name="memberEmailBack"
                label="도메인 입력"
                value={member.memberEmailBack}
                onChange={inputMemberData}
                sx={{ flex: 2 }}
              />
            ) : (
              <TextField
                select
                name="memberEmailBack"
                label="도메인 선택"
                value={selectedDomain}
                onChange={handleDomainChange}
                sx={{ flex: 2 }}
              >
                <MenuItem value="gmail.com">gmail.com</MenuItem>
                <MenuItem value="naver.com">naver.com</MenuItem>
                <MenuItem value="daum.net">daum.net</MenuItem>
                <MenuItem value="직접입력">직접입력</MenuItem>
              </TextField>
            )}
            <button
              type="button"
              onClick={sendAuthCode}
              className="btn-primary sm"
              style={{ flex: 1.2 }}
            >
              인증번호 받기
            </button>
          </Box>
        </Box>

        {showAuthInput && (
          <div>
            <Box
              className="join-input-wrap"
              sx={{ display: "flex", gap: 1, alignItems: "center" }}
            >
              <TextField
                name="authCode"
                label="인증번호"
                value={member.authCode}
                onChange={inputMemberData}
                sx={{ width: "200px" }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <span
                        style={{
                          minWidth: 60,
                          textAlign: "center",
                          fontSize: "14px",
                          color: "#555",
                        }}
                      >
                        {formatTime(authTimer)}
                      </span>
                    </InputAdornment>
                  ),
                }}
              />
              <button
                type="button"
                onClick={checkAuthCode}
                className="btn-primary sm"
                style={{ height: 56 }}
              >
                인증번호 확인
              </button>
            </Box>
            <p className="join-input-msg" ref={emailMsgRef}></p>
          </div>
        )}
        <p className="join-input-msg" ref={emailMsgRef}></p>

        <Box className="join-input-wrap">
          <TextField
            fullWidth
            id="memberPhone"
            name="memberPhone"
            label="전화번호"
            value={member.memberPhone}
            onChange={inputMemberData}
          />
        </Box>
        <div className="join-button-box">
          <button type="submit" className="btn-primary lg full">
            회원가입
          </button>
        </div>
      </form>
    </section>
  );
};

export default MemberJoin;
