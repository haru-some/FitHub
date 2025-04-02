import React, { useCallback, useEffect, useRef, useState } from "react";
import "./community.css"; // CSS 파일 불러오기
import { Link, useNavigate } from "react-router-dom";
import PersonIcon from "@mui/icons-material/Person";
import SearchIcon from "@mui/icons-material/Search";
import CreateIcon from "@mui/icons-material/Create";
import axios from "axios";
import { useRecoilState } from "recoil";
import { memberState } from "../utils/RecoilData";
import CommunityItem from "./CommunityItem";

const CommunityList = () => {
  const [member, setMember] = useRecoilState(memberState);
  const navigate = useNavigate();
  const [showInput, setShowInput] = useState(false);
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const [communityList, setCommunityList] = useState([]);
  const [followState, setFollowState] = useState(0);
  const [page, setPage] = useState(0); //시작하는 페이지
  const [hasMore, setHasMore] = useState(true); //데이터가 없으면 실행방지
  const observer = useRef();

  useEffect(() => {
    axios
      .get(
        `${backServer}/community/list?memberNo=${
          member ? member.memberNo : 0
        }&page=1&size=10`
      )
      .then((res) => {
        setCommunityList(res.data);
        setHasMore(res.data.length > 0);
      })
      .catch((err) => {
        console.error("Error fetching communities", err);
      });
  }, [followState]);

  const loadMoreCommunities = () => {
    if (!hasMore) return;
    axios
      .get(
        `${backServer}/community/list?memberNo=${
          member ? member.memberNo : 0
        }&page=${page}&size=10`
      )
      .then((res) => {
        setCommunityList((prev) => [...prev, ...res.data]);
        setPage((prev) => prev + 1);
        setHasMore(res.data.length > 0);
        console.log(res.data);
      })
      .catch((err) => {
        console.error("Error fetching more communities", err);
      });
  };

  const lastElementRef = useCallback(
    (node) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMoreCommunities();
        }
      });
      if (node) observer.current.observe(node);
    },
    [hasMore]
  );

  const myCommunityList = () => {};
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
              {member && (
                <CreateIcon
                  onClick={() => {
                    navigate("/community/write");
                  }}
                />
              )}
              {member && (
                <PersonIcon
                  onClick={
                    myCommunityList
                    //1.내 memberNo 를 axios로 보내서 해당되는 리스트 불러옴
                    //2. 커뮤니티리스트 스테이트에 셋
                  }
                />
              )}
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
              if (index === communityList.length - 1) {
                return (
                  <div ref={lastElementRef} key={"community-" + index}>
                    <CommunityItem
                      community={community}
                      communityList={communityList}
                      setCommunityList={setCommunityList}
                      member={member}
                      followState={followState}
                      setFollowState={setFollowState}
                    />
                  </div>
                );
              }
              return (
                <CommunityItem
                  key={"community-" + index}
                  community={community}
                  communityList={communityList}
                  setCommunityList={setCommunityList}
                  member={member}
                  followState={followState}
                  setFollowState={setFollowState}
                />
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CommunityList;
