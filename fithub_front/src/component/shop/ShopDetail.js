import React, { useEffect, useState, useContext } from "react";
import "./shopDetail.css";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Info } from "@mui/icons-material";
// import { ShopCart } from "./ShopCart";

import { useRecoilState, useRecoilValue } from "recoil";
import { memberState, isLoginState } from "../utils/RecoilData";

const ShopDetail = () => {
  const { goodsNo } = useParams(); // URL에서 goodsNo 가져오기
  const [goods, setGoods] = useState(null); // 상품 정보를 저장할 상태
  const [cart, setCart] = useState(null); // 상품 정보를 저장할 상태
  const [activeTab, setActiveTab] = useState("상품정보");
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();
  const backServer = process.env.REACT_APP_BACK_SERVER;

  const [comment, setComment] = useState("");
  const [commentsList, setCommentsList] = useState([]);
  const [rating, setRating] = useState(0);
  const [reviews, setReviews] = useState([]);
  // const { addToCart } = useContext(ShopCart);

  const [memberInfo, setMemberInfo] = useRecoilState(memberState);
  const isLogin = useRecoilValue(isLoginState);

  // 상품 데이터 가져오기
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACK_SERVER}/goods/${goodsNo}`)
      .then((res) => {
        console.log(res);
        setGoods(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [goodsNo]);

  const handleIncrease = () => {
    setQuantity(quantity + 1);
  };
  const handleDecrease = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };
  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const submitComment = () => {
    if (comment.trim()) {
      setCommentsList([...commentsList, comment]);
      setComment("");
    }
  };

  const submitReview = () => {
    if (comment.trim() && rating > 0) {
      setReviews([...reviews, { comment, rating }]);
      setComment("");
      setRating(0);
    }
  };

  const renderStars = () => {
    return [1, 2, 3, 4, 5].map((num) => (
      <span
        key={num}
        onClick={() => setRating(num)}
        style={{
          cursor: "pointer",
          color: num <= rating ? "gold" : "gray",
        }}
      >
        ★
      </span>
    ));
  };

  const renderContent = () => {
    switch (activeTab) {
      case "상품정보":
        return (
          <div>
            <div style={{ textAlign: "center" }}>상품정보</div>
            <div className="goods-info-wrap">
              <table className="tbl" border="1" style={{ width: "100%" }}>
                <tbody>
                  {goods.goodsInfo1 ? (
                    <tr>
                      <th style={{ width: "25%" }}>{goods.goodsInfo1}</th>
                      <td style={{ width: "25%" }}>{goods.goodsDetail1}</td>
                      <th style={{ width: "25%" }}>{goods.goodsInfo2}</th>
                      <td style={{ width: "25%" }}>{goods.goodsDetail2}</td>
                    </tr>
                  ) : (
                    ""
                  )}
                  {goods.goodsInfo3 ? (
                    <tr>
                      <th style={{ width: "25%" }}>{goods.goodsInfo3}</th>
                      <td style={{ width: "25%" }}>{goods.goodsDetail3}</td>
                      <th style={{ width: "25%" }}>{goods.goodsInfo4}</th>
                      <td style={{ width: "25%" }}>{goods.goodsDetail4}</td>
                    </tr>
                  ) : (
                    ""
                  )}

                  {goods.goodsInfo5 ? (
                    <tr>
                      <th style={{ width: "25%" }}>{goods.goodsInfo5}</th>
                      <td style={{ width: "25%" }}>{goods.goodsDetail5}</td>
                      <th style={{ width: "25%" }}>{goods.goodsInfo6}</th>
                      <td style={{ width: "25%" }}>{goods.goodsDetail6}</td>
                    </tr>
                  ) : (
                    ""
                  )}
                </tbody>
              </table>
            </div>
            <div className="goods-image">
              <img
                src={
                  goods.goodsDetailImg
                    ? `${backServer}/shop/detail/${goods.goodsDetailImg}`
                    : "" // 기본 이미지 처리
                }
              />
            </div>
          </div>
        );
      case "리뷰":
        return (
          <div>
            <h2>리뷰 정보</h2>
            <div>{renderStars()}</div>
            <input
              type="text"
              value={comment}
              onChange={handleCommentChange}
              placeholder="코멘트를 입력하세요"
              style={{ width: "80%", padding: "5px", marginTop: "10px" }}
            />
            <button
              onClick={submitReview}
              style={{ padding: "5px 10px", marginLeft: "10px" }}
            >
              제출
            </button>
            <div style={{ marginTop: "20px" }}>
              {reviews.map((review, index) => (
                <div
                  key={index}
                  style={{ borderTop: "1px solid #ccc", padding: "10px 0" }}
                >
                  <div>
                    {"★".repeat(review.rating)}
                    {"☆".repeat(5 - review.rating)}
                  </div>
                  <div>{review.comment}</div>
                </div>
              ))}
            </div>
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

  const plusCart = () => {
    const cartItem = {
      // memberId: memberInfo.memberNo,
      goodsNo: goods.goodsNo,
      goodsName: goods.cartName,
      goodsImage: goods.cartImage,
      // goodsPrice: goods.cartPrice,
      // quantity: cart.goodsEa, // 수량
    };

    axios.post(`${backServer}/goods/cart/add`, cartItem).then((res) => {
      Swal.fire({
        icon: "success",
        title: "장바구니에 보관하였습니다.",
        showConfirmButton: false,
        timer: 2000,
      }).catch((err) => {
        console.error("Error adding to cart:", err);
        Swal.fire({
          icon: "error",
          title: "장바구니에 추가하는 데 실패했습니다.",
          text: "서버로부터 응답을 받을 수 없습니다.",
        });
      });
    });
  };

  const doBuy = () => {
    Swal.fire({
      title: "구매할까요?",
      showCancelButton: true,
      confirmButtonText: "예",
      cancelButtonText: "아니오",
      confirmButtonColor: "#4caf50",
      cancelButtonColor: "#8CCC8F",
    }).then((result) => {
      if (result.isConfirmed) {
        navigate(`/shop/pay/${goods.goodsNo}`, {
          state: { quantity },
        });
      } else {
        Swal.fire({
          icon: "info",
          title: "구매가 취소되었습니다.",
          showConfirmButton: false,
          cancelButtonColor: "#8CCC8F",
          timer: 2000,
        });
      }
    });
  };

  // 로딩 중 또는 데이터가 없는 경우 처리
  if (!goods) {
    return <div>로딩 중...</div>; // 상품 데이터가 로드되지 않았을 경우
  }
  return (
    <div className="shop-detail-wrap">
      <div className="main-detail">
        <div className="goods-image">
          <img
            src={
              goods.goodsImage
                ? `${backServer}/shop/thumb/${goods.goodsImage}`
                : "/image/default_img.png" // 기본 이미지 처리
            }
            alt={goods.goodsName} // 기본 상품명 처리
          />
        </div>
        <div className="goods-info">
          <div className="ex-box">
            <h1>{goods.goodsName}</h1>
            <div dangerouslySetInnerHTML={{ __html: goods.goodsExplain }} />
          </div>
          <h3>{goods.goodsPrice.toLocaleString()}원</h3>

          <div className="price-box">
            <div className="quantity-controls">
              <button onClick={handleDecrease}>-</button>
              <span>{quantity}</span>
              <button onClick={handleIncrease}>+</button>
            </div>
            <h2>총 가격: {(goods.goodsPrice * quantity).toLocaleString()}원</h2>
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
