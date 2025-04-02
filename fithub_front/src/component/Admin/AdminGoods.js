import React, { useEffect, useRef, useState } from "react";
import "./admin.css";
import Swal from "sweetalert2";
import { Form, useNavigate, useParams } from "react-router-dom";
import TextEditor from "../utils/TextEditor";
import axios from "axios";

const AdminGoods = () => {
  const { goodsNo } = useParams(); // URL에서 goodsNo 가져오기
  const [activeTab, setActiveTab] = useState("상품정보");
  const navigate = useNavigate();

  const [goods, setGoods] = useState({
    goodsName: "상품 제목을 기입하세요",
    goodsPrice: 10000,
    goodsExpl: "상품 설명을 기입하세요.",
    goodsUrl: "/image/default_img.png",
  });

  //제목, 썸네일, 내용, 첨부파일>> 글작성을 위해서 사용자에게 받아야하는 정보
  const [goodsName, setGoodsName] = useState(""); // 사용자가 입력 할 제목
  const [thumbnail, setThumbnail] = useState(null); // 썸네일 첨부파일 저장용 state
  const [goodsFile, setGoodsFile] = useState([]); // 첨부파일(파일여러개일 수 있으므로 배열로..)
  const [goodsExpl, setGoodsExpl] = useState(""); // 사용자가 입력 할 제목
  const [price, setPrice] = useState(goods.goodsPrice);
  const [description, setDescription] = useState(goods.goodsExpl); // 설명 상태 추가
  const urlRef = useRef(null);

  const submit = () => {
    const form = new FormData();
    form.append("goodsNo", goods.goodsNo);
    form.append("goodsName", goods.goodsName);
    form.append("goodsPrice", goods.goodsPrice);
    form.append("goodsExpl", goods.goodsExpl);
    form.append("goodsUrl", goods.goodsUrl);
    form.append("goodsFile", goods.goodsFile);

    const backServer = process.env.REACT_APP_BACK_SERVER;

    axios
      .post(`${backServer}/goods`, form, {
        headers: {
          "Content-Type": "multipart/form-data",
          processData: false,
        },
      })
      .then((res) => {
        console.log(res);
        Swal.fire({
          icon: "success",
          title: "상품이 등록되었습니다!",
          showConfirmButton: false,
          timer: 1500,
        });
        navigate("/admin");
      })
      .catch((err) => {
        console.error("상품 등록 실패:", err);
        Swal.fire({
          icon: "error",
          title: "상품 등록 실패",
          text: err.message,
        });
      });
  };

  const renderContent = () => {
    switch (activeTab) {
      case "상품정보":
        return <div>상품 정보</div>;
      case "리뷰":
        return <div>(예시)리뷰 정보 탭입니다.</div>;
      case "배송/결제":
        return <div>(예시)배송 정보 탭입니다.</div>;
      case "반품/교환":
        return <div>(예시)반품 정보 탭입니다.</div>;
      default:
        return null;
    }
  };

  const plusCart = () => {
    Swal.fire({
      icon: "info",
      title: "예시 버튼입니다..",
      showConfirmButton: false,
      timer: 1000,
    });
  };

  const doBuy = () => {
    Swal.fire({
      icon: "info",
      title: "예시 버튼입니다..",
      showConfirmButton: false,
      timer: 1000,
    });
  };

  return (
    <div className="shop-detail-frm-wrap">
      <div className="main-detail">
        <div className="goods-image">
          <img
            src={goods.goodsUrl || "/image/default_img.png"}
            onClick={() => {
              urlRef.current.click();
            }}
          />
        </div>
        <div className="goods-info">
          <div className="ex-box">
            <input
              type="text"
              value={goods.goodsName}
              onChange={(e) =>
                setGoods({ ...goods, goodsName: e.target.value })
              }
              style={{
                color: "black",
                fontSize: "24px",
                width: "100%",
                marginBottom: "10px",
              }}
              placeholder="상품 제목을 입력하세요"
            />
            <div>
              <h2>상품 설명</h2>
              <TextEditor />
            </div>
          </div>

          <div className="price-box">
            <h2>
              총 가격:
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                style={{ margin: "0 5px", width: "100px" }}
              />
              원
            </h2>
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
      <button type="button" className="button" onClick={submit}>
        상품 등록하기
      </button>
    </div>
  );
};

export default AdminGoods;
