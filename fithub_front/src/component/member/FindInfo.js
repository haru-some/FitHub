import { useState } from "react";
import { Box, TextField, Tabs, Tab } from "@mui/material";
import Swal from "sweetalert2";
import axios from "axios";
import "./member.css";

const FindInfo = () => {
  const [tab, setTab] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const backServer = process.env.REACT_APP_BACK_SERVER;

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
      .get(`${backServer}/member/find/id`, {
        params: {
          name,
          email,
        },
      })
      .then((res) => {
        Swal.fire({
          title: "아이디 찾기 결과",
          text: `회원님의 아이디는 ${res.data.memberId} 입니다.`,
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

  return (
    <section className="join-wrap">
      <h2 className="join-title">아이디 / 비밀번호 찾기</h2>
      <Tabs value={tab} onChange={(e, v) => setTab(v)} centered>
        <Tab label="아이디 찾기" />
        <Tab label="비밀번호 찾기" />
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
        </Box>
      )}

      {tab === 1 && (
        <Box className="join-form" sx={{ mt: 4 }}>
          {/* 비밀번호 찾기 UI 여기에 추가 예정 */}
          <p>비밀번호 찾기 기능은 준비 중입니다.</p>
        </Box>
      )}
    </section>
  );
};

export default FindInfo;
