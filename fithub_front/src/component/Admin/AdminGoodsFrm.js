import { useRecoilState } from "recoil";
import { loginIdState } from "../utils/RecoilData";
import { useRef, useState } from "react";
import CancelPresentationIcon from "@mui/icons-material/CancelPresentation";

const AdminGoodsFrm = (props) => {
  //const [loginId, setLoginId] = useRecoilState(loginIdState);
  const goodsName = props.goodsName;
  const setGoodsName = props.setGoodsName;
  const thumbnail = props.thumbnail;
  const setThumbnail = props.setThumbnail;
  const goodsFile = props.goodsFile;
  const setGoodsFile = props.setGoodsFile;
  const delFileNo = props.delFileNo;
  const setDelFileNo = props.setDelFileNo;

  //write에서는 필요없고, update시 기존 셈넬, 기존첨부파일을 저장하기위한 state
  //write 에서는 아래 4개 모두 undefined
  const goodsImg = props.goodsImg;
  const setGoodsImg = props.setGoodsImg;
  console.log(setGoodsImg);
  const fileList = props.fileList;
  const setFileList = props.setFileList;

  //썸넬 화면 출력용state
  const [showThumb, setShowThumb] = useState(null);

  const thumbRef = useRef(null);

  const changeThumbnail = (e) => {
    const files = e.target.files;
    if (files.length !== 0) {
      //1. 글작성을 하는경우 파일을 정송하기위한 설정
      setThumbnail(files[0]);
      //2. 화면을 미리보기 설정
      const reader = new FileReader();
      reader.readAsDataURL(files[0]);
      reader.onloadend = () => {
        setShowThumb(reader.result);
        if (setGoodsImg) {
          setGoodsImg(null);
        }
      };
    } else {
      setThumbnail(null);
      setShowThumb(null);
    }
  };

  return (
    <div>
      <div
        className="goods-thumb-wrap"
        onClick={() => {
          thumbRef.current.click();
        }}
      >
        {goodsImg ? (
          <img
            src={`${process.env.REACT_APP_BACK_SERVER}/goods/image/${goodsImg}`}
          ></img>
        ) : showThumb ? (
          <img src={showThumb}></img>
        ) : (
          <img src="/image/default_img.png"></img>
        )}

        <input
          ref={thumbRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={changeThumbnail}
        ></input>
      </div>
    </div>
  );
};
export default AdminGoodsFrm;
