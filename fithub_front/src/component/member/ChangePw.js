import { useEffect, useState } from "react";
import {
  TextField,
  Box,
  IconButton,
  InputAdornment,
  Stepper,
  Step,
  StepLabel,
  StepConnector,
  stepConnectorClasses,
} from "@mui/material";
import Swal from "sweetalert2";
import { useRecoilValue } from "recoil";
import { isLoginState, memberState } from "../utils/RecoilData";
import axios from "axios";
import { styled } from "@mui/material/styles";
import clsx from "clsx";
import {
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  InfoOutlined as InfoOutlinedIcon,
  VerifiedUser as VerifiedUserIcon,
  Security as SecurityIcon,
  PrivacyTip as PrivacyTipIcon,
  LockPerson as LockPersonIcon,
  LockReset as LockResetIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import "./member.css";

const iconMap = {
  1: <LockPersonIcon />,
  2: <LockResetIcon />,
  3: <CheckCircleIcon />,
};

const CustomConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 19,
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor: "#bdbdbd",
    borderRadius: 1,
    margin: "0 12px",
  },
  [`&.${stepConnectorClasses.active} .${stepConnectorClasses.line}`]: {
    backgroundImage: "linear-gradient(to right, #293a2c, #536976, #BBD2C5)",
  },
  [`&.${stepConnectorClasses.completed} .${stepConnectorClasses.line}`]: {
    backgroundImage: "linear-gradient(to right, #293a2c, #536976, #BBD2C5)",
  },
}));

const CustomStepIconRoot = styled("div")(({ ownerState }) => {
  const isActiveOrCompleted = ownerState.active || ownerState.completed;
  return {
    position: "relative",
    backgroundImage: isActiveOrCompleted
      ? "linear-gradient(to right, #293a2c, #536976, #BBD2C5)"
      : "none",
    backgroundColor: isActiveOrCompleted ? "transparent" : "#bdbdbd",
    color: "#fff",
    width: 40,
    height: 40,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "50%",
    zIndex: 1,
    transition: "all 0.3s ease-in-out",
    cursor: "default",
    "&:hover": {
      boxShadow: "0 0 10px 4px rgba(187, 210, 197, 0.4)",
      filter: "brightness(1.1)",
      transform: "scale(1.3)",
    },
  };
});

function CustomStepIcon(props) {
  const { active, completed, className, icon } = props;
  return (
    <CustomStepIconRoot
      ownerState={{ active, completed }}
      className={clsx(className)}
    >
      {iconMap[icon]}
    </CustomStepIconRoot>
  );
}

