import { useState } from "react";
import { Box, TextField, Tabs, Tab } from "@mui/material";
import Swal from "sweetalert2";
import axios from "axios";
import "./member.css";
import { Link, useNavigate } from "react-router-dom";

const FindInfo = () => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const [tab, setTab] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleFindId = () => {
    if (!name.trim() || !email.trim()) {
      Swal.fire({
        title: "입력 오류",
        text: "이름과 이메일을 모두 입력해주세요.",
        icon: "warning",
        confirmButtonColor: "#2f3e2f",
        confirmButtonText: "확인",
      });
      return;
    }
    axios
      .get(`${backServer}/member/recovery/id`, {
        params: {
          name: name,
          email: email,
        },
      })
      .then((res) => {
        const idList = res.data;
        const htmlList = idList
          .map((id) => `<b style="color:#2f3e2f">${id}</b>`)
          .join("<br>");

        Swal.fire({
          title: "아이디 찾기 결과",
          html: `회원님의 아이디는 다음과 같습니다:<br><br>${htmlList}`,
          icon: "success",
          confirmButtonColor: "#2f3e2f",
          confirmButtonText: "확인",
        });
      })
      .catch((err) => {
        if (err.response?.status === 404) {
          Swal.fire({
            title: "조회 실패",
            text: "입력하신 정보와 일치하는 아이디가 없습니다.",
            icon: "error",
            confirmButtonColor: "#2f3e2f",
            confirmButtonText: "확인",
          });
        } else {
          Swal.fire({
            title: "오류 발생",
            text: "잠시 후 다시 시도해주세요.",
            icon: "error",
            confirmButtonColor: "#2f3e2f",
            confirmButtonText: "확인",
          });
        }
      });
  };

  const [pwId, setPwId] = useState("");
  const [pwEmail, setPwEmail] = useState("");
  const [pwEmailSending, setPwEmailSending] = useState(false);

  const handleFindPw = () => {
    if (pwEmailSending) return;
    if (!pwId.trim() || !pwEmail.trim()) {
      Swal.fire({
        title: "입력 오류",
        text: "아이디와 이메일을 모두 입력해주세요.",
        icon: "warning",
        confirmButtonColor: "#2f3e2f",
        confirmButtonText: "확인",
      });
      return;
    }
    setPwEmailSending(true);

    axios
      .post(`${backServer}/member/${pwId}/password/reset`, {
        memberEmail: pwEmail,
      })
      .then(() => {
        Swal.fire({
          title: "임시 비밀번호 전송 완료",
          text: "입력하신 이메일로 임시 비밀번호가 전송되었습니다.",
          icon: "success",
          confirmButtonColor: "#2f3e2f",
          confirmButtonText: "확인",
        });
        navigate("/login");
      })
      .catch((err) => {
        const status = err.response?.status;
        const message = err.response?.data;

        if (status === 404) {
          let alertMsg = "입력하신 정보와 일치하는 회원이 없습니다.";
          if (message.includes("소셜")) {
            alertMsg = "소셜 로그인 회원은 비밀번호 찾기가 불가능합니다.";
          }

          Swal.fire({
            title: "전송 실패",
            text: alertMsg,
            icon: "error",
            confirmButtonColor: "#2f3e2f",
            confirmButtonText: "확인",
          });
        } else {
          Swal.fire({
            title: "오류 발생",
            text: "잠시 후 다시 시도해주세요.",
            icon: "error",
            confirmButtonColor: "#2f3e2f",
            confirmButtonText: "확인",
          });
        }
      })
      .finally(() => {
        setPwEmailSending(false);
      });
  };

  return (
    <section className="join-wrap">
      <h2 className="join-title">아이디 / 비밀번호 찾기</h2>
      <Tabs
        value={tab}
        onChange={(e, v) => setTab(v)}
        centered
        textColor="inherit"
        TabIndicatorProps={{
          style: {
            backgroundColor: "#2f3e2f",
          },
        }}
      >
        <Tab
          label="아이디 찾기"
          sx={{
            "&.Mui-selected": {
              color: "#2f3e2f",
              fontWeight: "bold",
            },
          }}
        />
        <Tab
          label="비밀번호 찾기"
          sx={{
            "&.Mui-selected": {
              color: "#2f3e2f",
              fontWeight: "bold",
            },
          }}
        />
      </Tabs>

      {tab === 0 && (
        <Box className="join-form" sx={{ mt: 4 }}>
          <div className="join-form-field">
            <Box className="join-input-wrap">
              <TextField
                fullWidth
                label="이름"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Box>
          </div>
          <div className="join-form-field">
            <Box className="join-input-wrap">
              <TextField
                fullWidth
                label="이메일"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Box>
          </div>
          <div className="join-button-box">
            <button
              type="button"
              className="btn-primary lg full"
              style={{ height: 56 }}
              onClick={handleFindId}
            >
              아이디 찾기
            </button>
          </div>
          <p className="join-sub">
            아이디를 확인하셨나요?{" "}
            <Link to="/login" className="login-link">
              <strong>로그인</strong>
            </Link>
          </p>
        </Box>
      )}

      {tab === 1 && (
        <Box className="join-form" sx={{ mt: 4 }}>
          <div className="join-form-field">
            <Box className="join-input-wrap">
              <TextField
                fullWidth
                label="아이디"
                value={pwId}
                onChange={(e) => setPwId(e.target.value)}
              />
            </Box>
          </div>
          <div className="join-form-field">
            <Box className="join-input-wrap">
              <TextField
                fullWidth
                label="이메일"
                value={pwEmail}
                onChange={(e) => setPwEmail(e.target.value)}
              />
            </Box>
          </div>
          <div className="join-button-box">
            <button
              type="button"
              className="btn-primary lg full"
              style={{ height: 56 }}
              onClick={handleFindPw}
            >
              임시 비밀번호 받기
            </button>
          </div>
          <p className="join-sub">
            임시 비밀번호를 받으셨나요?{" "}
            <Link to="/login" className="login-link">
              <strong>로그인</strong>
            </Link>
          </p>
        </Box>
      )}
    </section>
  );
};

export default FindInfo;
