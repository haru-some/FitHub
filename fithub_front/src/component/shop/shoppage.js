import React, { useRef, useState } from "react";
import "./admin.css";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";
import TextEditor from "../utils/TextEditor";
import axios from "axios";

const AdminGoods = () => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const { goodsNo } = useParams(); // URL에서 goodsNo 가져오기
  const [activeTab, setActiveTab] = useState("상품정보");
  const navigate = useNavigate();

  const [showUrl, setShowUrl] = useState(null);
  const [goodsName, setGoodsName] = useState(""); // 사용자가 입력할 제목
  const [goodsExpl, setGoodsExpl] = useState(""); // 상품 설명
  const [goodsUrl, setGoodsUrl] = useState(null); // 썸네일 파일
  const [goodsPrice, setGoodsPrice] = useState(""); // 총 가격
  const [goodsStock, setGoodsStock] = useState(""); // 상품 수량
  const [goodsFile, setGoodsFile] = useState(null); // 선택된 파일
  const [goodsCategory, setGoodsCategory] = useState(""); // 상품 카테고리

  const urlRef = useRef(null); // 썸네일 선택 참조
  const fileInputRef = useRef(null); // 파일 선택 참조

  const submit = () => {
    const form = new FormData();
    form.append("goodsName", goodsName);
    form.append("goodsPrice", goodsPrice);
    form.append("goodsExpl", goodsExpl);
    if (goodsUrl) {
      form.append("goodsImg", goodsUrl); // 썸네일 이미지 추가
    }
    form.append("goodsStock", goodsStock);
    form.append("goodsCategory", goodsCategory); // 카테고리

    if (goodsFile) {
      form.append("goodsFile", goodsFile); // 업로드한 파일 추가
    }

    axios
      .post(`${backServer}/goods`, form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
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

  const changeUrl = (e) => {
    const files = e.target.files;
    if (files.length !== 0) {
      setGoodsUrl(files[0]); // 썸네일 파일 상태 설정

      // 화면 미리보기 설정
      const reader = new FileReader();
      reader.readAsDataURL(files[0]);
      reader.onloadend = () => {
        setShowUrl(reader.result); // 미리보기 상태 설정
      };
    } else {
      setGoodsUrl(null);
      setShowUrl(null);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setGoodsFile(file); // 선택된 파일 상태 설정
      console.log("파일이 선택되었습니다:", file);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "상품정보":
        return (
          <div>
            <h3>상품 정보</h3>
            <div>
              <button onClick={() => urlRef.current.click()}>
                썸네일 선택
              </button>
              <input
                ref={urlRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={changeUrl}
              />
              {showUrl && <img src={showUrl} alt="미리보기" />}
            </div>
            <div>
              <h2>상품 설명</h2>
              <TextEditor data={goodsExpl} setData={setGoodsExpl} />
              <input
                ref={fileInputRef}
                type="file"
                accept="*/*" // 모든 파일 형식 수용
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
              <button onClick={() => fileInputRef.current.click()}>
                첨부 파일 선택
              </button>
              {goodsFile && <p>선택된 파일: {goodsFile.name}</p>}{" "}
              {/* 선택된 파일 이름 표시 */}
            </div>
          </div>
        );
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

  return (
    <div className="shop-detail-frm-wrap">
      <div className="main-detail">
        <div className="goods-image">
          <div
            className="goods-thumb-wrap"
            onClick={() => urlRef.current.click()}
            style={{ cursor: "pointer" }}
          >
            {showUrl ? (
              <img src={showUrl} alt="썸네일" />
            ) : (
              <img src="/image/default_img.png" alt="기본 썸네일" />
            )}
            <input
              ref={urlRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }} // 파일 입력 요소 숨김
              onChange={changeUrl} // 썸네일 선택 시 처리
            />
          </div>
        </div>
        <div className="goods-info">
          <div className="ex-box">
            <input
              type="text"
              value={goodsName}
              onChange={(e) => setGoodsName(e.target.value)}
              placeholder="상품 제목을 입력하세요"
              style={{
                color: "black",
                fontSize: "24px",
                width: "100%",
                marginBottom: "10px",
              }}
            />
            <div>
              <h2>상품 설명</h2>
              <TextEditor data={goodsExpl} setData={setGoodsExpl} />
              <h2>첨부 파일</h2>
              <button onClick={() => fileInputRef.current.click()}>
                첨부 파일 선택
              </button>
              {goodsFile && <p>선택된 파일: {goodsFile.name}</p>}
            </div>
          </div>
          <div className="options-and-price">
            <div className="options">
              <select
                value={goodsCategory}
                onChange={(e) => setGoodsCategory(e.target.value)}
                className="options-select"
              >
                <option value="">카테고리를 선택하세요</option>
                {[
                  { label: "보충제", value: "1" },
                  { label: "비타민", value: "2" },
                  { label: "스포츠웨어(남)", value: "3" },
                  { label: "스포츠웨어(여)", value: "4" },
                  { label: "운동기구", value: "5" },
                ].map((option) => (
                  <option key={option.label} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="price-box">
            <h2>
              수량:
              <input
                type="text"
                value={goodsStock}
                onChange={(e) => setGoodsStock(Number(e.target.value))}
                style={{ margin: "0 5px", width: "50px" }}
              />
              개
            </h2>

            <h2>
              총 가격:
              <input
                type="text"
                value={goodsPrice}
                onChange={(e) => setGoodsPrice(Number(e.target.value))}
                style={{ margin: "0 5px", width: "100px" }}
              />
              원
            </h2>
          </div>
          <div className="goods-buy">
            <button onClick={submit}>상품 등록하기</button>
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

export default AdminGoods;
