import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChatIcon from "@mui/icons-material/Chat";
import axios from "axios";
import Swal from "sweetalert2";
const CommunityItem = (props) => {
  const communityList = props.communityList;
  const setCommunityList = props.setCommunityList;
  const member = props.member;
  const community = props.community;
  const [isLike, setIsLike] = useState(community.isLike === 1);

  const navigate = useNavigate();

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
              // const obj = communityList.filter(
              //   (item, i) => item.communityNo === community.communityNo
              // )[0];
              // const idx = communityList.indexOf(
              //   communityList.filter(
              //     (item, i) => item.communityNo === community.communityNo
              //   )[0]
              // );
              // obj["isFollow"] = 0;
              // communityList[idx] = obj;

              // setCommunityList([...communityList]);
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
          // const obj = communityList.filter(
          //   (item, i) => item.communityNo === community.communityNo
          // )[0];
          // const idx = communityList.indexOf(
          //   communityList.filter(
          //     (item, i) => item.communityNo === community.communityNo
          //   )[0]
          // );
          // obj["isFollow"] = 1;
          // communityList[idx] = obj;

          // setCommunityList([...communityList]);
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
          <img src="/image/default_img.png"></img>
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
