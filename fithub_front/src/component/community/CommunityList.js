import React, { use, useCallback, useEffect, useRef, useState } from "react";
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
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const [member] = useRecoilState(memberState);
  const [showInput, setShowInput] = useState(false);
  const [communityList, setCommunityList] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();
  const [searchText, setSearchText] = useState("");
  const [viewList, setViewList] = useState(communityList);
  const [myCommunityList, setMyCommunityList] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(
        `${backServer}/community/list?memberNo=${
          member ? member.memberNo : 0
        }&page=${page}&size=10`
      )
      .then((res) => {
        setCommunityList((prev) => [...prev, ...res.data]);
        setHasMore(res.data.length > 0);
      })
      .catch((err) => console.error("Error fetching communities", err));
  }, [page]);

  const loadMoreCommunities = useCallback(() => {
    if (viewList === communityList && hasMore)
      setPage((prevPage) => prevPage + 1);
  }, [hasMore]);

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

  function cleanContent(html) {
    const withoutImages = html.replace(/<img[^>]*>/g, "");
    const textOnly = withoutImages.replace(/<\/?[^>]+(>|$)/g, "");
    return textOnly.trim();
  }

  // ✅ 검색 기능 개선 (검색 결과 없거나 검색창 닫으면 전체 리스트 출력)
  const filteredList = searchText.trim()
    ? communityList.filter((community) => {
        const keyword = searchText.trim().toLowerCase();
        return (
          community.memberId.toLowerCase().includes(keyword) ||
          (community.communityContent &&
            cleanContent(community.communityContent)
              .toLowerCase()
              .includes(keyword))
        );
      })
    : communityList;

  useEffect(() => {
    setViewList(communityList);
  }, [communityList]);

  useEffect(() => {
    if (searchText.trim().length > 0) {
      setViewList([...filteredList]);
    } else {
      setViewList(communityList);
    }
  }, [searchText]);

  const showMyCommunityList = () => {
    axios.get(`${backServer}/community/${member.memberNo}`).then((res) => {
      console.log(res);
    });
  };

  return (
    <div className="community-list">
      <div className="community-list-wrap">
        <div className="community-head">
          <div className="community-head-title">
            <h2 className="community-title">
              <Link to="/community/list">커뮤니티</Link>
            </h2>
            <div className="community-menu">
              {/* ✅ SearchIcon 클릭 시 검색창을 열거나 닫으면서 검색어 초기화 */}
              <SearchIcon
                onClick={() => {
                  setShowInput((prev) => !prev);
                  setSearchText(""); // 검색어 초기화
                }}
              />
              {member && (
                <CreateIcon onClick={() => navigate("/community/write")} />
              )}
              {member && <PersonIcon onClick={showMyCommunityList} />}
            </div>
          </div>
          {showInput && (
            <div className="community-search-wrap">
              <div className="community-search-input">
                <input
                  type="text"
                  placeholder="검색"
                  className="search-input"
                  value={searchText}
                  onChange={(e) => {
                    setSearchText(e.target.value);
                  }}
                />
              </div>
            </div>
          )}
        </div>
        <div className="community-content">
          <ul className="community-item-wrap">
            {viewList.map((community, index) => {
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
