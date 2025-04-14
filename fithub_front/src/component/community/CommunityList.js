import React, { useCallback, useEffect, useRef, useState } from "react";
import "./community.css";
import { useNavigate, useParams } from "react-router-dom";
import PersonIcon from "@mui/icons-material/Person";
import SearchIcon from "@mui/icons-material/Search";
import CreateIcon from "@mui/icons-material/Create";
import axios from "axios";
import { useRecoilState } from "recoil";
import { memberState } from "../utils/RecoilData";
import CommunityItem from "./CommunityItem";

const CommunityList = () => {
  const params = useParams();
  const memberNo = params["*"];
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const [member] = useRecoilState(memberState);
  const [showInput, setShowInput] = useState(false);
  const [communityList, setCommunityList] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();
  const [searchText, setSearchText] = useState("");
  const [showMyList, setShowMyList] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(
        `${backServer}/community/list/${
          member ? member.memberNo : 0
        }?memberNo=${memberNo}&page=${page}&size=10&searchText=${searchText}`
      )
      .then((res) => {
        setCommunityList([...communityList, ...res.data]);
      });
  }, [page, searchText, memberNo]);

  const loadMoreCommunities = useCallback(() => {
    if (communityList && hasMore) setPage((prevPage) => prevPage + 1);
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

  return (
    <div className="community-list">
      <div className="community-list-wrap">
        <div className="community-head">
          <div className="community-head-title">
            <p className="community-title">
              {memberNo ? "내 게시물" : "커뮤니티"}
            </p>
            <div className="community-menu">
              <SearchIcon
                onClick={() => {
                  if (showInput && searchText !== "") {
                    setCommunityList([]);
                    setSearchText("");
                    setPage(1);
                  }
                  setShowInput(!showInput);
                }}
              />
              {member && (
                <CreateIcon onClick={() => navigate("/community/write")} />
              )}

              {member && (
                <PersonIcon
                  onClick={() => {
                    setShowMyList(showMyList ? 0 : 1);
                    setPage(1);
                    setCommunityList([]);
                    setSearchText("");
                    setShowInput(false);

                    const myNo = String(member.memberNo); // 내 회원 번호 문자열

                    if (memberNo) {
                      navigate("/community/list");
                    } else {
                      navigate(`/community/list/${myNo}`);
                    }
                  }}
                  style={memberNo ? { fill: "#6fff87" } : {}}
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
                  value={searchText}
                  onChange={(e) => {
                    setSearchText(e.target.value);
                    setPage(1);
                    setCommunityList([]);
                  }}
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
                  key={`community-${JSON.stringify(community)}`}
                >
                  <CommunityItem
                    community={community}
                    communityList={communityList}
                    setCommunityList={setCommunityList}
                    member={member}
                    page={page}
                    memberNo={memberNo}
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
