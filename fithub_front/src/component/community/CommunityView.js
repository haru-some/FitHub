import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ChatIcon from "@mui/icons-material/Chat";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRecoilState } from "recoil";
import { memberState } from "../utils/RecoilData";

const CommunityView = () => {
  const [member, setMember] = useRecoilState(memberState);
  const memberId = member.memberId;
  const [isLike, setIsLike] = useState(0);
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const params = useParams();
  const communityNo = params.communityNo;
  const [community, setCommunity] = useState({});
  console.log(community.isLike);
  useEffect(() => {
    axios
      .get(`${backServer}/community/${communityNo}`)
      .then((res) => {
        console.log(res);
        setCommunity(res.data);
      })
      .catch((err) => {});
  }, []);
  const changeLike = (e) => {
    if (isLike) {
      axios
        .post(
          `${process.env.REACT_APP_BACK_SERVER}/community/${memberId}?communityNo=${communityNo}`
        )
        .then((res) => {
          console.log(res);
        });
    } else {
      axios
        .delete(
          `${process.env.REACT_APP_BACK_SERVER}/community/${memberId}?communityNo=${communityNo}`
        )
        .then((res) => {});
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
          <p>{community.memberId}</p>
          <p>{community.communityDate}</p>
        </div>
        <div className="community-follow-btn">
          <button type="button" className="follow-btn">
            팔로우
          </button>
        </div>
      </div>
      <div className="community-view-content">
        <p>{community.communityContent}</p>
        <img src="/image/communityImage/박재훈.webp"></img>
      </div>
      <div className="community-sub-zone">
        <div className="community-likes" onClick={changeLike}>
          {community.isLike ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          {community.likeCount}
        </div>
        <div className="community-comments">
          <ChatIcon />
          {community.commentCount}
        </div>
      </div>
      <div className="post-input">
        <div className="member-img">
          <img src="/image/default_img.png"></img>
        </div>
        <div className="comment-text-box">
          <input type="text"></input>
          <button>send</button>
        </div>
      </div>
    </div>
  );
};

export default CommunityView;
