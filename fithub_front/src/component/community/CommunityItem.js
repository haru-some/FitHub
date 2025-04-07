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

const CommunityItem = (props) => {
  const page = props.page;
  const communityList = props.communityList;
  const setCommunityList = props.setCommunityList;
  const member = props.member;
  const community = props.community;
  const [isLike, setIsLike] = useState(community.isLike === 1);
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
            `${process.env.REACT_APP_BACK_SERVER}/community/list/${community.communityNo}?page=${page}&memberNo=${member.memberNo}`
          )
          .then((res) => {
            const newCommunity = communityList.filter((item) => {
              return item.communityNo !== community.communityNo;
            });
            console.log(newCommunity);
            setCommunityList([...newCommunity, res.data]);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
    e.stopPropagation();
    handleMenuClose(e);
  };

  const changeLike = (e) => {
    if (member) {
      if (isLike) {
        axios
          .delete(
            `${process.env.REACT_APP_BACK_SERVER}/community/${member.memberNo}?communityNo=${community.communityNo}`
          )
          .then((res) => {
            const obj = communityList.filter(
              (item, i) => item.communityNo === community.communityNo
            )[0];
            const idx = communityList.indexOf(
              communityList.filter(
                (item, i) => item.communityNo === community.communityNo
              )[0]
            );
            obj["likeCount"] = res.data;
            communityList[idx] = obj;

            setCommunityList([...communityList]);
            setIsLike(false);
          });
      } else {
        axios
          .post(
            `${process.env.REACT_APP_BACK_SERVER}/community/${member.memberNo}?communityNo=${community.communityNo}`
          )
          .then((res) => {
            const obj = communityList.filter(
              (item, i) => item.communityNo === community.communityNo
            )[0];
            const idx = communityList.indexOf(
              communityList.filter(
                (item, i) => item.communityNo === community.communityNo
              )[0]
            );
            obj["likeCount"] = res.data;
            communityList[idx] = obj;

            setCommunityList([...communityList]);
            setIsLike(true);
          });
      }
    }

    e.stopPropagation();
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
              const arr = communityList.map((item) => {
                if (item.memberNo === community.memberNo) {
                  item.isFollow = 0;
                }
                return item;
              });

              setCommunityList([...arr]);
            });
        }
      });
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
    e.stopPropagation();
  };
  return (
    <li
      className="community-post-item"
      onClick={() => {
        navigate(`/community/view/${community.communityNo}`);
      }}
    >
      <div
        className="user-info"
        onClick={(e) => {
          navigate(`/myfit/activity/${community.memberNo}`);
          e.stopPropagation();
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
          <p>{community.memberId}</p>
          {member && member.memberId !== community.memberId && (
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
        {member && member.memberId === community.memberId && (
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
      <div
        className="community-content-texteditor"
        dangerouslySetInnerHTML={{ __html: community.communityContent }}
      ></div>

      <div className="community-sub-zone">
        <div className="community-likes" onClick={changeLike}>
          {isLike ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          {community.likeCount}
        </div>
        <div className="community-comments">
          <ChatIcon />
          {community.commentCount}
        </div>
      </div>
    </li>
  );
};

export default CommunityItem;
