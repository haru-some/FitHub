import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChatIcon from "@mui/icons-material/Chat";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const CommunityView = () => {
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
        <div className="community-view-content">
          <p>{communityList.communityContent}</p>
          <img src="/image/default_img.png"></img>
        </div>
        <div className="post-input">
          <textarea
            placeholder="댓글을 입력하세요..."
            className="input-box"
          ></textarea>
          <button type="button">전송</button>
        </div>
      </div>
    </div>
  );
};

export default CommunityView;
