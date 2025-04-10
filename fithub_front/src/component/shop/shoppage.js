import React, { useEffect, useState } from "react";
import { Modal, Button, Box } from "@mui/material";
import axios from "axios";
import { useRecoilState, useRecoilValue } from "recoil";
import { memberState, isLoginState } from "../utils/RecoilData";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import "./shopDetail.css";

const ShopDetail = () => {
  const { goodsNo } = useParams(); // URL에서 goodsNo 가져오기
  const [activeTab, setActiveTab] = useState("상품정보");
  const [quantity, setQuantity] = useState(1);
  const backServer = process.env.REACT_APP_BACK_SERVER;

  const [memberInfo] = useRecoilState(memberState);
  const isLogin = useRecoilValue(isLoginState);
  const [goods, setGoods] = useState(null);
  const [reviews, setReviews] = useState([]); // 리뷰 목록 상태 추가

  // 상품 데이터 가져오기
  useEffect(() => {
    axios
      .get(`${backServer}/goods/${goodsNo}`)
      .then((res) => {
        setGoods(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [goodsNo, backServer]);

  // 리뷰 데이터 가져오기
  useEffect(() => {
    if (goods && goods.goodsNo) {
      // 상품이 존재할 때만 리뷰 가져오기
      axios
        .get(`${backServer}/goods/review/${goods.goodsNo}`)
        .then((res) => {
          setReviews(res.data); // 받은 리뷰 리스트를 상태로 설정
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [goods, backServer]); // goods가 업데이트될 때만 실행

  const renderContent = () => {
    switch (activeTab) {
      case "상품정보":
        return (
          <div>
            <div style={{ textAlign: "center" }}>상품정보</div>
            {/* 상품 정보 렌더링 */}
          </div>
        );
      case "리뷰":
        return (
          <div>
            <h2>상품 리뷰</h2>
            {reviews.length > 0 ? (
              <ul>
                {reviews.map((review, index) => (
                  <li key={"review-" + index}>
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
                    <p>{review.comment}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>작성된 리뷰가 없습니다.</p>
            )}
          </div>
        );
      case "배송/결제":
        return <div>배송 정보</div>;
      case "반품/교환":
        return <div>반품 정보</div>;
      default:
        return null;
    }
  };

  if (!goods) {
    return <div>로딩 중...</div>; // 상품 데이터가 불러와지지 않았다면 로딩 화면 제공
  }

  return (
    <div className="shop-detail-wrap">
      <div className="main-detail">
        <div className="goods-image">
          <img
            src={
              goods.goodsImage
                ? `${backServer}/shop/thumb/${goods.goodsImage}`
                : "/image/default_img.png"
            }
            alt={goods.goodsName}
          />
        </div>
        <div className="goods-info">
          <h1>{goods.goodsName}</h1>
          <h3>{goods.goodsPrice.toLocaleString()}원</h3>
          <div className="quantity-controls">
            <button
              onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}
            >
              -
            </button>
            <span>{quantity}</span>
            <button onClick={() => setQuantity(quantity + 1)}>+</button>
          </div>
          <div className="goods-buy">
            <button onClick={plusCart}>장바구니</button>
            <button onClick={doBuy}>구매하기</button>
          </div>
        </div>
      </div>

      <div className="tabs">
        {["상품정보", "리뷰", "배송/결제", "반품/교환"].map((tab) => (
          <button
            key={tab}
            className={activeTab === tab ? "active" : ""}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="tab-content">{renderContent()}</div>
    </div>
  );
};

export default ShopDetail;
