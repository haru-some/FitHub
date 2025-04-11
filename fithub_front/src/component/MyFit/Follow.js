import { useNavigate, useParams } from "react-router-dom";
import "./follow.css";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useRecoilState, useRecoilValue } from "recoil";
import { memberState } from "../utils/RecoilData";
import Swal from "sweetalert2";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";

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
        `${process.env.REACT_APP_BACK_SERVER}/myfit/follow/${loginMemberNo}?type=${type}&memberNo=${memberNo}`
      )
      .then((res) => {
        setMemberList(res.data);
      })
      .catch((err) => {});
  }, []);
  const [open, setOpen] = useState(0);

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
          filteredList.map((member, index) => {
            const handleClose = () => setOpen(0);

            const handleUnfollow = () => {
              axios
                .delete(
                  `${process.env.REACT_APP_BACK_SERVER}/community/follow/${loginMember.memberNo}?followMemberNo=${member.memberNo}`
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
                  obj["isFollow"] = 0;
                  memberList[idx] = obj;

                  setMemberList([...memberList]);
                  setOpen(0);
                });
            };

            return (
              <>
                <Modal
                  open={member.memberNo === open}
                  onClose={handleClose}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                  <Box
                    sx={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      width: 400,
                      bgcolor: "transparent", // 배경 투명
                      borderRadius: "12px",
                      overflow: "hidden",
                    }}
                  >
                    <Box
                      sx={{
                        bgcolor: "#1E1E1E", // 내부 박스 배경색 (dark mode 느낌)
                        color: "#fff",
                        textAlign: "center",
                        padding: "24px 16px",
                        paddingBottom: "0px",
                      }}
                    >
                      <img
                        src={
                          member && member.memberThumb
                            ? `${process.env.REACT_APP_BACK_SERVER}/member/profileimg/${member.memberThumb}`
                            : "/image/default_img.png"
                        }
                        alt="프로필"
                        style={{
                          width: 80,
                          height: 80,
                          borderRadius: "50%",
                          objectFit: "cover",
                          marginBottom: "16px",
                        }}
                      />
                      {member && (
                        <Typography
                          sx={{ fontSize: "15px", marginBottom: "24px" }}
                        >
                          {member.memberId}님의 팔로우를 취소하시겠어요?
                        </Typography>
                      )}
                      <button
                        onClick={handleUnfollow}
                        style={{
                          width: "100%",
                          padding: "12px 0",
                          border: "none",
                          borderTop: "1px solid #444",
                          color: "#F33535",
                          background: "transparent",
                          fontSize: "14px",
                          cursor: "pointer",
                        }}
                      >
                        팔로우 취소
                      </button>
                      <button
                        onClick={handleClose}
                        style={{
                          width: "100%",
                          padding: "12px 0",
                          border: "none",
                          borderTop: "1px solid #444",
                          color: "#fff",
                          background: "transparent",
                          fontSize: "14px",
                          cursor: "pointer",
                        }}
                      >
                        취소
                      </button>
                    </Box>
                  </Box>
                </Modal>
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
                            : "/image/profile.png"
                        }
                        className="avatar"
                      />
                    </div>
                    <div className="user-info">
                      <div className="name">{member.memberId}</div>
                      <div className="username">{member.memberName}</div>
                    </div>
                    {loginMember && (
                      <button
                        className={`follow-button ${
                          member.isFollow === 1 ? "following" : ""
                        }`}
                        onClick={(e) => {
                          if (member.isFollow === 1) {
                            setOpen(member.memberNo);
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
                                    (item, i) =>
                                      item.memberNo === member.memberNo
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
              </>
            );
          })
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
