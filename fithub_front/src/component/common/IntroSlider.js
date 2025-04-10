import "./main.css";
import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
const slides = [
  {
    ETitle: "Plan your own trip",
    EDescription: "Share your itinerary and travel together",
    KTitle: "나만의 여행을 계획하세요",
    KDescription: "여행 일정을 공유하고 함께 할 수 있어요",
    image: "/image/default_img.png",
  },
  {
    ETitle: "Have a place you’ve always wanted to visit?",
    EDescription: "Search and discover the information you need",
    KTitle: "꼭 가보고 싶은 곳이 있었나요?",
    KDescription: "검색을 통해 원하시는 정보를 찾으세요",
    image: "/image/default_img.png",
  },
  {
    ETitle: "From cozy stays and more",
    EDescription: "Share honest reviews with other travelers",
    KTitle: "편하게 머물 수 있는 공간들부터",
    KDescription: "여러분들의 솔직한 평가를 나누세요",
    image: "/image/default_img.png",
  },
  {
    ETitle: "Fun activities, tailored for you",
    EDescription: "We provide recommendations just for you",
    KTitle: "재미있는 즐길거리까지",
    KDescription: "여러분이 원한 맞춤 추천을 제공합니다",
    image: "/image/default_img.png",
  },
  {
    ETitle: "Chat in real time and share reviews",
    EDescription: "Plan your trip with friends, comfortably",
    KTitle: "실시간 채팅과 다양한 리뷰와 함께",
    KDescription: "친구들과 편하게 여행을 계획해보세요",
    image: "/image/default_img.png",
  },
];
const IntroSlider = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  // 자동 슬라이드 전환 (5초 간격)
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);
  const handleDotClick = (index) => {
    setActiveIndex(index);
  };
  return (
    <div className="intro-wrap">
      <div className="intro">
        {/* Left text section */}
        <div className="intro-text">
          <div className="intro-title">
            <h2>{slides[activeIndex].KTitle}</h2>
            <h2>{slides[activeIndex].ETitle}</h2>
          </div>
          <div className="intro-description">
            <p>{slides[activeIndex].KDescription}</p>
            <p>{slides[activeIndex].EDescription}</p>
          </div>
          <div className="intro-btn-wrap">
            {activeIndex === 4 && (
              <button className="btn-primary">시작하기</button>
            )}
          </div>
        </div>
        {/* Right image section */}
        <div className="intro-img">
          <img
            src={slides[activeIndex].image}
            alt="slide"
            style={{ width: "100%", borderRadius: "8px", float: "right" }}
          />
        </div>
      </div>
      {/* 하단 원형 페이지네이션 */}
      <Box sx={{ mt: 4, display: "flex", justifyContent: "center", gap: 1 }}>
        {slides.map((_, index) => (
          <Box
            key={index}
            onClick={() => handleDotClick(index)}
            sx={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              backgroundColor: index === activeIndex ? "#2ECC71" : "#888",
              cursor: "pointer",
              transition: "background-color 0.3s",
            }}
          />
        ))}
      </Box>
    </div>
  );
};
export default IntroSlider;
