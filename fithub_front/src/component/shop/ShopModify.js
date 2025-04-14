import React, { useEffect, useRef, useState } from "react";

import Swal from "sweetalert2";
import { data, Form, useNavigate, useParams } from "react-router-dom";
import TextEditor from "../utils/TextEditor";
import axios from "axios";
import { Category } from "@mui/icons-material";

const ShopModify = () => {
  const backServer = process.env.REACT_APP_BACK_SERVER;

  const { goodsNo } = useParams(); // Image에서 goodsNo 가져오기
  const [activeTab, setActiveTab] = useState("상품정보");
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef();
  const navigate = useNavigate();

  const [goods, setGoods] = useState({});

  //제목, 썸네일, 내용, 첨부파일>> 글작성을 위해서 사용자에게 받아야하는 정보
  const [showImage, setShowImage] = useState(null);
  const [showDetailImage, setShowDetailImage] = useState(null);
  const [goodsName, setGoodsName] = useState(""); // 사용자가 입력 할 제목
  const [goodsExplain, setGoodsExplain] = useState(""); // 사용자가 입력 할 제목
  const [goodsPrice, setGoodsPrice] = useState("");
  const [goodsStock, setGoodsStock] = useState("");

  const [goodsDetailImg, setGoodsDetailImg] = useState(null); //상품 상세이미지

  const [goodsInfo1, setGoodsInfo1] = useState(""); //사용자가 입력할 필수 정보
  const [goodsDetail1, setGoodsDetail1] = useState(""); //사용자가 입력할 필수 정보
  const [goodsInfo2, setGoodsInfo2] = useState(""); //사용자가 입력할 필수 정보
  const [goodsDetail2, setGoodsDetail2] = useState(""); //사용자가 입력할 필수 정보
  const [goodsInfo3, setGoodsInfo3] = useState("");
  const [goodsDetail3, setGoodsDetail3] = useState("");
  const [goodsInfo4, setGoodsInfo4] = useState("");
  const [goodsDetail4, setGoodsDetail4] = useState("");
  const [goodsInfo5, setGoodsInfo5] = useState("");
  const [goodsDetail5, setGoodsDetail5] = useState("");
  const [goodsInfo6, setGoodsInfo6] = useState("");
  const [goodsDetail6, setGoodsDetail6] = useState("");

  const imageRef = useRef(null);
  const imageDetailRef = useRef(null);
  const [goodsImage, setGoodsImage] = useState(null); //상품이미지
  const { goodsImg, setGoodsImg } = useState("");
  const { detailImg, setDetailImg } = useState();
  const [goodsCategory, setGoodsCategory] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImageDetail, setSelectedImageDetail] = useState(null);
  const [existingGoodsImage, setExistingGoodsImage] = useState("");
  const [existingGoodsDetailImg, setExistingGoodsDetailImg] = useState("");

  const submit = () => {
    console.log(goodsImage);
    console.log(goodsDetailImg);
    /////////////////////////////////////////FORM////////////////////////////////////////////
    const form = new FormData();
    form.append("goodsNo", goodsNo);
    form.append("goodsName", goodsName);
    form.append("goodsPrice", goodsPrice);
    form.append("goodsExplain", goodsExplain);
    form.append("goodsStock", goodsStock);
    form.append("goodsCategory", goodsCategory);

    if (goodsImage) {
      form.append("goodsImg", goodsImage); // 새 상품 이미지가 있을 경우 추가
    } else {
      form.append("goodsImg", existingGoodsImage); // 기존 상품 이미지 사용
    }

    if (goodsDetailImg) {
      form.append("detailImg", goodsDetailImg); // 새 상세 이미지가 있을 경우 추가
    } else {
      form.append("detailImg", existingGoodsDetailImg); // 기존 상세 이미지 사용
    }

    if (goodsInfo1) {
      form.append("goodsInfo1", goodsInfo1);
      form.append("goodsDetail1", goodsDetail1);
    }
    if (goodsInfo2) {
      form.append("goodsInfo2", goodsInfo2);
      form.append("goodsDetail2", goodsDetail2);
    }
    if (goodsInfo3) {
      form.append("goodsInfo3", goodsInfo3);
      form.append("goodsDetail3", goodsDetail3);
    }
    if (goodsInfo4) {
      form.append("goodsInfo4", goodsInfo4);
      form.append("goodsDetail4", goodsDetail4);
    }
    if (goodsInfo5) {
      form.append("goodsInfo5", goodsInfo5);
      form.append("goodsDetail5", goodsDetail5);
    }
    if (goodsInfo6) {
      form.append("goodsInfo6", goodsInfo6);
      form.append("goodsDetail6", goodsDetail6);
    }

    console.log("ㄱㄱ");
    console.log(goodsImage);
    console.log(goodsDetailImg);
    axios
      .patch(`${backServer}/goods`, form, {
        headers: {
          contentType: "multipart/form-data",
          processData: false,
        },
      })
      .then((res) => {
        console.log(res);
        Swal.fire({
          icon: "success",
          title: "상품이 수정되었습니다!",
          showConfirmButton: false,
          timer: 1500,
        });
        navigate("/shop/*");
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
        return (
          <div>
            <div>상품정보</div>
            <div className="goods-info-wrap">
              <table className="tbl">
                <tbody>
                  <tr>
                    <th style={{ width: "25%" }}>
                      <div className="input-item">
                        <input
                          type="text"
                          value={goodsInfo1}
                          onChange={(e) => setGoodsInfo1(e.target.value)}
                          placeholder="필수 표기정보(명)"
                        />
                      </div>
                    </th>
                    <td style={{ width: "25%" }}>
                      <div className="input-item">
                        <input
                          type="text"
                          value={goodsDetail1}
                          onChange={(e) => setGoodsDetail1(e.target.value)}
                          placeholder="표기정보 (상세)"
                        />
                      </div>
                    </td>
                    <th style={{ width: "25%" }}>
                      <div className="input-item">
                        <input
                          type="text"
                          value={goodsInfo2}
                          onChange={(e) => setGoodsInfo2(e.target.value)}
                          placeholder="필수 표기정보(명)"
                        />
                      </div>
                    </th>
                    <td style={{ width: "25%" }}>
                      <div className="input-item">
                        <input
                          type="text"
                          value={goodsDetail2}
                          onChange={(e) => setGoodsDetail2(e.target.value)}
                          placeholder="표기정보 (상세)"
                        />
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th style={{ width: "25%" }}>
                      <div className="input-item">
                        <input
                          type="text"
                          value={goodsInfo3}
                          onChange={(e) => setGoodsInfo3(e.target.value)}
                          placeholder="필수 표기정보(명)"
                        />
                      </div>
                    </th>
                    <td style={{ width: "25%" }}>
                      <div className="input-item">
                        <input
                          type="text"
                          value={goodsDetail3}
                          onChange={(e) => setGoodsDetail3(e.target.value)}
                          placeholder="표기정보 (상세)"
                        />
                      </div>
                    </td>
                    <th style={{ width: "25%" }}>
                      <div className="input-item">
                        <input
                          type="text"
                          value={goodsInfo4}
                          onChange={(e) => setGoodsInfo4(e.target.value)}
                          placeholder="필수 표기정보(명)"
                        />
                      </div>
                    </th>
                    <td style={{ width: "25%" }}>
                      <div className="input-item">
                        <input
                          type="text"
                          value={goodsDetail4}
                          onChange={(e) => setGoodsDetail4(e.target.value)}
                          placeholder="표기정보 (상세)"
                        />
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th style={{ width: "25%" }}>
                      <div className="input-item">
                        <input
                          type="text"
                          value={goodsInfo5}
                          onChange={(e) => setGoodsInfo5(e.target.value)}
                          placeholder="필수 표기정보(명)"
                        />
                      </div>
                    </th>
                    <td style={{ width: "25%" }}>
                      <div className="input-item">
                        <input
                          type="text"
                          value={goodsDetail5}
                          onChange={(e) => setGoodsDetail5(e.target.value)}
                          placeholder="표기정보 (상세)"
                        />
                      </div>
                    </td>
                    <th style={{ width: "25%" }}>
                      <div className="input-item">
                        <input
                          type="text"
                          value={goodsInfo6}
                          onChange={(e) => setGoodsInfo6(e.target.value)}
                          placeholder="필수 표기정보(명)"
                        />
                      </div>
                    </th>
                    <td style={{ width: "25%" }}>
                      <div className="input-item">
                        <input
                          type="text"
                          value={goodsDetail6}
                          onChange={(e) => setGoodsDetail6(e.target.value)}
                          placeholder="표기정보 (상세)"
                        />
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div
              className="goods-detail-img"
              onClick={() => imageDetailRef.current.click()}
              style={{ cursor: "pointer" }}
            >
              {selectedImageDetail ? (
                <img src={selectedImageDetail} />
              ) : goods.goodsDetailImg ? (
                <img
                  src={`${backServer}/shop/detail/${goods.goodsDetailImg}`}
                />
              ) : (
                <img src="/image/befor-detail-img.png" alt="기본 썸네일" />
              )}
              <input
                ref={imageDetailRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }} // 파일 입력 요소 숨김
                onChange={changeDeImg} // 파일 선택 시 변화 처리
              />
            </div>
          </div>
        );

      case "리뷰":
        return <div>리뷰 정보 탭입니다.</div>;
      case "배송/결제":
        return <div>배송 정보 탭입니다.</div>;
      case "반품/교환":
        return <div>반품 정보 탭입니다.</div>;
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
  const handleImageClick = () => {
    imageRef.current.click(); // 파일 선택기 클릭
  };

  const changeImage = (e) => {
    const files = e.target.files;
    if (files.length !== 0) {
      setGoodsImage(files[0]); // 썸네일 파일 상태 설정

      // 화면 미리보기 설정
      const reader = new FileReader();
      reader.readAsDataURL(files[0]);
      reader.onloadend = () => {
        setShowImage(reader.result); // 미리보기 상태 설정
        setSelectedImage(reader.result); // 선택된 이미지 업데이트
      };
    } else {
      setGoodsImage(null);
      setShowImage(null);
      setSelectedImage(null); // 초기화
    }
    console.log(goodsDetailImg);
  };

  const changeDeImg = (e) => {
    const files = e.target.files;
    if (files.length !== 0) {
      setGoodsDetailImg(files[0]); // 썸네일 파일 상태 설정

      // 화면 미리보기 설정
      const reader = new FileReader();
      reader.readAsDataURL(files[0]);
      reader.onloadend = () => {
        setShowDetailImage(reader.result); // 미리보기 상태 설정
        setSelectedImageDetail(reader.result);
      };
    } else {
      setGoodsDetailImg(null);
      setShowDetailImage(null);
      setSelectedImageDetail(null);
    }
    console.log(goodsImage);
  };

  useEffect(() => {
    axios
      .get(`${backServer}/goods/${goodsNo}`)
      .then((res) => {
        const data = res.data;
        setGoods(data);

        setExistingGoodsImage(data.goodsImage); // 기존 상품 이미지 URL 설정
        setExistingGoodsDetailImg(data.goodsDetailImg); // 기존 상세 이미지 URL 설정

        setGoodsName(data.goodsName);
        setGoodsPrice(data.goodsPrice);
        setGoodsExplain(data.goodsExplain);
        setGoodsStock(data.goodsStock);
        setGoodsCategory(data.goodsCategory);
        setGoodsInfo1(data.goodsInfo1);
        setGoodsInfo2(data.goodsInfo2);
        setGoodsInfo3(data.goodsInfo3);
        setGoodsInfo4(data.goodsInfo4);
        setGoodsInfo5(data.goodsInfo5);
        setGoodsInfo6(data.goodsInfo6);
        setGoodsDetail1(data.goodsDetail1);
        setGoodsDetail2(data.goodsDetail2);
        setGoodsDetail3(data.goodsDetail3);
        setGoodsDetail4(data.goodsDetail4);
        setGoodsDetail5(data.goodsDetail5);
        setGoodsDetail6(data.goodsDetail6);
        // setGoodsImage(data.goodsImage);
        // setGoodsDetailImg(data.goodsDetailImg);
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [goodsNo, backServer, activeTab]);
  console.log(goods.goodsImage);
  return (
    <div className="shop-detail-frm-wrap">
      <div className="main-detail">
        <div className="goods-image">
          <div
            className="goods-thumb-wrap"
            onClick={handleImageClick} // 클릭 시파일 선택기 실행
            style={{ cursor: "pointer" }}
          >
            {selectedImage ? (
              <img src={selectedImage} alt="미리보기" />
            ) : goods.goodsImage ? ( // 기본 이미지 표시
              <img
                src={`${backServer}/shop/thumb/${goods.goodsImage}`}
                alt="썸네일"
              />
            ) : (
              <img src="/image/default_img.png" alt="기본 썸네일" />
            )}
            <input
              ref={imageRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }} // 파일 입력 요소 숨김
              onChange={changeImage} // 파일 선택 시 변화 처리
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
              <TextEditor data={goodsExplain} setData={setGoodsExplain} />
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
        상품 수정하기
      </button>
    </div>
  );
};
export default ShopModify;
