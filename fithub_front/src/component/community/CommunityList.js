import React, { useCallback, useEffect, useRef, useState } from "react";
import "./community.css";
import { Link, useNavigate } from "react-router-dom";
import PersonIcon from "@mui/icons-material/Person";
import SearchIcon from "@mui/icons-material/Search";
import CreateIcon from "@mui/icons-material/Create";
import axios from "axios";
import { useRecoilState } from "recoil";
import { memberState } from "../utils/RecoilData";
import CommunityItem from "./CommunityItem";

const CommunityList = () => {
  const [member] = useRecoilState(memberState);
  const navigate = useNavigate();
  const [showInput, setShowInput] = useState(false);
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const [communityList, setCommunityList] = useState([]);
  const [followState, setFollowState] = useState(0);
  const [page, setPage] = useState(1); // 1페이지부터 시작
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();

  // ✅ useEffect에서 page 변화를 감지하여 자동 호출
  useEffect(() => {
    axios
      .get(
        `${backServer}/community/list?memberNo=${
          member ? member.memberNo : 0
        }&page=${page}&size=10`
      )
      .then((res) => {
        console.log("✅ 새 데이터:", res.data);
        setCommunityList((prev) => [...prev, ...res.data]);
        setHasMore(res.data.length > 0);
      })
      .catch((err) => console.error("Error fetching communities", err));
  }, [page, followState]); // page가 변경될 때마다 API 요청

  // ✅ loadMoreCommunities는 page만 증가시키도록 변경
  const loadMoreCommunities = useCallback(() => {
    if (hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [hasMore]);

  // ✅ 마지막 요소 감지
  const lastElementRef = useCallback(
    (node) => {
      if (!node) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMoreCommunities();
        }
      });

      observer.current.observe(node);
    },
    [hasMore, loadMoreCommunities]
  );

  return (
    <div className="community-list">
      <div className="community-list-wrap">
        <div className="community-head">
          <div className="community-head-title">
            <h2 className="community-title">
              <Link to="/community/list">커뮤니티</Link>
            </h2>
            <div className="community-menu">
              <SearchIcon onClick={() => setShowInput(!showInput)} />
              {member && (
                <CreateIcon onClick={() => navigate("/community/write")} />
              )}
              {member && <PersonIcon />}
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
              const isLast = index === communityList.length - 1;

              return (
                <div
                  ref={isLast ? lastElementRef : null}
                  key={`community-${index}`}
                >
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
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CommunityList;
