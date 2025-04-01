import { useNavigate, useParams } from "react-router-dom";
import "./follow.css";
import { useEffect, useRef, useState } from "react";
import axios from "axios";

const Follow = () => {
  const params = useParams();
  const memberNo = params.memberNo;
  const type = params.type; //1 : 팔로워  2 : 팔로잉

  const [memberList, setMemberList] = useState(null);
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();

  const filteredList = memberList
    ? memberList.filter((member) => {
        const keyword = searchText.trim().toLowerCase();
        if (keyword === "") return true;

        return (
          member.memberId.toLowerCase().includes(keyword) ||
          member.memberName.toLowerCase().includes(keyword)
        );
      })
    : [];

  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_BACK_SERVER}/myfit/follow/${memberNo}?type=${type}`
      )
      .then((res) => {
        console.log(res.data);
        setMemberList(res.data);
      })
      .catch((err) => {});
  }, []);

  return (
    <div className="myfit-follow-wrap">
      <div className="input-wrap">
        <input
          type="text"
          placeholder="검색"
          className="search-input"
          value={searchText}
          onChange={(e) => {
            setSearchText(e.target.value);
          }}
        />
        {/* <span class="material-icons search-btn" onClick={searchResult}>
          search
        </span> */}
      </div>

      <ul className="user-list">
        {filteredList.length > 0 ? (
          filteredList.map((member, index) => (
            <li key={index} className="user-item-wrap">
              <div className="user-item">
                <img
                  src={
                    member.memberThumb
                      ? `${process.env.REACT_APP_BACK_SERVER}/member/profileimg/${member.memberThumb}`
                      : "/image/default_img.png"
                  }
                  className="avatar"
                />
                <div className="user-info">
                  <div className="name">{member.memberId}</div>
                  <div className="username">{member.memberName}</div>
                </div>
                <button className="follow-button">팔로잉</button>
              </div>
            </li>
          ))
        ) : (
          <li className="empty-message">{`${
            Number(type) === 1 ? "팔로워" : "팔로잉"
          } 목록이 없습니다.`}</li>
        )}
      </ul>
      <button
        className="back-btn"
        onClick={() => {
          navigate(`/myfit/activity/${memberNo}`);
        }}
      >
        <span class="material-icons">reply</span>
      </button>
    </div>
  );
};

export default Follow;
