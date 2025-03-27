import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./member.css";
import TermsText from "./TermsText";
import PrivacyText from "./PrivacyText";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Swal from "sweetalert2";

const JoinTerms = () => {
  const [allAgree, setAllAgree] = useState(false);
  const [termsAgree, setTermsAgree] = useState(false);
  const [privacyAgree, setPrivacyAgree] = useState(false);
  const navigate = useNavigate();
  const toggleAll = () => {
    const newValue = !allAgree;
    setAllAgree(newValue);
    setTermsAgree(newValue);
    setPrivacyAgree(newValue);
  };
  const handleSubmit = () => {
    if (termsAgree && privacyAgree) {
      navigate("/join/form");
    } else {
      Swal.fire({
        title: "약관 동의",
        text: "약관에 동의해주세요.",
        icon: "info",
        confirmButtonText: "확인",
        confirmButtonColor: "#333",
      });
    }
  };

  return (
    <section className="terms-all-wrap">
      <div className="terms-wrap">
        <h2 className="terms-title">이용약관 동의</h2>
        <div className="terms-check all">
          <FormControlLabel
            control={
              <Checkbox
                checked={allAgree}
                onChange={toggleAll}
                sx={{ color: "#000", "&.Mui-checked": { color: "#000" } }}
              />
            }
            label="모든 약관을 확인하고 전체 동의합니다."
            className="terms-checkbox"
          />
        </div>

        <div className="terms-check">
          <FormControlLabel
            control={
              <Checkbox
                checked={termsAgree}
                onChange={(e) => setTermsAgree(e.target.checked)}
                sx={{ color: "#000", "&.Mui-checked": { color: "#000" } }}
              />
            }
            label={
              <>
                이용약관에 동의합니다. <span className="required">(필수)</span>
              </>
            }
            className="terms-checkbox"
          />
          <textarea className="terms-content" readOnly value={TermsText} />
        </div>

        <div className="terms-check">
          <FormControlLabel
            control={
              <Checkbox
                checked={privacyAgree}
                onChange={(e) => setPrivacyAgree(e.target.checked)}
                sx={{ color: "#000", "&.Mui-checked": { color: "#000" } }}
              />
            }
            label={
              <>
                개인정보 수집 및 이용에 동의합니다.{" "}
                <span className="required">(필수)</span>
              </>
            }
            className="terms-checkbox"
          />
          <textarea className="terms-content" readOnly value={PrivacyText} />
        </div>

        <div className="terms-btn-box">
          <button className="btn-primary sm gray" onClick={() => navigate(-1)}>
            이전
          </button>
          <button className="btn-primary sm" onClick={handleSubmit}>
            다음
          </button>
        </div>
      </div>
    </section>
  );
};

export default JoinTerms;
