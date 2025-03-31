import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ChatIcon from "@mui/icons-material/Chat";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRecoilState } from "recoil";
import { memberState } from "../utils/RecoilData";

const CommunityView = () => {
  const [member, setMember] = useRecoilState(memberState);
  const [isLike, setIsLike] = useState(0);
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const params = useParams();
  const communityNo = params.communityNo;
  const [community, setCommunity] = useState({});

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
    if (member) {
      if (isLike) {
        axios
          .post(
            `${process.env.REACT_APP_BACK_SERVER}/community/${member.memberId}?communityNo=${communityNo}`
          )
          .then((res) => {});
      } else {
        axios
          .delete(
            `${process.env.REACT_APP_BACK_SERVER}/community/${member.memberId}?communityNo=${communityNo}`
          )
          .then((res) => {});
      }
    }
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
          {member && (
            <button type="button" className="follow-btn">
              팔로우
            </button>
          )}
        </div>
      </div>
      <div
        className="community-view-content"
        dangerouslySetInnerHTML={{ __html: community.communityContent }}
      ></div>
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
      <div className="community-comment-list">
        <CommentList />
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

const CommentList = () => {
  return (
    <ul>
      <li className="comment-list">
        <div className="comment-user-info">
          <div className="member-img">
            <img src="/image/default_img.png"></img>
          </div>
          <div className="member-id">user01</div>
        </div>
        <div className="comment-user-content">아브라카다브라</div>
      </li>
    </ul>
  );
};

export default CommunityView;
