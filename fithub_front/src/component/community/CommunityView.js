import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChatIcon from "@mui/icons-material/Chat";

const CommunityView = () => {
  return (
    <div className="community-view">
      <div className="post-header">
        <img className="profile-pic" src="/image/씨범.webp" alt="Profile" />
        <div className="community-user-info">
          <p>CBUM</p>
          <button type="button" className="follow-btn">
            팔로우
          </button>
          <p className="community-date">2025-03-24</p>
        </div>
      </div>
      <div className="post-content">
        <p className="post-caption">오늘 등근육 훈련 했다 독특근</p>
        <img className="post-image" src="/image/씨범.webp" alt="Post" />
      </div>
      <div className="post-actions">
        <div className="post-likes">
          <FavoriteBorderIcon />
          <span>284</span>
        </div>
        <div className="post-comments">
          <ChatIcon />
          <span>85</span>
        </div>
      </div>
      <div className="post-comments-section">
        <div className="comment">
          <img
            className="comment-profile-pic"
            src="https://via.placeholder.com/30"
            alt="Profile"
          />
          <div className="comment-text">
            <p className="comment-user">KING.JOJI</p>
            <p className="comment-content">
              씨범이형 상체는 여전하네 이제 나랑 하체 부러트리러 가자
            </p>
          </div>
        </div>
        <div className="comment">
          <img
            className="comment-profile-pic"
            src="https://via.placeholder.com/30"
            alt="Profile"
          />
          <div className="comment-text">
            <p className="comment-user">S.LINE</p>
            <p className="comment-content">
              씨범이 오빠 나 다이어트 하는거 도와주라잉..
            </p>
          </div>
        </div>
      </div>
      <div className="post-input">
        <textarea
          placeholder="댓글을 입력하세요..."
          className="input-box"
        ></textarea>
      </div>
    </div>
  );
};

export default CommunityView;
