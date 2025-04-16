import { Link } from "react-router-dom";
import MarkUnreadChatAltIcon from "@mui/icons-material/MarkUnreadChatAlt";
import IntroSlider from "./IntroSlider";
import React, { useEffect, useRef, useState } from "react";
import "./main.css";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { isLoginState, memberState } from "../utils/RecoilData";
import "./intro.css";
import TypingText from "./TypingText";

const Main = () => {
  const navigate = useNavigate();
  const isLogin = useRecoilValue(isLoginState);
  const nowStart = () => {
    if (isLogin) {
      navigate("/myfit/fit");
    } else {
      navigate("/login");
    }
  };
  const typingRef = useRef();
  const [startTyping, setStartTyping] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStartTyping(true);
          observer.disconnect(); // 한 번만 실행
        }
      },
      { threshold: 0.3 } // 30% 보일 때 실행
    );

    if (typingRef.current) observer.observe(typingRef.current);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="main-page-wrap">
      <section className="hero-section">
        <div className="hero-content">
          <div className="main-ment">운동, 더 이상 혼자 하지 마세요.</div>
          <div className="main-ment">핏허브에서 나만의 피트니스 루틴을</div>
          <div className="main-ment">기록하고 성장하세요.</div>
          <ul className="features">
            <li>🏋️ 루틴 기반 운동 기록</li>
            <li>📊 내 피트니스 히스토리 시각화</li>
            <li>💬 커뮤니티에서 운동 경험 공유 및 소통</li>
            <li>🛒 운동 용품 마켓 연동</li>
          </ul>
          <button className="start-btn" onClick={nowStart}>
            지금 시작하기
          </button>
        </div>
        <div className="hero-image">
          <img src="/image/main-img.png" alt="피트니스 모델" />
        </div>
      </section>

      <section className="feature-slide-section">
        <h2>지금, 이런 기능을 이용할 수 있어요!</h2>
        <IntroSlider />
      </section>
      <section className="closing-section" ref={typingRef}>
        <TypingText
          text={`핏허브는 당신의 운동을 ‘습관’으로 바꿉니다.\n\n단순한 운동 기록을 넘어, 성장의 여정을 함께합니다.`}
          speed={100}
          start={startTyping}
        />
      </section>
    </div>
  );
};

export default Main;
