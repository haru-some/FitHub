import React, { useCallback, useEffect, useRef, useState } from "react";
import "./community.css";
import { Link, useNavigate, useParams } from "react-router-dom";
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
        console.log(res.data);
        setCommunityList([...communityList, ...res.data]);
      })
      .catch((err) => console.log(err));
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
            <h2 className="community-title">
              {showMyList === 0 ? "커뮤니티" : "내 게시물"}
            </h2>
            <div className="community-menu">
              <SearchIcon
                onClick={() => {
                  setShowInput((prev) => !prev);
                  setSearchText("");
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

                    navigate(
                      memberNo === String(member.memberNo)
                        ? "/community/list"
                        : `/community/list/${member.memberNo}`
                    );
                  }}
                  style={showMyList === 1 ? { fill: "#6fff87" } : {}}
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
                  key={`community-${index}`}
                >
                  <CommunityItem
                    community={community}
                    communityList={communityList}
                    setCommunityList={setCommunityList}
                    member={member}
                    page={page}
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
