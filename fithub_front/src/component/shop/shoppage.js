const submit = () => {
  /////////////////////////////////////////FORM////////////////////////////////////////////
  const form = new FormData();
  form.append("goodsNo", goodsNo);
  form.append("goodsName", goodsName);
  form.append("goodsPrice", goodsPrice);
  form.append("goodsExplain", goodsExplain);
  form.append("goodsStock", goodsStock);
  form.append("goodsCategory", goodsCategory);

  // 이미지 처리: 새로운 이미지가 있으면 사용하고, 없으면 기존 이미지를 사용
  if (goodsImage) {
    form.append("goodsImg", goodsImage); // 새 상품 이미지가 있는 경우
  } else {
    form.append("goodsImg", existingGoodsImage); // 기존 이미지 사용
  }

  if (goodsDetailImg) {
    form.append("detailImg", goodsDetailImg); // 새 상세 이미지가 있는 경우
  } else {
    form.append("detailImg", existingGoodsDetailImg); // 기존 상세 이미지 사용
  }

  const obj = {};
  if (goodsInfo1?.trim()) obj[goodsInfo1] = goodsDetail1;
  if (goodsInfo2?.trim()) obj[goodsInfo2] = goodsDetail2;
  if (goodsInfo3?.trim()) obj[goodsInfo3] = goodsDetail3;
  if (goodsInfo4?.trim()) obj[goodsInfo4] = goodsDetail4;
  if (goodsInfo5?.trim()) obj[goodsInfo5] = goodsDetail5;
  if (goodsInfo6?.trim()) obj[goodsInfo6] = goodsDetail6;

  form.append("goodsInfos", JSON.stringify(obj));

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
      console.error("상품 수정 실패:", err);
      Swal.fire({
        icon: "error",
        title: "상품 수정 실패",
        text: err.message,
      });
    });
};

const renderContent = () => {
  // ... (기존 코드 유지)
  return (
    <div>
      <div>상품정보</div>
      <div className="goods-info-wrap">
        <table className="tbl">
          <tbody>
            {infoArr.length > 0 ? (
              <tr>
                <th style={{ width: "25%" }}>
                  <div className="input-item">
                    <input
                      type="text"
                      value={goodsInfo1}
                      onChange={(e) => setGoodsInfo1(e.target.value)}
                      placeholder="표기정보 (상세)"
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
              </tr>
            ) : (
              "1행 안나옴"
            )}
            {/* 이하 생략 ... */}
          </tbody>
        </table>
      </div>
      <div className="goods-detail-img" onClick={() => imageDetailRef.current.click()} style={{ cursor: "pointer" }}>
        {selectedImageDetail ? (
          <img src={selectedImageDetail} />
        ) : existingGoodsDetailImg ? (
          <img src={`${backServer}/shop/detail/${existingGoodsDetailImg}`} />
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
  imageRef.current.click();
};

const changeImage = (e) => {
  const files = e.target.files;
  if (files.length !== 0) {
    setExistingGoodsImage(files[0]); // 새 상품 이미지 설정
    setGoodsImage(files[0]); // 상품 이미지 상태 설정

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
    setSelectedImage(null);
    setExistingGoodsImage(null);
  }
};

const changeDeImg = (e) => {
  const files = e.target.files;
  if (files.length !== 0) {
    setGoodsDetailImg(files[0]); // 상품 상세 이미지 상태 설정

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
};

useEffect(() => {
  axios
    .get(`${backServer}/goods/${goodsNo}`)
    .then((res) => {
      const data = res.data;

      setGoods(data);
      setExistingGoodsImage(data.goodsImage); // 기존 상품 이미지 URL 설정
      setExistingGoodsDetailImg(data.goodsDetailImg); // 기존 상세 이미지 URL 설정

      const infoArray = data.goodsInfo.split("&");
      setInfoArr(infoArray);

      setGoodsName(data.goodsName);
      setGoodsPrice(data.goodsPrice);
      setGoodsExplain(data.goodsExplain);
      setGoodsStock(data.goodsStock);
      setGoodsCategory(data.goodsCategory);

      // Set other goods info fields
      setGoodsInfo1(infoArray[0] ? infoArray[0].split("=")[0] : "");
      setGoodsDetail1(infoArray[0] ? infoArray[0].split("=")[1] : "");
      setGoodsInfo2(infoArray[1] ? infoArray[1].split("=")[0] : "");
      setGoodsDetail2(infoArray[1] ? infoArray[1].split("=")[1] : "");
      setGoodsInfo3(infoArray[2] ? infoArray[2].split("=")[0] : "");
      setGoodsDetail3(infoArray[2] ? infoArray[2].split("=")[1] : "");
      setGoodsInfo4(infoArray[3] ? infoArray[3].split("=")[0] : "");
      setGoodsDetail4(infoArray[3] ? infoArray[3].split("=")[1] : "");
      setGoodsInfo5(infoArray[4] ? infoArray[4].split("=")[0] : "");
      setGoodsDetail5(infoArray[4] ? infoArray[4].split("=")[1] : "");
      setGoodsInfo6(infoArray[5] ? infoArray[5].split("=")[0] : "");
      setGoodsDetail6(infoArray[5] ? infoArray[5].split("=")[1] : "");

      // Set initial images
      setGoodsImage(data.goodsImage);
      setGoodsDetailImg(data.goodsDetailImg);
    })
    .catch((err) => {
      console.log(err);
    });
}, [goodsNo, backServer, activeTab]);

return (
  <div className="shop-detail-frm-wrap">
    <div className="main-detail">
      <div className="goods-image">
        <div
          className="goods-thumb-wrap"
          onClick={handleImageClick}
          style={{ cursor: "pointer" }}
        >
          {selectedImage ? (
            <img src={selectedImage} alt="미리보기" />
          ) : existingGoodsImage ? (
            <img
              src={`${backServer}/shop/thumb/${existingGoodsImage}`}
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