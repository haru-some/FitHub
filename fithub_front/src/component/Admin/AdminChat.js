import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import CircleIcon from "@mui/icons-material/Circle";
import { useNavigate } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useState } from "react";

const AdminChat = () => {
  const navigate = useNavigate();
  return (
    <section className="admin-chat-section">
      <div className="page-title">문의 관리</div>
      <div className="admin-chat-box">
        <div className="chat-list-box">
          <AdminChatList />
        </div>
        <div className="chat-box-view">
          <AdminChatView />
        </div>
      </div>
    </section>
  );
};

const AdminChatList = () => {
  return (
    <div className="chat-list">
      <div className="chat-room">
        <div className="member-chat-profile">
          <img src="/image/default_img.png" />
        </div>
        <div className="chat-room-main">
          <div className="member-chat-id">
            <div>회원 아이디</div>
          </div>
          <div className="member-chat-content">
            <div>
              마지막 문의 내용 대충 여기가 마지막이라는 엄청 대단하진 않지만
              그냥 멋진 말
            </div>
          </div>
        </div>
        <div className="member-chat-alarm">
          <CircleIcon />
          <span className="alarm-count">5</span>
        </div>
      </div>
    </div>
  );
};

const AdminChatView = () => {
  const [chatView, setChatView] = useState(false);
  const [chatInput, setChatInput] = useState();
  const messageSend = () => {
    if (chatInput.trim() !== "") {
      // onSendMessage(chatInput);

      setChatInput("");
    }
  };
  return (
    <>
      <div className="chat-box">
        <div className="member-chat-line">
          <div className="member-chat-profile">
            <img src="/image/default_img.png" />
          </div>
          <div className="member-chat-main">
            <div className="member-chat-id">
              <div>킹조지</div>
              <div>2025-04-01</div>
              {chatView ? <VisibilityIcon /> : <VisibilityOffIcon />}
            </div>
            <div className="member-chat-content">
              <div className="member-chat-text">
                킹조지가 열변을 토하는 중 킹조지가 열변을 토하는 중 킹조지가
                열변을 토하는 중 킹조지가 열변을 토하는 중 킹조지가 열변을
                토하는 중 킹조지가 열변을 토하는 중 킹조지가 열변을 토하는 중
                킹조지가 열변을 토하는 중 킹조지가 열변을 토하는 중 킹조지가
                열변을 토하는 중 킹조지가 열변을 토하는 중
              </div>
            </div>
          </div>
        </div>
        <div className="admin-chat-line">
          <div className="admin-chat-main">
            <div className="admin-chat-id">
              {chatView ? <VisibilityIcon /> : <VisibilityOffIcon />}
              <div>2025-04-01</div>
              <div>관리자</div>
            </div>
            <div className="admin-chat-content">
              <div className="admin-chat-text">그냥 죽어</div>
            </div>
          </div>
          <div className="admin-chat-profile">
            <img src="/image/default_img.png" />
          </div>
        </div>
      </div>
      <div className="chat-input-box">
        <input
          type="text"
          className="chat-input"
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          placeholder="메시지를 입력해주세요."
        />
        <button type="button" onClick={messageSend}>
          전송
        </button>
      </div>
    </>
  );
};

export default AdminChat;
