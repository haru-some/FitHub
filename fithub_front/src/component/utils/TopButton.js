import React, { useEffect, useState } from "react";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import "./topbutton.css";
import ContactSupportIcon from "@mui/icons-material/ContactSupport";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { memberState } from "./RecoilData";

const TopButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();
  const memberInfo = useRecoilValue(memberState);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      {memberInfo && memberInfo.memberLevel !== 1 && (
        <button
          className={`middle-bottom visible ${
            memberInfo.memberLevel === 2 ? "bottom" : ""
          }`}
          onClick={(e) => navigate("/chat")}
        >
          <ContactSupportIcon />
        </button>
      )}
      <button
        className={`top-button ${isVisible ? "visible" : ""} ${
          memberInfo?.memberLevel === 1 ? "bottom" : "top"
        }`}
        onClick={scrollToTop}
        aria-label="Scroll to top"
      >
        <ArrowUpwardIcon style={{ color: "white" }} />
      </button>
    </>
  );
};

export default TopButton;