const ChangePw = () => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const loginMember = useRecoilValue(memberState);
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [currentPw, setCurrentPw] = useState("");
  const [memberPw, setMemberPw] = useState("");
  const [memberPwRe, setMemberPwRe] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordRe, setShowPasswordRe] = useState(false);
  const [pwCheckValid, setPwCheckValid] = useState(null);
  const [pwCheckMsg, setPwCheckMsg] = useState("");
  const [pwStrength, setPwStrength] = useState("");
  const [pwStrengthMsg, setPwStrengthMsg] = useState("");
  const isLogin = useRecoilValue(isLoginState);

  useEffect(() => {
    if (!isLogin) {
      navigate("/");
    }
  }, [isLogin, navigate]);
  useEffect(() => {
    if (!loginMember) return;
    if (loginMember.loginType !== "local") {
      Swal.fire({
        title: "접근 불가",
        text: "소셜 로그인 계정은 비밀번호 변경이 불가능합니다.",
        icon: "warning",
        confirmButtonColor: "#2f3e2f",
        confirmButtonText: "확인",
      }).then(() => navigate("/mypage"));
    }
  }, [loginMember]);

  const toggleShowPassword = () => setShowPassword((prev) => !prev);
  const toggleShowPasswordRe = () => setShowPasswordRe((prev) => !prev);

  const inputMemberPw = (e) => {
    const value = e.target.value;
    setMemberPw(value);
    evaluatePasswordStrength(value);
  };

  const inputMemberPwRe = (e) => {
    const value = e.target.value;
    setMemberPwRe(value);
  };

  const checkPw = () => {
    const pwReg = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,20}$/;
    if (!pwReg.test(memberPw)) {
      setPwCheckValid(false);
      setPwCheckMsg("비밀번호는 영문/숫자/특수문자 조합 8~20자리입니다.");
      return;
    }
    if (memberPw === memberPwRe) {
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

  const handleCheckCurrentPw = () => {
    if (!currentPw.trim()) {
      Swal.fire({
        title: "입력 오류",
        text: "현재 비밀번호를 입력해주세요.",
        icon: "warning",
        confirmButtonColor: "#2f3e2f",
      });
      return;
    }
    axios
      .post(`${backServer}/member/${loginMember.memberId}/verify-password`, {
        memberPw: currentPw,
      })
      .then((res) => {
        if (res.data === 1) {
          Swal.fire({
            title: "확인 완료",
            text: "현재 비밀번호가 확인되었습니다.",
            icon: "success",
            confirmButtonColor: "#2f3e2f",
          });
          setStep(2);
        } else {
          Swal.fire({
            title: "확인 실패",
            text: "현재 비밀번호가 일치하지 않습니다.",
            icon: "error",
            confirmButtonColor: "#2f3e2f",
          });
        }
      })
      .catch((err) => {
        const errorMessage = err.response?.data || "서버 오류가 발생했습니다.";
        Swal.fire({
          title: "요청 실패",
          text: errorMessage,
          icon: "error",
          confirmButtonColor: "#2f3e2f",
        });
      });
  };

  const handleChangePassword = () => {
    checkPw();
    if (!pwCheckValid) {
      Swal.fire({
        title: "비밀번호 오류",
        text: "비밀번호가 조건에 맞지 않거나 일치하지 않습니다.",
        icon: "warning",
        confirmButtonColor: "#2f3e2f",
      });
      return;
    }
    if (currentPw === memberPw) {
      Swal.fire({
        title: "비밀번호 오류",
        text: "현재 비밀번호와 동일한 비밀번호로 변경할 수 없습니다.",
        icon: "warning",
        confirmButtonColor: "#2f3e2f",
      });
      return;
    }
    axios
      .patch(`${backServer}/member/${loginMember.memberId}/password`, {
        memberPw: memberPw,
      })
      .then((res) => {
        if (res.data === 1) {
          Swal.fire({
            title: "변경 완료",
            text: "비밀번호가 성공적으로 변경되었습니다.",
            icon: "success",
            confirmButtonColor: "#2f3e2f",
          });
          setCurrentPw("");
          setMemberPw("");
          setMemberPwRe("");
          setStep(3);
        } else {
          Swal.fire({
            title: "변경 실패",
            text: "비밀번호 변경이 정상적으로 처리되지 않았습니다.",
            icon: "error",
            confirmButtonColor: "#2f3e2f",
          });
        }
      })
      .catch(() => {
        Swal.fire({
          title: "변경 실패",
          text: "비밀번호 변경 중 오류가 발생했습니다.",
          icon: "error",
          confirmButtonColor: "#2f3e2f",
        });
      });
  };

  return (
    <section className="info-wrap">
      <h2 className="info-title">비밀번호 변경</h2>
      <Stepper
        alternativeLabel
        activeStep={step - 1}
        connector={<CustomConnector />}
        sx={{ marginBottom: 7, marginTop: 7, alignItems: "center" }}
      >
        {["현재 비밀번호 확인", "새 비밀번호 설정", "변경 완료"].map(
          (label) => (
            <Step key={label}>
              <StepLabel
                StepIconComponent={CustomStepIcon}
                sx={{
                  "& .MuiStepLabel-label": {
                    color: "#aaa",
                  },
                  "& .MuiStepLabel-label.Mui-active": {
                    color: "black",
                  },
                  "& .MuiStepLabel-label.Mui-completed": {
                    color: "black",
                  },
                }}
              >
                {label}
              </StepLabel>
            </Step>
          )
        )}
      </Stepper>

      <Box className="info-form">
        {step === 1 && (
          <form
            className="info-form-field"
            onSubmit={(e) => {
              e.preventDefault();
              handleCheckCurrentPw();
            }}
          >
            <TextField
              label="현재 비밀번호"
              type="password"
              value={currentPw}
              onChange={(e) => setCurrentPw(e.target.value)}
              fullWidth
              sx={{ marginBottom: "2rem", marginTop: "1rem" }}
            />
            <div className="info-action-box" style={{ marginTop: "1rem" }}>
              <button type="submit" className="info-action-btn info-update-btn">
                비밀번호 확인
              </button>
            </div>
          </form>
        )}

        {step === 2 && (
          <div className="join-form-field">
            <Box className="join-input-wrap">
              <TextField
                fullWidth
                label="새 비밀번호"
                type={showPassword ? "text" : "password"}
                value={memberPw}
                onChange={inputMemberPw}
                onBlur={checkPw}
                sx={{ marginBottom: "1rem" }}
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
                label="비밀번호 확인"
                type={showPasswordRe ? "text" : "password"}
                value={memberPwRe}
                onChange={inputMemberPwRe}
                onBlur={checkPw}
                sx={{ marginBottom: "1rem" }}
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
            <div className="info-action-box">
              <button
                className="info-action-btn info-update-btn"
                onClick={handleChangePassword}
                style={{ marginTop: "1rem" }}
              >
                비밀번호 변경
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="info-form-field" style={{ textAlign: "center" }}>
            <img
              src="/image/pwc_success.jpg"
              alt="비밀번호 변경 완료"
              style={{ width: "400px", marginBottom: "1rem" }}
            />
            <p
              style={{
                fontSize: "1.5rem",
                marginBottom: "2.5rem",
                fontFamily: "pd-b",
              }}
            >
              비밀번호가 성공적으로 변경되었습니다.
            </p>
          </div>
        )}
      </Box>
    </section>
  );
};

export default ChangePw;
