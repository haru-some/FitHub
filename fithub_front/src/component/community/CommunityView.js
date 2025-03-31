import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ChatIcon from "@mui/icons-material/Chat";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const CommunityView = (props) => {
  const [memberId, setMemberId] = useState("user03");
  const [isLike, setIsLike] = useState(0);
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const params = useParams();
  const communityNo = params.communityNo;
  const [communityList, setCommunityList] = useState({});
  useEffect(() => {
    axios
      .get(`${backServer}/community/${communityNo}/${memberId}`)
      .then((res) => {
        console.log(res);
        setCommunityList(res.data);
      })
      .catch((err) => {});
  }, []);
  const changeLike = (e) => {
    if (isLike) {
      axios
        .delete(
          `${process.env.REACT_APP_BACK_SERVER}/community/${memberId}?communityNo=${communityList.communityNo}`
        )
        .then((res) => {
          const obj = communityList.filter(
            (item, i) => item.communityNo === communityList.communityNo
          )[0];
          const idx = communityList.indexOf(
            communityList.filter(
              (item, i) => item.communityNo === communityList.communityNo
            )[0]
          );
          obj["likeCount"] = res.data;
          communityList[idx] = obj;

          setCommunityList([...communityList]);
          setIsLike(false);
        });
    } else {
      axios
        .post(
          `${process.env.REACT_APP_BACK_SERVER}/community/${memberId}?communityNo=${communityList.communityNo}`
        )
        .then((res) => {
          const obj = communityList.filter(
            (item, i) => item.communityNo === communityList.communityNo
          )[0];
          const idx = communityList.indexOf(
            communityList.filter(
              (item, i) => item.communityNo === communityList.communityNo
            )[0]
          );
          obj["likeCount"] = res.data;
          communityList[idx] = obj;

          setCommunityList([...communityList]);
          setIsLike(true);
        });
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
      <div className="community-sub-zone">
        <div className="community-likes" onClick={changeLike}>
          {isLike ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          {communityList.likeCount}
        </div>
        <div className="community-comments">
          <ChatIcon />
          {communityList.commentCount}
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
