import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ChatIcon from "@mui/icons-material/Chat";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRecoilState } from "recoil";
import { memberState } from "../utils/RecoilData";

const CommunityView = () => {
  const [member, setMember] = useRecoilState(memberState);
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const params = useParams();
  const communityNo = params.communityNo;
  const [community, setCommunity] = useState(null);
  const [isLike, setIsLike] = useState(false);
  const navigate = useNavigate();
  const [newComment, setNewComment] = useState("");
  const [commentState, setCommentState] = useState(0);

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
          <div className="community-follow-btn">
            {member && (
              <button type="button" className="follow-btn">
                팔로우
              </button>
            )}
          </div>
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
              return <Comment key={"comment-" + index} comment={comment} />;
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
  const comment = props.comment;

  return (
    <li className="comment-list">
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
        <div className="member-id">{comment.memberId}</div>
        <div className="comment-user-content">{comment.commentContent}</div>
      </div>
    </li>
  );
};

export default CommunityView;
