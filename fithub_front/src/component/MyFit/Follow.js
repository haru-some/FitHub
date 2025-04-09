import { useNavigate, useParams } from "react-router-dom";
import "./follow.css";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useRecoilState, useRecoilValue } from "recoil";
import { memberState } from "../utils/RecoilData";
import Swal from "sweetalert2";

const Follow = (props) => {
  const setFlag = props.setFlag;
  const params = useParams();
  const memberNo = params.memberNo;
  const type = params.type; //1 : 팔로워  2 : 팔로잉
  const loginMember = useRecoilValue(memberState);
  const loginMemberNo = loginMember.memberNo;

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
              <div
                className="user-item"
                onClick={() => {
                  navigate(`/myfit/activity/${member.memberNo}`);
                }}
              >
                <div className="avatar-wrap">
                  <img
                    src={
                      member.memberThumb
                        ? `${process.env.REACT_APP_BACK_SERVER}/member/profileimg/${member.memberThumb}`
                        : "/image/default_img.png"
                    }
                    className="avatar"
                  />
                </div>
                <div className="user-info">
                  <div className="name">{member.memberId}</div>
                  <div className="username">{member.memberName}</div>
                </div>
                {loginMember && loginMemberNo == memberNo && (
                  <button
                    className={`follow-button ${
                      member.isFollow === 1 ? "following" : ""
                    }`}
                    onClick={(e) => {
                      if (member.isFollow === 1) {
                        //팔로우 취소
                        Swal.fire({
                          title: "팔로우 취소",
                          text: "정말 팔로우를 취소하시겠습니까?",
                          icon: "warning",
                          showCancelButton: true,
                          confirmButtonColor: "rgb(93, 187, 121)",
                          cancelButtonColor: "rgb(146, 146, 146)",
                          confirmButtonText: "예",
                          cancelButtonText: "아니오",
                        }).then((result) => {
                          if (result.isConfirmed) {
                            axios
                              .delete(
                                `${process.env.REACT_APP_BACK_SERVER}/community/follow/${loginMemberNo}?followMemberNo=${member.memberNo}`
                              )
                              .then((res) => {
                                const obj = memberList.filter(
                                  (item, i) => item.memberNo === member.memberNo
                                )[0];
                                const idx = memberList.indexOf(
                                  memberList.filter(
                                    (item, i) =>
                                      item.memberNo === member.memberNo
                                  )[0]
                                );
                                obj["isFollow"] = 0;
                                memberList[idx] = obj;

                                setMemberList([...memberList]);
                              });
                          }
                        });
                      } else {
                        //팔로우
                        axios
                          .post(
                            `${process.env.REACT_APP_BACK_SERVER}/community/follow/${loginMemberNo}?followMemberNo=${member.memberNo}`
                          )
                          .then((res) => {
                            const obj = memberList.filter(
                              (item, i) => item.memberNo === member.memberNo
                            )[0];
                            const idx = memberList.indexOf(
                              memberList.filter(
                                (item, i) => item.memberNo === member.memberNo
                              )[0]
                            );
                            obj["isFollow"] = 1;
                            memberList[idx] = obj;

                            setMemberList([...memberList]);
                          });
                      }
                      e.stopPropagation();
                    }}
                  >
                    {member.isFollow === 1 ? "팔로잉" : "팔로우"}
                  </button>
                )}
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
