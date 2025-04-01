import { useState, useEffect, useRef } from "react";
import "./member.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import MenuItem from "@mui/material/MenuItem";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import PrivacyTipIcon from "@mui/icons-material/PrivacyTip";
import SecurityIcon from "@mui/icons-material/Security";

const MemberJoin = () => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const navigate = useNavigate();
  const [member, setMember] = useState({
    memberId: "",
    memberPw: "",
    memberName: "",
    memberPhone: "",
    memberEmailFront: "",
    memberEmailBack: "gmail.com",
    memberAddr: "",
    memberAddrDetail: "",
    authCode: "",
  });
  const [memberPwRe, setMemberPwRe] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordRe, setShowPasswordRe] = useState(false);
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const toggleShowPasswordRe = () => {
    setShowPasswordRe(!showPasswordRe);
  };
  const [selectedDomain, setSelectedDomain] = useState("gmail.com");
  const [showAuthInput, setShowAuthInput] = useState(false);
  const [authTimer, setAuthTimer] = useState(180);

  const inputMemberData = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    let newValue = value;
    if (name === "memberPw") {
      evaluatePasswordStrength(value);
    }
    if (name === "memberPhone") {
      newValue = formatPhoneNumber(value);
      checkPhone(newValue);
    }
    setMember({ ...member, [name]: newValue });
  };
  const inputMemberPwRe = (e) => {
    setMemberPwRe(e.target.value);
  };

  const [idCheckValid, setIdCheckValid] = useState(null);
  const [idCheckMsg, setIdCheckMsg] = useState("");

  const checkId = () => {
    const idReg = /^[a-zA-Z0-9]{6,12}$/;
    if (!idReg.test(member.memberId)) {
      setIdCheckValid(false);
      setIdCheckMsg("아이디는 영어 대소문자 숫자로 6~12글자 입니다.");
    } else {
      axios
        .get(`${backServer}/member/exists?memberId=${member.memberId}`)
        .then((res) => {
          if (res.data === 0) {
            setIdCheckValid(true);
            setIdCheckMsg("사용가능한 아이디입니다.");
          } else {
            setIdCheckValid(false);
            setIdCheckMsg("이미 사용중인 아이디 입니다.");
          }
        });
    }
  };

  const [pwCheckMsg, setPwCheckMsg] = useState("");
  const [pwCheckValid, setPwCheckValid] = useState(null);
  const [pwStrength, setPwStrength] = useState(null);
  const [pwStrengthMsg, setPwStrengthMsg] = useState("");

  const checkPw = () => {
    const pwReg = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,20}$/;
    if (!pwReg.test(member.memberPw)) {
      setPwCheckValid(false);
      setPwCheckMsg("비밀번호는 영문/숫자/특수문자 조합 8~20자리입니다.");
      return;
    }
    if (member.memberPw === memberPwRe) {
      setPwCheckValid(true);
      setPwCheckMsg("비밀번호가 일치합니다.");
    } else {
      setPwCheckValid(false);
      setPwCheckMsg("비밀번호가 일치하지 않습니다.");
    }
  };

  const evaluatePasswordStrength = (pw) => {
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    if (score >= 4) {
      setPwStrength("strong");
      setPwStrengthMsg("보안 수준: 강함");
    } else if (score >= 2) {
      setPwStrength("medium");
      setPwStrengthMsg("보안 수준: 보통");
    } else {
      setPwStrength("weak");
      setPwStrengthMsg("보안 수준: 약함");
    }
  };

  const [emailCheckValid, setEmailCheckValid] = useState(null);
  const [emailCheckMsg, setEmailCheckMsg] = useState("");
  const [emailSending, setEmailSending] = useState(false);

  const handleDomainChange = (e) => {
    const value = e.target.value;
    setSelectedDomain(value);
    setMember({
      ...member,
      memberEmailBack: value === "직접입력" ? "" : value,
    });
  };

  const sendAuthCode = () => {
    if (emailSending) return;
    const email = `${member.memberEmailFront}@${member.memberEmailBack}`;
    if (!member.memberEmailFront || !member.memberEmailBack) {
      Swal.fire({
        title: "입력 오류",
        text: "이메일 주소를 모두 입력해주세요.",
        icon: "warning",
        confirmButtonColor: "#2f3e2f",
        confirmButtonText: "확인",
      });
      return;
    }
    setEmailSending(true);

    axios
      .get(`${backServer}/member/exists/email?memberEmail=${email}`)
      .then((res) => {
        if (res.data > 0) {
          Swal.fire({
            title: "이미 가입된 이메일",
            text: "다른 이메일을 입력해주세요.",
            icon: "warning",
            confirmButtonColor: "#2f3e2f",
            confirmButtonText: "확인",
          });
          setEmailSending(false);
        } else {
          axios
            .get(`${backServer}/email/send?to=${email}`)
            .then(() => {
              setShowAuthInput(true);
              setAuthTimer(180);
              Swal.fire({
                title: "인증번호 전송 완료",
                text: "입력한 이메일을 확인하세요.",
                icon: "success",
                confirmButtonColor: "#2f3e2f",
                confirmButtonText: "확인",
              });
            })
            .catch(() => {
              Swal.fire({
                title: "전송 실패",
                text: "인증번호를 보낼 수 없습니다.",
                icon: "error",
                confirmButtonColor: "#2f3e2f",
                confirmButtonText: "확인",
              });
            })
            .finally(() => {
              setEmailSending(false);
            });
        }
      })
      .catch(() => {
        Swal.fire({
          title: "중복 확인 실패",
          text: "이메일 중복 여부를 확인할 수 없습니다.",
          icon: "error",
          confirmButtonColor: "#2f3e2f",
          confirmButtonText: "확인",
        });
        setEmailSending(false);
      });
  };

  useEffect(() => {
    if (showAuthInput && authTimer > 0 && !emailCheckValid) {
      const timer = setTimeout(() => {
        setAuthTimer(authTimer - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [showAuthInput, authTimer, emailCheckValid]);

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? "0" + sec : sec}`;
  };

  const checkAuthCode = () => {
    const email = `${member.memberEmailFront}@${member.memberEmailBack}`;
    axios
      .post(`${backServer}/email/verify`, {
        to: email,
        authCode: member.authCode,
      })
      .then(() => {
        setEmailCheckValid(true);
        setEmailCheckMsg("인증번호가 확인되었습니다.");
        setAuthTimer(0);
      })
      .catch((err) => {
        setEmailCheckValid(false);
        if (err.response?.status === 401) {
          setEmailCheckMsg("인증번호가 일치하지 않습니다.");
        } else if (err.response?.status === 410) {
          setEmailCheckMsg("인증번호가 만료되었습니다. 다시 요청해주세요.");
        } else {
          setEmailCheckMsg("인증 실패. 다시 시도해주세요.");
        }
      });
  };

  const [phoneValid, setPhoneValid] = useState(null);
  const [phoneMsg, setPhoneMsg] = useState("");

  const checkPhone = (value) => {
    const phoneReg = /^01[016789]-?\d{3,4}-?\d{4}$/;
    if (phoneReg.test(value)) {
      setPhoneValid(true);
      setPhoneMsg("올바른 전화번호 형식입니다.");
    } else {
      setPhoneValid(false);
      setPhoneMsg("전화번호 형식이 올바르지 않습니다.");
    }
  };

  const isJoinValid =
    idCheckValid === true &&
    pwCheckValid === true &&
    (pwStrength === "medium" || pwStrength === "strong") &&
    member.memberName.trim() !== "" &&
    phoneValid === true &&
    emailCheckValid === true &&
    member.memberAddr.trim() !== "" &&
    member.memberAddrDetail.trim() !== "";

  const joinMember = () => {
    if (
      idCheckValid &&
      pwCheckValid &&
      phoneValid &&
      emailCheckValid &&
      member.memberName !== ""
    ) {
      const email = `${member.memberEmailFront}@${member.memberEmailBack}`;
      const addr = `${member.memberAddr}, ${member.memberAddrDetail}`;

      axios
        .post(`${backServer}/member`, {
          ...member,
          memberEmail: email,
          memberAddr: addr,
        })
        .then((res) => {
          if (res.data === 1) {
            Swal.fire({
              title: "회원가입 완료",
              text: "로그인 페이지로 이동합니다.",
              icon: "success",
              confirmButtonColor: "#2f3e2f",
              confirmButtonText: "확인",
            }).then(() => {
              navigate("/login");
            });
          }
        })
        .catch(() => {
          Swal.fire({
            title: "회원가입 실패",
            text: "입력값을 확인하세요",
            icon: "info",
            confirmButtonColor: "#2f3e2f",
            confirmButtonText: "확인",
          });
        });
    } else {
      Swal.fire({
        title: "회원가입 실패",
        text: "모든 항목을 올바르게 입력해주세요.",
        icon: "info",
        confirmButtonColor: "#2f3e2f",
        confirmButtonText: "확인",
      });
    }
  };

  const formatPhoneNumber = (value) => {
    const onlyNums = value.replace(/\D/g, "");

    if (onlyNums.length < 4) return onlyNums;
    if (onlyNums.length < 7)
      return onlyNums.replace(/(\d{3})(\d{1,3})/, "$1-$2");
    if (onlyNums.length <= 11)
      return onlyNums.replace(/(\d{3})(\d{3,4})(\d{4})/, "$1-$2-$3");

    return onlyNums;
  };

  const detailAddrRef = useRef();

  const handleAddressSearch = () => {
    new window.daum.Postcode({
      oncomplete: function (data) {
        const fullAddress = data.address;
        setMember((prev) => ({ ...prev, memberAddr: fullAddress }));
        setTimeout(() => {
          detailAddrRef.current?.focus();
        }, 0);
      },
    }).open();
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
        <div className="join-form-field">
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
            className={`join-input-msg ${
              idCheckValid === null ? "" : idCheckValid ? "valid" : "invalid"
            }`}
          >
            {idCheckValid !== null && (
              <>
                <InfoOutlinedIcon
                  fontSize="small"
                  sx={{ verticalAlign: "middle", marginRight: "4px" }}
                />
                {idCheckMsg}
              </>
            )}
          </p>
        </div>
        <div className="join-form-field">
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
          <p
            className={`join-input-msg ${
              pwCheckValid === null ? "" : pwCheckValid ? "valid" : "invalid"
            }`}
          >
            {pwCheckValid !== null && (
              <>
                <InfoOutlinedIcon
                  fontSize="small"
                  sx={{ verticalAlign: "middle", marginRight: "4px" }}
                />
                {pwCheckMsg}
              </>
            )}
          </p>
          <p
            className={`join-input-msg ${
              pwStrength === "strong"
                ? "valid"
                : pwStrength === "weak"
                ? "invalid"
                : ""
            }`}
          >
            {pwStrength && (
              <>
                {pwStrength === "strong" && (
                  <VerifiedUserIcon
                    fontSize="small"
                    sx={{
                      verticalAlign: "middle",
                      marginRight: "4px",
                      color: "#1976d2",
                    }}
                  />
                )}

                {pwStrength === "medium" && (
                  <SecurityIcon
                    fontSize="small"
                    sx={{
                      verticalAlign: "middle",
                      marginRight: "4px",
                      color: "orange",
                    }}
                  />
                )}
                {pwStrength === "weak" && (
                  <PrivacyTipIcon
                    fontSize="small"
                    sx={{
                      verticalAlign: "middle",
                      marginRight: "4px",
                      color: "red",
                    }}
                  />
                )}
                {pwStrengthMsg}
              </>
            )}
          </p>
        </div>
        <div className="join-form-field">
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
        </div>

        <div className="join-form-field">
          <Box className="join-input-wrap email-wrap">
            <Box sx={{ display: "flex", gap: 2 }}>
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
        </div>

        {showAuthInput && (
          <div className="join-form-field">
            <Box
              className="join-input-wrap"
              sx={{ display: "flex", gap: 2, alignItems: "center" }}
            >
              <TextField
                name="authCode"
                label="인증번호"
                value={member.authCode}
                onChange={inputMemberData}
                sx={{ width: "200px" }}
                InputProps={{
                  endAdornment: !emailCheckValid && (
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
            <p
              className={`join-input-msg ${
                emailCheckValid === null
                  ? ""
                  : emailCheckValid
                  ? "valid"
                  : "invalid"
              }`}
            >
              {emailCheckValid !== null && (
                <>
                  <InfoOutlinedIcon
                    fontSize="small"
                    sx={{ verticalAlign: "middle", marginRight: "4px" }}
                  />
                  {emailCheckMsg}
                </>
              )}
            </p>
          </div>
        )}
        <div className="join-form-field">
          <Box
            className="join-input-wrap"
            sx={{ display: "flex", gap: 2, alignItems: "center" }}
          >
            <TextField
              name="memberAddr"
              label="주소"
              value={member.memberAddr}
              onChange={inputMemberData}
              sx={{ flex: 1 }}
            />
            <button
              type="button"
              onClick={handleAddressSearch}
              className="btn-primary sm"
              style={{ height: 56 }}
            >
              주소 검색
            </button>
          </Box>
          <TextField
            name="memberAddrDetail"
            label="상세 주소"
            value={member.memberAddrDetail}
            onChange={inputMemberData}
            sx={{ width: "50%" }}
            id="memberAddrDetail"
            inputRef={detailAddrRef}
          />
        </div>
        <div className="join-form-field">
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
          <p
            className={`join-input-msg ${
              phoneValid === null ? "" : phoneValid ? "valid" : "invalid"
            }`}
          >
            {phoneValid !== null && (
              <>
                <InfoOutlinedIcon
                  fontSize="small"
                  sx={{ verticalAlign: "middle", marginRight: "4px" }}
                />
                {phoneMsg}
              </>
            )}
          </p>
        </div>
        <div className="join-button-box">
          <button
            type="submit"
            className="btn-primary lg full"
            disabled={!isJoinValid}
            style={{ height: "56px" }}
          >
            회원가입
          </button>
        </div>
        <p className="join-sub">
          이미 회원이신가요?{" "}
          <Link to="/login" className="login-link">
            <strong>로그인</strong>
          </Link>
        </p>
      </form>
    </section>
  );
};

export default MemberJoin;
