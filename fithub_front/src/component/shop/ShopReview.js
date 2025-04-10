import { useEffect, useState } from "react";
import { Modal, Button, Box } from "@mui/material";
import { useRecoilState, useRecoilValue } from "recoil";
import { memberState, isLoginState } from "../utils/RecoilData";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import "./shopDetail.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ReviewModal = ({ isOpen, onClose, onSubmit, goodsNo, goodsName }) => {
  const [memberInfo, setMemberInfo] = useRecoilState(memberState);
  const isLogin = useRecoilValue(isLoginState);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const reviewSubmit = (e) => {
    e.preventDefault();
    onSubmit({ rating, comment }); // 데이터 전송
    setRating(0); // 초기화
    setComment(""); // 초기화
    onClose();

    const reviewData = {
      goodsNo: goodsNo,
      goodsName: goodsName,
      memberId: memberInfo.memberId,
      reContent: comment,
      reStar: rating,
    };

    console.log(reviewData);

    axios
      .post(
        `${process.env.REACT_APP_BACK_SERVER}/goods/review/add/`,
        reviewData
      )
      .then((res) => {
        console.log("리뷰 제출 성공:", res.data);
        onSubmit(reviewData); // 상태 업데이트
        setRating(0); // 초기화
        setComment(""); // 초기화
        onClose();
      })
      .catch((err) => {
        console.log("리뷰 제출 실패:", err);
      });
  };

  ////////////////////////////////////////////////////////////////////////////// 모달 창
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
  const navigate = useNavigate();
  const [memberInfo, setMemberInfo] = useRecoilState(memberState);
  const isLogin = useRecoilValue(isLoginState);
  const [activeTab, setActiveTab] = useState("작성가능한 리뷰");
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태 추가
  const [review, setReview] = useState([]); // 리뷰 목록 상태 추가
  const [reviews, setReviews] = useState([]); // 리뷰 목록 상태 추가
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const [sell, setSell] = useState([]);
  const [goodsNo, setGoodsNo] = useState(null);
  const [goodsName, setGoodsName] = useState(null);

  const recordReview = (newReview) => {
    setReviews([...reviews, newReview]); // 새로운 리뷰 추가
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
  }, [setSell]);

  useEffect(() => {
    axios
      .get(`${backServer}/goods/sell/myreview/${memberInfo.memberId}`)
      .then((res) => {
        console.log(res.data);
        setReview(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  ///////////////////////////////////////////////////////////////////////// 리뷰 탭
  const renderContent = () => {
    switch (activeTab) {
      case "작성가능한 리뷰":
        return (
          <div>
            <h2>작성 가능한 리뷰</h2>
            {sell && sell.length > 0 ? (
              sell.map((item, index) => (
                <div className="review-item" key={"sell-" + index}>
                  <div className="product-info">
                    <div>상품명: {item.goodsName}</div>
                    <div>상품번호 :{item.sellNo}</div>
                    <div>
                      상품 총 가격 : {item.goodsTotalPrice} 원 (수량 :{" "}
                      {item.goodsEa})
                    </div>
                    <div className="goods-no">{item.goodsNo}</div>
                  </div>
                  <button
                    className="write-review-button"
                    onClick={() => {
                      setGoodsNo(item.goodsNo);
                      setIsModalOpen(true);
                      setGoodsName(item.goodsName);
                    }}
                  >
                    리뷰 작성
                  </button>
                </div>
              ))
            ) : (
              <p>구매한 상품이 없습니다.</p>
            )}
          </div>
        );
      case "내가 작성한 리뷰":
        return (
          <div>
            <h2>내가 작성한 리뷰</h2>
            {review.length > 0 ? (
              <ul>
                {review.map((review, index) => (
                  <li
                    key={"review-" + index}
                    onClick={() => {
                      navigate(`/shop/detail/${review.goodsNo}`);
                    }}
                  >
                    <div>{review.goodsName}</div>

                    <div>
                      <div className="my-star-point">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span key={star}>
                            {star <= review.reStar ? (
                              <StarIcon />
                            ) : (
                              <StarBorderIcon />
                            )}
                          </span>
                        ))}
                      </div>
                      <div>{review.reDate}</div>
                    </div>
                    <div>{review.reContent}</div>
                  </li>
                ))}
              </ul>
            ) : (
              <p>작성된 리뷰가 없습니다.</p>
            )}
          </div>
        );
      default:
        return null;
    }
  };
  ////////////////////////////////////////////////////////////////////////// 화면구현
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
        goodsNo={goodsNo}
        goodsName={goodsName}
      />
    </div>
  );
};

export default ShopReview;
