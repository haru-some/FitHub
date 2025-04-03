import { useRef, useState } from "react";

const AdminGoodsFile = (props) => {
  const { thumbnail, setThumbnail, boardImg } = props;
  const backServer = process.env.REACT_APP_BACK_SERVER;

  // 썸넬 화면 출력용 state
  const [showThumb, setShowThumb] = useState(null);
  const [goodsUrl, setGoodsUrl] = useState();
  const thumbRef = useRef(null);

  const changeUrl = (e) => {
    const files = e.target.files;
    if (files.length !== 0) {
      setGoodsUrl(files[0]); // 썸네일 파일 상태 설정

      // 화면 미리보기 설정
      const reader = new FileReader();
      reader.readAsDataURL(files[0]);
      reader.onloadend = () => {
        setShowThumb(reader.result); // 미리보기 상태 설정
      };
    } else {
      setGoodsUrl(null);
      setShowThumb(null);
    }
  };

  return (
    <div>
      <div
        className="goods-thumb-wrap"
        onClick={() => thumbRef.current.click()}
        style={{ cursor: "pointer" }}
      >
        {boardImg ? (
          <img src={`${backServer}/goods/thumb/${boardImg}`} alt="썸네일" />
        ) : showThumb ? (
          <img src={showThumb} alt="미리보기" />
        ) : (
          <img src="/image/default_img.png" alt="기본 썸네일" />
        )}
        <input
          ref={thumbRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }} // 파일 입력 요소 숨김
          onChange={changeUrl} // 파일 선택 시 변화 처리
        />
      </div>
    </div>
  );
};

export default AdminGoodsFile;
