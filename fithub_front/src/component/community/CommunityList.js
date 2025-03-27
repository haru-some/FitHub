import React, { useEffect, useState } from "react";
import "./community.css"; // CSS 파일 불러오기

import { Link, useNavigate } from "react-router-dom";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChatIcon from "@mui/icons-material/Chat";
import PersonIcon from "@mui/icons-material/Person";
import SearchIcon from "@mui/icons-material/Search";
import CreateIcon from "@mui/icons-material/Create";
import FavoriteIcon from "@mui/icons-material/Favorite";
import axios from "axios";

const CommunityList = () => {
  const navigate = useNavigate();
  const [showInput, setShowInput] = useState(false);
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const [communityList, setCommunityList] = useState([]);

  useEffect(() => {
    axios
      .get(`${backServer}/community`)
      .then((res) => {
        setCommunityList(res.data);
      })
      .catch((err) => {});
  }, []);

  return (
    <div className="community-list">
      <div className="community-list-wrap">
        <div className="community-head">
          <div className="community-head-title">
            <h2 className="community-title">
              <Link to="/community/list">커뮤니티</Link>
            </h2>
            <div className="community-menu">
              <SearchIcon
                onClick={() => {
                  setShowInput(!showInput);
                }}
              />
              <CreateIcon
                onClick={() => {
                  navigate("/community/write");
                }}
              />
              <PersonIcon />
            </div>
          </div>
          {showInput && (
            <div className="community-search-wrap">
              <div className="community-search-input">
                <input
                  type="text"
                  placeholder="검색"
                  className="search-input"
                />
              </div>
            </div>
          )}
        </div>
        <div className="community-content">
          <ul className="community-item-wrap">
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
  const [isLike, setIsLike] = useState(false);
  const navigate = useNavigate();
  const community = props.community;
  const changeLike = (e) => {
    if (isLike) {
      setIsLike(false);
    } else {
      setIsLike(true);
    }
    e.stopPropagation();
  };
  return (
    <li
      className="community-post-item"
      onClick={() => {
        navigate(`/community/view/${community.communityNo}`);
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
          <img src="/image/default_img.png"></img>
        </div>
        <div className="community-member">
          <p>{community.memberId}</p>
          <button type="button" className="follow-btn">
            팔로우
          </button>
        </div>
      </div>
      <div className="community-content">
        <p>{community.communityContent}</p>
      </div>
      <div className="community-img">
        <img src="/image/communityImage/박재훈.webp"></img>
      </div>
      <div className="community-sub-zone">
        <div className="community-likes" onClick={changeLike}>
          {isLike ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </div>
        <div className="community-comments">
          <ChatIcon />
        </div>
      </div>
    </li>
  );
};
export default CommunityList;
