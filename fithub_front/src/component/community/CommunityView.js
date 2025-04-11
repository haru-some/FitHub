import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ChatIcon from "@mui/icons-material/Chat";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRecoilState } from "recoil";
import { memberState } from "../utils/RecoilData";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import Swal from "sweetalert2";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";

const CommunityView = () => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const [member, setMember] = useRecoilState(memberState);
  const params = useParams();
  const communityNo = params.communityNo;
  //불러온 게시글 저장하는 state -> 댓글이 입력되면 새로 게시글 조회해오게 해야함
  const [community, setCommunity] = useState(null);
  const navigate = useNavigate();
  //서버 전송용 state가 newComment
  const [newComment, setNewComment] = useState("");
  const [isUpdate, setIsUpdate] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);
  useEffect(() => {
    axios
      .get(
        `${backServer}/community/${communityNo}?memberNo=${
          member ? member.memberNo : 0
        }`
      )
      .then((res) => {
        setCommunity(res.data);
      });
  }, [isUpdate]);

  const changeLike = (e) => {
    if (member) {
      if (community.isLike) {
        axios
          .delete(
            `${process.env.REACT_APP_BACK_SERVER}/community/${member.memberNo}?communityNo=${communityNo}`
          )
          .then((res) => {
            community.isLike = 0;
            community.likeCount = res.data;
            setCommunity({ ...community });
          });
      } else {
        axios
          .post(
            `${process.env.REACT_APP_BACK_SERVER}/community/${member.memberNo}?communityNo=${communityNo}`
          )
          .then((res) => {
            community.isLike = 1;
            community.likeCount = res.data;
            setCommunity({ ...community });
          });
      }
    }
  };

  const inputComment = (e) => {
    setNewComment(e.target.value);
  };

  const submitComment = () => {
    axios
      .post(
        `${process.env.REACT_APP_BACK_SERVER}/community/comment/${communityNo}`,
        {
          memberNo: member.memberNo,
          commentContent: newComment,
        }
      )
      .then((res) => {
        community.commentList.unshift(res.data);
        setCommunity({ ...community });
        setNewComment("");
      });
  };

  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);
  const changeFollow = (e) => {
    if (community.isFollow === 1) {
      setOpen(true);
    } else {
      axios
        .post(
          `${process.env.REACT_APP_BACK_SERVER}/community/follow/${member.memberNo}?followMemberNo=${community.memberNo}`
        )
        .then((res) => {
          setCommunity({ ...community, isFollow: 1 });
        });
    }

    e.stopPropagation();
  };
  const handleUnfollow = () => {
    axios
      .delete(
        `${process.env.REACT_APP_BACK_SERVER}/community/follow/${member.memberNo}?followMemberNo=${community.memberNo}`
      )
      .then((res) => {
        setCommunity({ ...community, isFollow: 0 });
        setOpen(false);
      });
  };

  const handleMenuClick = (e) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };
  const handleMenuClose = (e) => {
    e.stopPropagation();
    setAnchorEl(null);
  };

  const handleReport = (e) => {
    e.stopPropagation();
    navigate(`/community/update/${community.communityNo}`);
    handleMenuClose(e);
  };
  const handleBlock = (e) => {
    Swal.fire({
      title: "게시글 삭제",
      text: "ㄹㅇ 지울거임?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "삭제",
      cancelButtonText: "취소",
    }).then((res) => {
      if (res.isConfirmed) {
        axios
          .delete(
            `${process.env.REACT_APP_BACK_SERVER}/community/list/${community.communityNo}`
          )
          .then((res) => {
            navigate("/community/list");
          });
      }
    });
    e.stopPropagation();
    handleMenuClose(e);
  };

  return (
    <>
      <Modal
        open={open}
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
              bgcolor: "#1e1e1e", // 내부 박스 배경색 (dark mode 느낌)
              color: "#fff",
              textAlign: "center",
              padding: "24px 16px",
              paddingBottom: "0px",
            }}
          >
            <img
              src={
                community && community.memberThumb
                  ? `${process.env.REACT_APP_BACK_SERVER}/member/profileimg/${community.memberThumb}`
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
            {community && (
              <Typography sx={{ fontSize: "15px", marginBottom: "24px" }}>
                {community.memberId}님의 팔로우를 취소하시겠어요?
              </Typography>
            )}

            <button
              onClick={handleUnfollow}
              style={{
                width: "100%",
                padding: "12px 0",
                border: "none",
                borderTop: "1px solid #444",
                color: "#f33535",
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
      <div className="community-view">
        <div className="community-view-content">
          <div className="community-view-user">
            <div className="member-img">
              <img
                src={
                  community && community.memberThumb
                    ? `${process.env.REACT_APP_BACK_SERVER}/member/profileimg/${community.memberThumb}`
                    : "/image/default_img.png"
                }
                onClick={() => {
                  navigate(`/myfit/activity/${community.memberNo}`);
                }}
              />
            </div>

            <div className="community-member">
              {community && (
                <>
                  <p
                    onClick={() => {
                      navigate(`/myfit/activity/${community.memberNo}`);
                    }}
                  >
                    {community.memberId}
                  </p>
                  <p>{community.communityDate}</p>
                </>
              )}
            </div>
            <div>
              {member &&
                community &&
                member.memberId !== community.memberId && (
                  <button
                    type="button"
                    className={`follow-btn ${
                      community.isFollow === 1 ? "following" : ""
                    }`}
                    onClick={changeFollow}
                  >
                    {community.isFollow === 1 ? "팔로잉" : "팔로우"}
                  </button>
                )}
            </div>
            <div className="back-button">
              <ExitToAppIcon
                onClick={() => {
                  navigate("/community/list");
                }}
              />
            </div>
            {member && community && member.memberId === community.memberId && (
              <div className="community-sub-btn">
                <IconButton
                  aria-controls={menuOpen ? "community-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={menuOpen ? "true" : undefined}
                  onClick={handleMenuClick}
                  style={{ padding: "0" }}
                >
                  <MoreVertIcon style={{ color: "#fff" }} />
                </IconButton>
                <Menu
                  id="community-menu"
                  anchorEl={anchorEl}
                  open={menuOpen}
                  onClose={handleMenuClose}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                >
                  <MenuItem onClick={handleReport}>수정하기</MenuItem>
                  <MenuItem onClick={handleBlock}>삭제하기</MenuItem>
                </Menu>
              </div>
            )}
          </div>
          {community && (
            <div
              className="community-view-texteditor"
              dangerouslySetInnerHTML={{ __html: community.communityContent }}
            ></div>
          )}
          {community && (
            <div className="community-sub-zone view-btn">
              <div className="community-likes" onClick={changeLike}>
                {community.isLike ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                {community.likeCount}
              </div>
              <div className="community-comments">
                <ChatIcon />
                {community.commentCount}
              </div>
            </div>
          )}
          {member && (
            <div className="post-input">
              <div className="member-img">
                <img
                  src={
                    member.memberThumb
                      ? `${process.env.REACT_APP_BACK_SERVER}/member/profileimg/${member.memberThumb}`
                      : "/image/default_img.png"
                  }
                  onClick={() => {
                    navigate(`/myfit/activity/${community.memberNo}`);
                  }}
                />
              </div>
              <div className="comment-text-box">
                <input
                  type="text"
                  value={newComment}
                  onChange={inputComment}
                  onKeyUp={(e) => {
                    if (e.key === "Enter" && newComment.message !== "") {
                      submitComment();
                    }
                  }}
                  placeholder="댓글을 입력하세요..."
                ></input>
                <button onClick={submitComment}>send</button>
              </div>
            </div>
          )}
        </div>

        <div className="community-comment-list">
          <ul
            className={
              community && community.commentCount < 6
                ? ""
                : "community-comment-all-list"
            }
          >
            {community &&
              community.commentList.map((comment, index) => {
                return (
                  <Comment
                    key={"comment-" + JSON.stringify(comment)}
                    comment={comment}
                    member={member}
                    community={community}
                    setCommunity={setCommunity}
                    setIsUpdate={setIsUpdate}
                  />
                );
              })}
          </ul>
        </div>
      </div>
    </>
  );
};

const Comment = (props) => {
  const setIsUpdate = props.setIsUpdate;
  const [showComment, setShowComment] = useState(false);
  const navigate = useNavigate();
  const comment = props.comment;
  const member = props.member;

  const [updateComment, setUpdateComment] = useState("");
  useEffect(() => {
    setUpdateComment(comment.commentContent);
  }, []);
  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);

  const handleMenuClick = (e) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };
  const handleMenuClose = (e) => {
    e.stopPropagation();
    setAnchorEl(null);
  };
  const handleReport = (e) => {
    e.stopPropagation();
    setShowComment(!showComment);
    handleMenuClose(e);
  };
  const handleBlock = (e) => {
    Swal.fire({
      title: "댓글 삭제",
      text: "댓글을 삭제하시겠습니까?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "예",
      cancelButtonText: "아니오",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(
            `${process.env.REACT_APP_BACK_SERVER}/community/comment/${comment.commentNo}`
          )
          .then((res) => {
            setIsUpdate((prev) => !prev);
          });
      }
    });
    setShowComment(false);
    handleMenuClose(e);
  };
  const submitUpdateComment = () => {
    axios
      .patch(
        `${process.env.REACT_APP_BACK_SERVER}/community/comment/${comment.commentNo}`,
        {
          commentContent: updateComment,
        }
      )
      .then((res) => {
        if (res.data > 0) {
          setShowComment(false);
          //수정이 완료되면 기존에 있던 community 에 새로운 댓글이 들어가게 수정
          //1. 업데이트된 코멘트 번호를 가져옴
          //2. comment.commentNo 이거하고 community에서 commmentList find 해서 일치하는애 찾기
          // const oldComment = community.commentList.find((item, i) => {
          //   return item.commentNo === comment.commentNo;
          // });
          // oldComment.commentContent = updateComment;
          setIsUpdate((prev) => !prev);
        }
      });
  };

  return (
    <li className="comment-list">
      <div className="member-img">
        <img
          src={
            comment.memberThumb
              ? `${process.env.REACT_APP_BACK_SERVER}/member/profileimg/${comment.memberThumb}`
              : "/image/default_img.png"
          }
          onClick={() => {
            navigate(`/myfit/activity/${comment.memberNo}`);
          }}
        />
      </div>
      <div className="comment-user-info">
        <div className="member-id">
          <p
            className="member-comment-id"
            onClick={() => {
              navigate(`/myfit/activity/${comment.memberNo}`);
            }}
          >
            {comment.memberId}
          </p>
          {member && member.memberNo === comment.memberNo && (
            <div className="comment-sub-btn">
              <IconButton
                aria-controls={menuOpen ? "community-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={menuOpen ? "true" : undefined}
                onClick={handleMenuClick}
                style={{ padding: "0" }}
              >
                <MoreVertIcon style={{ color: "#fff" }} />
              </IconButton>
              <Menu
                id="community-menu"
                anchorEl={anchorEl}
                open={menuOpen}
                onClose={handleMenuClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
              >
                <MenuItem onClick={handleReport}>
                  {showComment ? "수정취소" : "수정하기"}
                </MenuItem>
                <MenuItem onClick={handleBlock}>삭제하기</MenuItem>
              </Menu>
            </div>
          )}
        </div>

        <div
          className="comment-user-content"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          {showComment ? (
            <div className="comment-text-box">
              <input
                type="text"
                value={updateComment}
                onChange={(e) => {
                  setUpdateComment(e.target.value);
                }}
                onKeyUp={(e) => {
                  if (e.key === "Enter" && comment.message !== "") {
                    submitUpdateComment();
                  }
                }}
              ></input>
              <button onClick={submitUpdateComment}>send</button>
            </div>
          ) : (
            comment.commentContent
          )}
        </div>
      </div>
    </li>
  );
};

export default CommunityView;
