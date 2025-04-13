const [selectedImage, setSelectedImage] = useState(null); // 선택된 이미지 상태 추가

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
};

// JSX 부분
<div className="goods-image">
  <div
    className="goods-thumb-wrap"
    onClick={handleImageClick} // 클릭 시파일 선택기 실행
    style={{ cursor: "pointer" }}
  >
    {selectedImage ? ( // selectedImage가 존재하면 미리보기 이미지 표시
      <img src={selectedImage} alt="미리보기" />
    ) : goods.goodsImage ? ( // 기본 이미지 표시
      <img src={`${backServer}/shop/thumb/${goods.goodsImage}`} alt="썸네일" />
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
</div>;
