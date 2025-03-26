import React, { useState } from "react";

import { Link, useNavigate } from "react-router-dom";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChatIcon from "@mui/icons-material/Chat";
import PersonIcon from "@mui/icons-material/Person";
import SearchIcon from "@mui/icons-material/Search";
import CreateIcon from "@mui/icons-material/Create";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

const MyCommunityList = () => {
  const navigate = useNavigate();
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const [communityList, setCommunityList] = useState([
    {
      username: "박재훈",
      text: "득근",
      likes: 51,
      comments: 8,
    },
    {
      username: "박재훈",
      text: "득근",
      likes: 51,
      comments: 8,
    },
    {
      username: "박재훈",
      text: "득근",
      likes: 51,
      comments: 8,
    },
    {
      username: "박재훈",
      text: "득근",
      likes: 51,
      comments: 8,
    },
  ]);

  return (
    <div className="community-list">
      <div className="community-list-wrap">
        <div className="community-head">
          <div className="community-back">
            <ArrowBackIosNewIcon
              onClick={() => {
                navigate("/community/list");
              }}
            />
          </div>
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
  const navigate = useNavigate();
  const community = props.community;
  return (
    <li
      className="community-post-item"
      onClick={() => {
        navigate("/community/view");
      }}
    >
      <div className="user-info">
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
        <img src="/image/박재훈.webp"></img>
      </div>
      <div className="community-sub-zone">
        <div className="community-likes">
          <FavoriteBorderIcon />
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

export default MyCommunityList;
