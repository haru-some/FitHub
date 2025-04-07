import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { memberState } from "../utils/RecoilData";
import Swal from "sweetalert2";
import axios from "axios";
import TextField from "@mui/material/TextField";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Box from "@mui/material/Box";
import "./member.css";

const SocialJoin = () => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const navigate = useNavigate();
  const location = useLocation();
  const detailRef = useRef();
  const [memberInfo, setMemberInfo] = useRecoilState(memberState);

  const oauthId = localStorage.getItem("joinOauthId");
  const loginType = localStorage.getItem("joinLoginType");

  useEffect(() => {
    if (!oauthId || !loginType) {
      const storedOauthId = localStorage.getItem("joinOauthId");
      const storedLoginType = localStorage.getItem("joinLoginType");

      if (!storedOauthId || !storedLoginType) {
        Swal.fire(
          "잘못된 접근입니다",
          "소셜 로그인부터 다시 시도해주세요",
          "warning"
        ).then(() => {
          localStorage.removeItem("joinStage");
          navigate("/login");
        });
      }
    }
  }, []);

  const [form, setForm] = useState({
    memberId: "",
    memberName: "",
    memberPhone: "",
    memberAddr: "",
    memberAddrDetail: "",
  });

  const [idCheckValid, setIdCheckValid] = useState(null);
  const [idCheckMsg, setIdCheckMsg] = useState("");
  const [phoneValid, setPhoneValid] = useState(null);
  const [phoneMsg, setPhoneMsg] = useState("");

  const handleInput = (e) => {
    const { name, value } = e.target;
    const newValue = name === "memberPhone" ? formatPhoneNumber(value) : value;
    if (name === "memberPhone") checkPhone(newValue);
    setForm((prev) => ({ ...prev, [name]: newValue }));
  };

  const formatPhoneNumber = (value) => {
    const onlyNums = value.replace(/\D/g, "");
    if (onlyNums.length < 4) return onlyNums;
    if (onlyNums.length < 7)
      return onlyNums.replace(/(\d{3})(\d{1,3})/, "$1-$2");
    return onlyNums.replace(/(\d{3})(\d{3,4})(\d{4})/, "$1-$2-$3");
  };

  const checkPhone = (value) => {
    const phoneReg = /^01[016789]-\d{3,4}-\d{4}$/;
    setPhoneValid(phoneReg.test(value));
    setPhoneMsg(
      phoneReg.test(value)
        ? "올바른 전화번호 형식입니다."
        : "전화번호 형식이 올바르지 않습니다."
    );
  };

  const checkId = () => {
    const reg = /^[a-zA-Z0-9]{6,12}$/;
    if (!reg.test(form.memberId)) {
      setIdCheckValid(false);
      setIdCheckMsg("아이디는 영어 대소문자 숫자로 6~12글자 입니다.");
      return;
    }
    axios
      .get(`${backServer}/member/exists?memberId=${form.memberId}`)
      .then((res) => {
        setIdCheckValid(res.data === 0);
        setIdCheckMsg(
          res.data === 0
            ? "사용가능한 아이디입니다."
            : "이미 사용중인 아이디입니다."
        );
      })
      .catch(() => {
        setIdCheckValid(false);
        setIdCheckMsg("서버 오류로 확인 불가");
      });
  };

  const handleAddressSearch = () => {
    new window.daum.Postcode({
      oncomplete: function (data) {
        setForm((prev) => ({ ...prev, memberAddr: data.address }));
        setTimeout(() => detailRef.current?.focus(), 0);
      },
    }).open();
  };

  const isJoinValid =
    idCheckValid &&
    phoneValid &&
    form.memberName.trim() &&
    form.memberAddr.trim() &&
    form.memberAddrDetail.trim();

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      oauthId,
      loginType,
      memberId: form.memberId,
      name: form.memberName,
      phone: form.memberPhone,
      address: `${form.memberAddr}, ${form.memberAddrDetail}`.trim(),
    };

    axios
      .post(`${backServer}/oauth/join`, payload)
      .then((res) => {
        const { accessToken, memberId } = res.data;

        if (!accessToken) throw new Error("토큰 발급 실패");

        return axios
          .get(`${backServer}/member/${memberId}`, {
            headers: { Authorization: accessToken },
          })
          .then((res) => {
            const memberData = res.data;
            const fullMemberData = { ...memberData, accessToken };

            setMemberInfo(fullMemberData);
            localStorage.setItem(
              "recoil-persist",
              JSON.stringify({ memberState: fullMemberData })
            );

            localStorage.removeItem("joinStage");
            localStorage.removeItem("joinOauthId");
            localStorage.removeItem("joinLoginType");

            Swal.fire(
              "가입 완료",
              "회원 정보가 등록되었습니다.",
              "success"
            ).then(() => navigate("/"));
          });
      })
      .catch((err) => {
        Swal.fire(
          "오류",
          err.response?.data?.error || "회원가입 처리 중 문제가 발생했습니다.",
          "error"
        );
      });
  };

  return (
    <section className="join-wrap">
      <h2 className="join-title">소셜 회원 추가 정보 입력</h2>
      <form className="join-form" onSubmit={handleSubmit}>
        {/* 아이디 */}
        <div className="join-form-field">
          <Box className="join-input-wrap">
            <TextField
              fullWidth
              label="아이디"
              name="memberId"
              value={form.memberId}
              onChange={handleInput}
              onBlur={checkId}
            />
          </Box>
          {idCheckMsg && (
            <p
              className={`join-input-msg ${idCheckValid ? "valid" : "invalid"}`}
            >
              <InfoOutlinedIcon fontSize="small" /> {idCheckMsg}
            </p>
          )}
        </div>

        {/* 이름 */}
        <div className="join-form-field">
          <Box className="join-input-wrap">
            <TextField
              fullWidth
              label="이름"
              name="memberName"
              value={form.memberName}
              onChange={handleInput}
            />
          </Box>
        </div>

        {/* 전화번호 */}
        <div className="join-form-field">
          <Box className="join-input-wrap">
            <TextField
              fullWidth
              label="전화번호"
              name="memberPhone"
              value={form.memberPhone}
              onChange={handleInput}
              inputProps={{ maxLength: 13 }}
            />
          </Box>
          {phoneMsg && (
            <p className={`join-input-msg ${phoneValid ? "valid" : "invalid"}`}>
              <InfoOutlinedIcon fontSize="small" /> {phoneMsg}
            </p>
          )}
        </div>

        {/* 주소 */}
        <div className="join-form-field">
          <Box className="join-input-wrap" sx={{ display: "flex", gap: 2 }}>
            <TextField
              name="memberAddr"
              label="주소"
              value={form.memberAddr}
              onClick={handleAddressSearch}
              InputProps={{ readOnly: true }}
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
            value={form.memberAddrDetail}
            onChange={handleInput}
            inputRef={detailRef}
            sx={{ width: "50%", mt: 1 }}
          />
        </div>

        <div className="join-button-box">
          <button
            type="submit"
            className="btn-primary lg full"
            disabled={!isJoinValid}
          >
            가입 완료
          </button>
        </div>
      </form>
    </section>
  );
};

export default SocialJoin;
