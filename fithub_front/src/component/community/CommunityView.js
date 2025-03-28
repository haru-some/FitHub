import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ChatIcon from "@mui/icons-material/Chat";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const CommunityView = () => {
  const [isLike, setIsLike] = useState(false);
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const params = useParams();
  const communityNo = params.communityNo;
  const [communityList, setCommunityList] = useState({});
  useEffect(() => {
    axios
      .get(`${backServer}/community/${communityNo}`)
      .then((res) => {
        console.log(res);
        setCommunityList(res.data);
      })
      .catch((err) => {});
  }, []);
  const changeLike = (e) => {
    if (isLike) {
      setIsLike(false);
    } else {
      setIsLike(true);
    }
    e.stopPropagation();
  };
  return (
    <div className="community-view">
      <div className="community-view-user">
        <div className="member-img">
          <img src="/image/default_img.png"></img>
        </div>
        <div className="community-member">
          <p>{communityList.memberId}</p>
          <p>{communityList.communityDate}</p>
        </div>
        <div className="community-follow-btn">
          <button type="button" className="follow-btn">
            팔로우
          </button>
        </div>
      </div>
      <div className="community-view-content">
        <p>{communityList.communityContent}</p>
        <img src="/image/communityImage/박재훈.webp"></img>
      </div>
      <button className="prev-image">이전</button>
      <button className="next-image">다음</button>
      <div className="community-sub-zone">
        <div className="community-likes" onClick={changeLike}>
          {isLike ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </div>
        <div className="community-comments">
          <ChatIcon />
        </div>
      </div>
      <div className="post-input">
        <textarea
          placeholder="댓글을 입력하세요..."
          className="input-box"
        ></textarea>
        <button type="button">전송</button>
      </div>
    </div>
  );
};

export default CommunityView;
