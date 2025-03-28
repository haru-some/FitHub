import React from "react";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import "./default.css";
import { Link, useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();
  return (
    <footer className="footer">
      <div className="footer-wrap">
        <div className="footer-top">
          <div className="footer-logo">
            <img src="/image/Fithub_logo.png" alt="FitHub Logo" />
            <span>fitHub</span>
          </div>
          <div className="footer-info">
            <div className="info-block">
              <p className="label">Contact Us</p>
              <p className="value">+82 10-5012-7769</p>
            </div>
            <div className="info-block">
              <p className="label">Customer Service Hours : Mon–Fri</p>
              <p className="value">9am—6pm</p>
            </div>
            <div className="info-block">
              <p className="label">Location</p>
              <p className="value">서울특별시 영등포구 당산동6가 311-1</p>
            </div>
            <div className="info-block">
              <p className="label">Email</p>
              <p className="value">fithubcs@fithub.co.kr</p>
            </div>
          </div>
        </div>
        <div className="footer-middle">
          <p className="copyright">© 2025 — FitHub Copyright</p>
        </div>
        <div className="footer-bottom">
          <div className="footer-explore" onClick={() => navigate("/myfit")}>
            <div className="explore-text">
              <p>Explore</p>
              <p>Your Fitness</p>
            </div>
            <div className="explore-arrow">
              <Link to="/myfit">
                <ArrowOutwardIcon sx={{ fontSize: 32, color: "white" }} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
