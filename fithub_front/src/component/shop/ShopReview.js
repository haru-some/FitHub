import { useEffect, useState } from "react";
import { Modal, Button, Box } from "@mui/material"; // MUI에서 필요한 컴포넌트 임포트
import { useRecoilState, useRecoilValue } from "recoil";
import { memberState, isLoginState } from "../utils/RecoilData";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import "./shopDetail.css";
import MemberInfo from "../member/MemberInfo";
import axios from "axios";

const ReviewModal = ({ isOpen, onClose, onSubmit }) => {
  const [memberInfo, setMemberInfo] = useRecoilState(memberState);
  const isLogin = useRecoilValue(isLoginState);
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const [sell, setSell] = useState(null);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const reviewSubmit = (e) => {
    e.preventDefault();
    onSubmit({ rating, comment }); // 데이터 전송
    setRating(0); // 초기화
    setComment(""); // 초기화
    onClose();
  };

  useEffect(() => {
    axios
      .get(`${backServer}/goods/sell/review/${memberInfo.memberNo}`)
      .then((res) => {
        console.log(res.data);
        setSell(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box className="review-modal">
        <h2>리뷰 쓰기</h2>
        <form className="review-modal-wrap" onSubmit={reviewSubmit}>
          <div>
            <label>평점: </label>
            <div className="star-point">
              {[1, 2, 3, 4, 5].map((star, index) => (
                <div
                  key={"star -" + index}
                  onClick={() => setRating(star)}
                  style={{
                    cursor: "pointer",
                    color: star <= rating ? "#FFD700" : "#ccc",
                    display: "inline-block",
                    margin: "0 2px",
                  }}
                >
                  {star <= rating ? <StarIcon /> : <StarBorderIcon />}
                </div>
              ))}
            </div>
          </div>
          <div className="modal-content">
            <label>상품 사용은 어땠나요?</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
            />
          </div>
          <Button type="submit">확인</Button>
          <Button type="button" onClick={onClose}>
            닫기
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

const ShopReview = () => {
  const [memberInfo, setMemberInfo] = useRecoilState(memberState);
  const isLogin = useRecoilValue(isLoginState);
  const [activeTab, setActiveTab] = useState("작성가능한 리뷰");
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태 추가
  const [reviews, setReviews] = useState([]); // 리뷰 목록 상태 추가

  const recordReview = (newReview) => {
    setReviews([...reviews, newReview]); // 새로운 리뷰 추가
  };

  const renderContent = () => {
    switch (activeTab) {
      case "작성가능한 리뷰":
        return (
          <div>
            <div>작성가능한 리뷰</div>
            <div className="review-item">
              <img src="product_image_url" alt="상품 이미지" />
              <div className="product-info">
                <span>상품명 : </span>
                <p>주문번호: 7010125031110061253</p>
              </div>
              <button
                className="write-review-button"
                onClick={() => setIsModalOpen(true)}
              >
                리뷰 작성
              </button>
            </div>
          </div>
        );
      case "내가 작성한 리뷰":
        return (
          <div>
            <h2>내가 작성한 리뷰</h2>
            {reviews.length === 0 ? (
              <p>작성한 리뷰가 없습니다.</p>
            ) : (
              <ul>
                {reviews.map((review, index4) => (
                  <li key={"review -" + index4}>
                    <div className="my-star-point">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star}>
                          {star <= review.rating ? (
                            <StarIcon />
                          ) : (
                            <StarBorderIcon />
                          )}
                        </span>
                      ))}
                    </div>
                    <br />
                    <span> </span>
                    {review.comment}
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="Myreview-wrap">
      <div className="review-tabs">
        <div className="tabs">
          {["작성가능한 리뷰", "내가 작성한 리뷰"].map((tab, index) => (
            <button
              key={"tab -" + index}
              className={activeTab === tab ? "active" : ""}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="tab-content">{renderContent()}</div>
      </div>
      <ReviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={recordReview}
      />
    </div>
  );
};

export default ShopReview;
