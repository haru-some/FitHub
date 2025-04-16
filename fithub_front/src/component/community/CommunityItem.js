import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChatIcon from "@mui/icons-material/Chat";
import axios from "axios";
import Swal from "sweetalert2";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import dayjs from "dayjs";

const CommunityItem = (props) => {
  const memberNo = props.memberNo;
  const index = props.index;
  const page = props.page;
  const communityList = props.communityList;
  const setCommunityList = props.setCommunityList;
  const member = props.member;
  const community = props.community;

  const navigate = useNavigate();
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

  const handleStatus = (e) => {
    const communityStatus = community.communityStatus === 1 ? 2 : 1;
    const obj = {
      communityNo: community.communityNo,
      communityStatus: communityStatus,
      page: page,
      memberNo: member ? member.memberNo : 0,
    };
    axios
      .patch(`${process.env.REACT_APP_BACK_SERVER}/community/list`, obj)
      .then((res) => {
        if (memberNo === "") {
          const nCommunity = communityList.filter((item) => {
            return item.communityNo !== community.communityNo;
          });
          setCommunityList([...nCommunity, res.data]);
        } else {
          //배열 item 하나씩 순회 후 수정하고자 한 커뮤니티 번호 찾아서 communityStatus 수정 한 updatedList 리턴
          const updatedList = communityList.map((item) => {
            if (item.communityNo === community.communityNo) {
              return {
                ...item,
                communityStatus: communityStatus,
              };
            }
            return item;
          });
          setCommunityList(updatedList);
        }
      });
    e.stopPropagation();
    handleMenuClose(e);
  };

  const handleReport = (e) => {
    e.stopPropagation();
    navigate(`/community/update/${community.communityNo}`);
    handleMenuClose(e);
  };
  const handleBlock = (e) => {
    Swal.fire({
      title: "게시글 삭제",
      text: "게시글을 삭제하시겠습니까?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#589c5f",
      confirmButtonText: "삭제",
      cancelButtonText: "취소",
    }).then((res) => {
      if (res.isConfirmed) {
        axios
          .delete(
            `${process.env.REACT_APP_BACK_SERVER}/community/list/${community.communityNo}?page=${page}&memberNo=${member.memberNo}`
          )
          .then((res) => {
            const newCommunity = communityList.filter((item) => {
              return item.communityNo !== community.communityNo;
            });
            setCommunityList([...newCommunity, res.data]);
          });
      }
    });
    e.stopPropagation();
    handleMenuClose(e);
  };

  const changeLike = (e) => {
    if (member) {
      if (community.isLike === 1) {
        axios
          .delete(
            `${process.env.REACT_APP_BACK_SERVER}/community/${member.memberNo}?communityNo=${community.communityNo}`
          )
          .then((res) => {
            communityList[index].isLike = 0;
            communityList[index].likeCount = res.data;
            setCommunityList([...communityList]);
          });
      } else {
        axios
          .post(
            `${process.env.REACT_APP_BACK_SERVER}/community/${member.memberNo}?communityNo=${community.communityNo}`
          )
          .then((res) => {
            communityList[index].isLike = 1;
            communityList[index].likeCount = res.data;
            setCommunityList([...communityList]);
          });
      }
    }

    e.stopPropagation();
  };

  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);
  const changeFollow = (e) => {
    e.stopPropagation();
    if (community.isFollow === 1) {
      setOpen(true);
    } else {
      axios
        .post(
          `${process.env.REACT_APP_BACK_SERVER}/community/follow/${member.memberNo}?followMemberNo=${community.memberNo}`
        )
        .then((res) => {
          const arr = communityList.map((item) => {
            if (item.memberNo === community.memberNo) {
              item.isFollow = 1;
            }
            return item;
          });

          setCommunityList([...arr]);
        });
    }
  };

  const handleUnfollow = () => {
    axios
      .delete(
        `${process.env.REACT_APP_BACK_SERVER}/community/follow/${member.memberNo}?followMemberNo=${community.memberNo}`
      )
      .then((res) => {
        const arr = communityList.map((item) => {
          if (item.memberNo === community.memberNo) {
            item.isFollow = 0;
          }
          return item;
        });
        setCommunityList([...arr]);
        setOpen(false);
      });
  };
  {
    /*게시물 올린 시간 계산*/
  }
  const formatTimeAgo = (timeString) => {
    const now = dayjs();
    const past = dayjs(timeString);

    const diffInSeconds = now.diff(past, "second");
    const diffInMinutes = now.diff(past, "minute");
    const diffInHours = now.diff(past, "hour");
    const diffInDays = now.diff(past, "day");

    if (diffInSeconds < 60) {
      return `${diffInSeconds}초 전`;
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes}분 전`;
    } else if (diffInHours < 24) {
      return `${diffInHours}시간 전`;
    } else {
      return `${diffInDays}일 전`;
    }
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
            <Typography sx={{ fontSize: "15px", marginBottom: "24px" }}>
              @{community.memberId}님의 팔로우를 취소하시겠어요?
            </Typography>

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

      <li
        className="community-post-item"
        onClick={() => {
          navigate(`/community/view/${community.communityNo}`);
        }}
      >
        <div className="user-info">
          <div className="member-img">
            <img
              src={
                community && community.memberThumb
                  ? `${process.env.REACT_APP_BACK_SERVER}/member/profileimg/${community.memberThumb}`
                  : "/image/profile.png"
              }
              onClick={(e) => {
                navigate(`/myfit/activity/${community.memberNo}`);
                e.stopPropagation();
              }}
            />
          </div>
          <div className="community-member">
            <p
              className="community-list-member-id"
              onClick={(e) => {
                navigate(`/myfit/activity/${community.memberNo}`);
                e.stopPropagation();
              }}
            >
              {community.memberId}
            </p>
            <p className="community-list-date">
              {formatTimeAgo(community.communityDate)}
            </p>
          </div>
          <div className="community-list-status">
            <p>{community.communityStatus === 1 ? "" : "비공개"}</p>
          </div>
          {member && member.memberNo !== community.memberNo && (
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
          {member && member.memberNo === community.memberNo && (
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
                <MenuItem onClick={handleStatus}>
                  {community.communityStatus === 1 ? "비공개" : "공개"}
                </MenuItem>
                <MenuItem onClick={handleReport}>수정하기</MenuItem>
                <MenuItem onClick={handleBlock}>삭제하기</MenuItem>
              </Menu>
            </div>
          )}
        </div>
        <div
          className="community-content-texteditor"
          dangerouslySetInnerHTML={{ __html: community.communityContent }}
        ></div>

        <div className="community-sub-zone">
          <div className="community-likes" onClick={changeLike}>
            {community.isLike === 1 ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            {community.likeCount}
          </div>
          <div className="community-comments">
            <ChatIcon />
            {community.commentCount}
          </div>
        </div>
      </li>
    </>
  );
};

export default CommunityItem;
