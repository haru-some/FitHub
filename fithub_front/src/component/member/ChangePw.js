import { useState } from "react";
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
import { memberState } from "../utils/RecoilData";
import axios from "axios";
import { styled } from "@mui/material/styles";
import Check from "@mui/icons-material/Check";
import clsx from "clsx";
import {
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  InfoOutlined as InfoOutlinedIcon,
  VerifiedUser as VerifiedUserIcon,
  Security as SecurityIcon,
  PrivacyTip as PrivacyTipIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import "./member.css";

const CustomConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 18,
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 2,
    border: 0,
    backgroundColor: "#bbb",
    borderRadius: 1,
  },
  [`&.${stepConnectorClasses.active} .${stepConnectorClasses.line}`]: {
    backgroundColor: "#293a2c",
  },
  [`&.${stepConnectorClasses.completed} .${stepConnectorClasses.line}`]: {
    backgroundColor: "#293a2c",
  },
}));

const CustomStepIconRoot = styled("div")(({ ownerState }) => ({
  backgroundColor:
    ownerState.active || ownerState.completed ? "#191c19" : "#ccc",
  color: "#fff",
  width: 30,
  height: 30,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: "50%",
  fontWeight: "bold",
  fontSize: "0.875rem",
  lineHeight: 1,
  marginTop: "4px",
}));

function CustomStepIcon(props) {
  const { active, completed, className, icon } = props;
  return (
    <CustomStepIconRoot
      ownerState={{ active, completed }}
      className={clsx(className)}
    >
      {completed ? <Check fontSize="small" /> : icon}
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
      .post(`${backServer}/member/check-pw`, {
        memberId: loginMember.memberId,
        memberPw: currentPw,
      })
      .then(() => {
        Swal.fire({
          title: "확인 완료",
          text: "현재 비밀번호가 확인되었습니다.",
          icon: "success",
          confirmButtonColor: "#2f3e2f",
        });
        setStep(2);
      })
      .catch(() => {
        Swal.fire({
          title: "확인 실패",
          text: "현재 비밀번호가 일치하지 않습니다.",
          icon: "error",
          confirmButtonColor: "#2f3e2f",
        });
      });
  };

  const handleChangePassword = () => {
    if (!pwCheckValid) {
      Swal.fire({
        title: "비밀번호 오류",
        text: "비밀번호가 조건에 맞지 않거나 일치하지 않습니다.",
        icon: "warning",
        confirmButtonColor: "#2f3e2f",
      });
      return;
    }
    axios
      .patch(`${backServer}/member/password`, {
        memberId: loginMember.memberId,
        oldPw: currentPw,
        newPw: memberPw,
      })
      .then(() => {
        Swal.fire({
          title: "변경 완료",
          text: "비밀번호가 성공적으로 변경되었습니다.",
          icon: "success",
          confirmButtonColor: "#2f3e2f",
        }).then(() => navigate("/mypage"));
        setCurrentPw("");
        setMemberPw("");
        setMemberPwRe("");
        setStep(3);
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
        sx={{ marginBottom: 10, marginTop: 10, alignItems: "center" }}
      >
        {["현재 비밀번호 확인", "새 비밀번호 설정", "변경 완료"].map(
          (label) => (
            <Step key={label}>
              <StepLabel StepIconComponent={CustomStepIcon}>{label}</StepLabel>
            </Step>
          )
        )}
      </Stepper>

      <Box className="info-form">
        {step === 1 && (
          <div className="info-form-field">
            <TextField
              label="현재 비밀번호"
              type="password"
              value={currentPw}
              onChange={(e) => setCurrentPw(e.target.value)}
              fullWidth
            />
            <div className="info-action-box" style={{ marginTop: "1rem" }}>
              <button
                className="info-action-btn info-update-btn"
                onClick={handleCheckCurrentPw}
                style={{ marginTop: "1rem" }}
              >
                비밀번호 확인
              </button>
            </div>
          </div>
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
              >
                비밀번호 변경
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="info-form-field" style={{ textAlign: "center" }}>
            <p style={{ fontSize: "1.2rem", marginTop: "2rem" }}>
              ✅ 비밀번호가 성공적으로 변경되었습니다.
            </p>
          </div>
        )}
      </Box>
    </section>
  );
};

export default ChangePw;
