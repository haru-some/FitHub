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
import Swal from "sweetalert2";

const CommunityView = () => {
  const [member, setMember] = useRecoilState(memberState);
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const params = useParams();
  const communityNo = params.communityNo;
  //불러온 게시글 저장하는 state -> 댓글이 입력되면 새로 게시글 조회해오게 해야함
  const [community, setCommunity] = useState(null);
  const [isLike, setIsLike] = useState(false);
  const navigate = useNavigate();
  //서버 전송용 state가 newComment
  const [newComment, setNewComment] = useState("");
  const [commentState, setCommentState] = useState(0);
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
      })
      .catch((err) => {});
  }, [isLike, commentState]);

  useEffect(() => {
    if (community) {
      setIsLike(community.isLike === 1);
    }
  }, [community]);

  const changeLike = (e) => {
    if (member) {
      if (isLike) {
        axios
          .delete(
            `${process.env.REACT_APP_BACK_SERVER}/community/${member.memberNo}?communityNo=${communityNo}`
          )
          .then((res) => {
            setIsLike(!isLike);
          });
      } else {
        axios
          .post(
            `${process.env.REACT_APP_BACK_SERVER}/community/${member.memberNo}?communityNo=${communityNo}`
          )
          .then((res) => {
            setIsLike(!isLike);
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
        if (res.data > 0) {
          setCommentState(commentState + 1);
        }
        setNewComment("");
      });
  };

  const changeFollow = (e) => {
    if (community.isFollow === 1) {
      Swal.fire({
        title: "팔로우 취소",
        text: "정말 팔로우를 취소하시겠습니까?",
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
              `${process.env.REACT_APP_BACK_SERVER}/community/follow/${member.memberNo}?followMemberNo=${community.memberNo}`
            )
            .then((res) => {
              setCommunity({ ...community, isFollow: 0 });
            });
        }
      });
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

  const handleMenuClick = (e) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };
  const handleMenuClose = (e) => {
    e.stopPropagation();
    setAnchorEl(null);
  };
  // 메뉴 항목 처리 함수 예시
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
            console.log(res);
            navigate("/community/list");
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
    e.stopPropagation();
    handleMenuClose(e);
  };

  return (
    <div className="community-view">
      <div className="community-view-content">
        <div
          className="community-view-user"
          onClick={() => {
            navigate(`/myfit/activity/${community.memberNo}`);
          }}
        >
          <div className="member-img">
            <img
              src={
                community && community.memberThumb
                  ? `${process.env.REACT_APP_BACK_SERVER}/member/profileimg/${community.memberThumb}`
                  : "/image/default_img.png"
              }
            />
          </div>

          <div className="community-member">
            {community && (
              <>
                <p>{community.memberId}</p>
                <p>{community.communityDate}</p>
              </>
            )}
          </div>
          <div>
            {member && community && member.memberId !== community.memberId && (
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
          {member && community && member.memberId === community.memberId && (
            <div className="community-sub-btn">
              <IconButton
                aria-controls={menuOpen ? "community-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={menuOpen ? "true" : undefined}
                onClick={handleMenuClick}
                style={{ marginLeft: "auto" }}
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
      </div>
      <div className="community-comment-list">
        <ul>
          {community &&
            community.commentList.map((comment, index) => {
              return (
                <Comment
                  key={"comment-" + index}
                  comment={comment}
                  member={member}
                  commentState={commentState}
                  setCommentState={setCommentState}
                />
              );
            })}
        </ul>
      </div>
      <div className="post-input">
        <div className="member-img">
          <img src="/image/default_img.png"></img>
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
    </div>
  );
};

const Comment = (props) => {
  const [showComment, setShowComment] = useState(false);
  const navigate = useNavigate();

  const comment = props.comment;
  const commentState = props.commentState;
  const setCommentState = props.setCommentState;
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
            setCommentState(commentState + 1);
          });
      }
    });
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
        console.log(res);
        if (res.data > 0) {
          setShowComment(false);
          setCommentState(commentState + 1);
        }
      });
  };

  return (
    <li
      className="comment-list"
      onClick={() => {
        navigate(`/myfit/activity/${comment.memberNo}`);
      }}
    >
      <div className="member-img">
        <img
          src={
            comment.memberThumb
              ? `${process.env.REACT_APP_BACK_SERVER}/member/profileimg/${comment.memberThumb}`
              : "/image/default_img.png"
          }
        />
      </div>
      <div className="comment-user-info">
        <div className="member-id">
          {comment.memberId}
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
                <MenuItem onClick={handleReport}>수정하기</MenuItem>
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
