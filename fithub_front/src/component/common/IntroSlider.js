import "./main.css";
import React, { useEffect, useRef, useState } from "react";
import { Box } from "@mui/material";
const slides = [
  {
    ETitle: "Date-based workout routine and log management",
    EDescription:
      "Select a date to log your weekly routine and completed workouts.",
    KTitle: "날짜별로 운동 루틴과 기록 관리",
    KDescription:
      "날짜를 선택하여 요일별 루틴과 완료한 운동을 기록할 수 있어요.",
    image: "/image/calendar.png",
  },
  {
    ETitle: "Log completed workouts",
    EDescription: "Log the time and details of your completed workouts.",
    KTitle: "완료한 운동을 기록",
    KDescription: "완료한 운동의 시간과 내용을 기록해보세요.",
    image: "/image/record.png",
  },
  {
    ETitle: "Set weekly routines",
    EDescription: "Customize your routine for each day of the week.",
    KTitle: "요일별 루틴 설정",
    KDescription: "요일별로 루틴을 설정할 수 있어요.",
    image: "/image/routine.png",
  },
  {
    ETitle: "Workout Summary & Statistics",
    EDescription: "Check the summary and statistics of your logged workouts.",
    KTitle: "운동 요약&통계",
    KDescription: "기록된 운동의 요약과 통계를 확인해보세요.",
    image: "/image/sum.png",
  },
  {
    ETitle: "Freely interact with other members",
    EDescription: "Use the community and DMs to interact with fellow members.",
    KTitle: "회원간 자유로운 소통",
    KDescription: "커뮤니티와 DM을 활용하여 다른 회원과 소통해보세요.",
    image: "/image/dm.png",
  },
];
const IntroSlider = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const intervalRef = useRef(null); // interval을 저장할 ref

  const startAutoSlide = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
  };

  useEffect(() => {
    startAutoSlide(); // 최초 실행
    return () => clearInterval(intervalRef.current); 
  }, []);

  const handleDotClick = (index) => {
    setActiveIndex(index);
    startAutoSlide(); 
  };
  return (
    <div className="intro-wrap">
  <div
    className="intro-top-wrap"
    style={{
      width: `${slides.length * 100}%`, 
      transform: `translateX(-${activeIndex * (100 / slides.length)}%)`,
    }}
  >
    {slides.map((slide, index) => (
      <div className="intro" key={index}>
        <div className="intro-item">
          <div className="intro-text">
            <div className="intro-title">
              <h2>{slide.KTitle}</h2>
              <h2>{slide.ETitle}</h2>
            </div>
            <div className="intro-description">
              <p>{slide.KDescription}</p>
              <p>{slide.EDescription}</p>
            </div>
          </div>
        </div>
        <div className="intro-img">
          <img src={slide.image} alt="slide" />
        </div>
      </div>
    ))}
  </div>

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
