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
import { useRecoilState } from "recoil";
import { loginIdState, memberState } from "../utils/RecoilData";

const CommunityList = () => {
  const [memberId, setMemberId] = useRecoilState(loginIdState);
  const [member, setMember] = useRecoilState(memberState);
  const navigate = useNavigate();
  const [showInput, setShowInput] = useState(false);
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const [communityList, setCommunityList] = useState([]);

  useEffect(() => {
    axios
      .get(
        `${backServer}/community/list?memberNo=${member ? member.memberNo : 0}`
      )
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
                  communityList={communityList}
                  setCommunityList={setCommunityList}
                  member={member}
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
  const communityList = props.communityList;
  const setCommunityList = props.setCommunityList;
  const member = props.member;
  const community = props.community;
  const [isLike, setIsLike] = useState(community.isLike === 1);
  const navigate = useNavigate();
  console.log(community.isLike);

  const changeLike = (e) => {
    if (member) {
      if (isLike) {
        axios
          .delete(
            `${process.env.REACT_APP_BACK_SERVER}/community/${member.memberNo}?communityNo=${community.communityNo}`
          )
          .then((res) => {
            const obj = communityList.filter(
              (item, i) => item.communityNo === community.communityNo
            )[0];
            const idx = communityList.indexOf(
              communityList.filter(
                (item, i) => item.communityNo === community.communityNo
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
            `${process.env.REACT_APP_BACK_SERVER}/community/${member.memberNo}?communityNo=${community.communityNo}`
          )
          .then((res) => {
            const obj = communityList.filter(
              (item, i) => item.communityNo === community.communityNo
            )[0];
            const idx = communityList.indexOf(
              communityList.filter(
                (item, i) => item.communityNo === community.communityNo
              )[0]
            );
            obj["likeCount"] = res.data;
            communityList[idx] = obj;

            setCommunityList([...communityList]);
            setIsLike(true);
          });
      }
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
          {member && (
            <button type="button" className="follow-btn">
              팔로우
            </button>
          )}
        </div>
      </div>
      <div
        className="community-content"
        dangerouslySetInnerHTML={{ __html: community.communityContent }}
      ></div>

      <div className="community-sub-zone">
        <div className="community-likes" onClick={changeLike}>
          {isLike ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          {community.likeCount}
        </div>
        <div className="community-comments">
          <ChatIcon />
          {community.commentCount}
        </div>
      </div>
    </li>
  );
};
export default CommunityList;
