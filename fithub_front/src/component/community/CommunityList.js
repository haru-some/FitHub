import React, { useState } from "react";
import "./community.css"; // CSS 파일 불러오기

import { Link, useNavigate } from "react-router-dom";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChatIcon from "@mui/icons-material/Chat";
import PersonIcon from "@mui/icons-material/Person";
import SearchIcon from "@mui/icons-material/Search";
import CreateIcon from "@mui/icons-material/Create";
import FavoriteIcon from "@mui/icons-material/Favorite";

const CommunityList = () => {
  const navigate = useNavigate();
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const [communityList, setCommunityList] = useState([
    {
      username: "CBUM",
      text: "오운완",
      likes: "",
      comments: 85,
    },
    {
      username: "박재훈",
      text: "득근",
      likes: 51,
      comments: 8,
    },
    {
      username: "김건우",
      text: "파이팅",
      likes: 34,
      comments: 5,
    },
    {
      username: "김강민",
      text: "덥다",
      likes: 154,
      comments: 45,
    },
  ]);

  return (
    <div className="community-list">
      <div className="community-list-wrap">
        <div className="community-head">
          <h2 className="community-title">
            <Link to="/community/list">커뮤니티</Link>
          </h2>
          <div className="community-menu">
            <SearchIcon
              onClick={() => {
                navigate("/community/search");
              }}
            />
            <CreateIcon
              onClick={() => {
                navigate("/community/write");
              }}
            />
            <PersonIcon
              onClick={() => {
                navigate("/community/mycommunity");
              }}
            />
          </div>
        </div>
        <div className="community-content">
          <ul className="post-item-wrap">
            {communityList.map((community, index) => {
              return (
                <CommunityItem
                  key={"community-" + index}
                  community={community}
                />
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

const CommunityItem = (props) => {
  const [isLikes, setIsLikes] = useState(0);
  const navigate = useNavigate();
  const community = props.community;

  return (
    <li
      className="community-post-item"
      onClick={() => {
        navigate("/community/view");
      }}
    >
      <div
        className="user-info"
        onClick={(e) => {
          navigate("/myfit/activity");
          e.stopPropagation();
        }}
      >
        <div className="member-img">
          <img src="/image/박재훈.webp"></img>
        </div>
        <div className="community-member">
          <p>{community.username}</p>
          <button type="button" className="follow-btn">
            팔로우
          </button>
        </div>
      </div>
      <div className="community-content">
        <p>{community.text}</p>
      </div>
      <div className="community-img">
        <img src="/image/씨범.webp"></img>
      </div>
      <div className="community-sub-zone">
        <div className="community-likes">
          <FavoriteBorderIcon
            onClick={(e) => {
              e.stopPropagation();
            }}
          />
          {community.likes}
        </div>
        <div className="community-comments">
          <ChatIcon />
          {community.comments}
        </div>
      </div>
    </li>
  );
};
export default CommunityList;
