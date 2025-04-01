import { useState, useEffect } from "react";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import CircleIcon from "@mui/icons-material/Circle";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import WebSocketService from "../utils/WebSocketService";

const AdminChat = () => {
  const [selectedChatRoom, setSelectedChatRoom] = useState(null);

  return (
    <section className="admin-chat-section">
      <div className="page-title">문의 관리</div>
      <div className="admin-chat-box">
        <div className="chat-list-box">
          <AdminChatList onSelectChatRoom={setSelectedChatRoom} />
        </div>
        <div className="chat-box-view">
          {selectedChatRoom ? (
            <AdminChatView chatRoomId={selectedChatRoom} />
          ) : (
            <div className="empty-chat-view">채팅방을 선택하세요</div>
          )}
        </div>
      </div>
    </section>
  );
};

// ✅ 채팅방 목록
const AdminChatList = ({ onSelectChatRoom }) => {
  const chatRooms = [
    { chatRoomNo: 1, userId: "user1", lastMessage: "안녕하세요!" },
    { chatRoomNo: 2, userId: "user2", lastMessage: "문의합니다." },
  ];

  return (
    <div className="chat-list">
      {chatRooms.map((room) => (
        <div
          key={room.chatRoomNo}
          className="chat-room"
          onClick={() => onSelectChatRoom(room.chatRoomNo)}
        >
          <div className="member-chat-profile">
            <img src="/image/default_img.png" alt="프로필" />
          </div>
          <div className="chat-room-main">
            <div className="member-chat-id">
              <div>{room.userId}</div>
            </div>
            <div className="member-chat-content">
              <div>{room.lastMessage}</div>
            </div>
          </div>
          <div className="member-chat-alarm">
            <CircleIcon />
            <span className="alarm-count">5</span>
          </div>
        </div>
      ))}
    </div>
  );
};

// ✅ 선택된 채팅방의 메시지 표시 + WebSocket 기능 추가
const AdminChatView = ({ chatRoomId }) => {
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");

  useEffect(() => {
    WebSocketService.connect(chatRoomId);

    WebSocketService.on("message", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      WebSocketService.disconnect();
    };
  }, [chatRoomId]);

  const messageSend = () => {
    if (chatInput.trim() !== "") {
      const message = {
        chatRoomNo: chatRoomId,
        memberId: "kingjoji", // 관리자 ID (예제)
        content: chatInput,
        messageType: "CHAT",
      };
      WebSocketService.sendMessage(message);
      setChatInput("");
    }
  };

  return (
    <>
      <div className="chat-box">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={
              msg.memberId === "kingjoji"
                ? "admin-chat-line"
                : "member-chat-line"
            }
          >
            {msg.memberId !== "kingjoji" && (
              <div className="member-chat-profile">
                <img src="/image/default_img.png" alt="프로필" />
              </div>
            )}
            <div className="chat-content">
              <div className="chat-id">
                {msg.memberId === "kingjoji" ? "관리자" : msg.memberId} -{" "}
                {msg.sentAt}
              </div>
              <div className="chat-text">{msg.content}</div>
            </div>
            {msg.memberId === "kingjoji" && (
              <div className="admin-chat-profile">
                <img src="/image/default_img.png" alt="관리자" />
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="chat-input-box">
        <input
          type="text"
          className="chat-input"
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          placeholder="메시지를 입력하세요."
        />
        <button type="button" onClick={messageSend}>
          전송
        </button>
      </div>
    </>
  );
};

export default AdminChat;
