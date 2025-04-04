import { useState, useEffect, useRef } from "react";
import CircleIcon from "@mui/icons-material/Circle";
import { useRecoilState, useRecoilValue } from "recoil";
import { isLoginState, memberState } from "../utils/RecoilData";
import { useNavigate } from "react-router-dom"; // 관리자만 접근 제한을 위해 추가
import axios from "axios";
import { Client } from "@stomp/stompjs";

const AdminChat = () => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const isLogin = useRecoilValue(isLoginState);
  const [memberInfo, setMemberInfo] = useRecoilState(memberState);
  const navigate = useNavigate();

  const [chatList, setChatList] = useState([]);
  const [selectedChatRoom, setSelectedChatRoom] = useState(null);
  const [chatRooms, setChatRooms] = useState([]);
  useEffect(() => {
    axios
      .get(`${backServer}/chat/list`)
      .then((res) => {
        console.log(res);
        setChatRooms(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  const handleSelectChatRoom = (chatRoomNo) => {
    setSelectedChatRoom(chatRoomNo);
    setChatRooms((prevRooms) =>
      prevRooms.map((room) =>
        room.chatRoomNo === chatRoomNo ? { ...room, unreadCount: 0 } : room
      )
    );
  };

  return (
    <section className="admin-chat-section">
      <div className="page-title">문의 관리</div>
      <div className="admin-chat-box">
        <div className="chat-list-box">
          <AdminChatList
            chatRooms={chatRooms}
            onSelectChatRoom={handleSelectChatRoom}
          />
        </div>
        <div className="chat-box-view">
          {selectedChatRoom ? (
            <AdminChatView selectedChatRoom={selectedChatRoom} />
          ) : (
            <div className="empty-chat-view">채팅방을 선택하세요</div>
          )}
        </div>
      </div>
    </section>
  );
};

const AdminChatList = ({ chatRooms, onSelectChatRoom }) => {
  return (
    <div className="chat-list">
      {chatRooms.map((room) => (
        <div
          key={room.chatRoomNo}
          className="chat-room"
          onClick={() => onSelectChatRoom(room.chatRoomNo)}
        >
          <div className="member-chat-profile">
            {room.memberThumb ? (
              `${process.env.REACT_APP_BACK_SERVER}/member/profileimg/${room.memberThumb}`
            ) : (
              <img src="/image/default_img.png" alt="프로필" />
            )}
          </div>
          <div className="chat-room-main">
            <div className="member-chat-id">
              <div>{room.chatMemberId}</div>
            </div>
            <div className="member-chat-content">
              <div>
                {room.chatRoomMessage
                  ? room.chatRoomMessage
                  : "아직 입력된 채팅이 없습니다."}
              </div>
            </div>
          </div>
          {room.unreadCount > 0 && (
            <div className="member-chat-alarm">
              <CircleIcon />
              <span className="alarm-count">{room.unreadCount}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const AdminChatView = ({ selectedChatRoom }) => {
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const memberInfo = useRecoilValue(memberState); // 현재 로그인한 회원 정보 가져오기
  const isLogin = useRecoilValue(isLoginState); //로그인 후 채팅을 위해서 로그인 상태
  const [loginId, setLoginId] = useRecoilState(memberState); //채팅 식별자로 아이디 사용
  const [chatList, setChatList] = useState([]); //채팅메세지가 저장될 배열
  const [ws, setWs] = useState({});
  const [chatMsg, setChatMsg] = useState({});
  const backServer = process.env.REACT_APP_BACK_SERVER; //http://192.168.10.34:9999
  const socketServer = backServer.replace("http://", "ws://"); //ws://192.168.10.34:9999
  /*
  useEffect(() => {
    // WebSocket 연결
    const client = new Client({
      brokerURL: `${socketServer}/inMessage`, // Spring Boot WebSocket 서버 주소
      reconnectDelay: 10000,
      onConnect: () => {
        console.log("Connected to WebSocket");

        // 채팅 메시지 구독
        client.subscribe(`/topic/chat/${selectedChatRoom}`, (message) => {
          const receivedMessage = JSON.parse(message.body);
          setMessages((prevMessages) => [...prevMessages, receivedMessage]);
        });
      },
      onDisconnect: () => console.log("Disconnected from WebSocket"),
    });

    client.activate();
    setStompClient(client);

    // 기존 채팅 기록 불러오기
    axios
      .get(`${backServer}/chat/selectChatRoom?chatRoomId=${chatRoomId}`)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });

    return () => {
      client.deactivate();
    };
  }, [chatRoomId]);

  const sendMessage = () => {
    if (stompClient && message.trim() !== "") {
      const chatMessage = {
        senderId: userId,
        content: message,
        chatRoomId,
        memberLevel,
      };
      stompClient.publish({
        destination: `/app/chat/${chatRoomId}`,
        body: JSON.stringify(chatMessage),
      });
      setMessage("");
    }
  };
  */
  const sendMessage = () => {};
  return (
    <>
      <div className="chat-box">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={
              memberInfo?.memberLevel === 1 // 관리자 여부를 member_level로 판단
                ? "admin-chat-line"
                : "member-chat-line"
            }
          >
            {memberInfo?.memberLevel !== 1 && (
              <div className="member-chat-profile">
                <img src="/image/default_img.png" alt="프로필" />
              </div>
            )}
            <div className="chat-content">
              <div className="chat-id">
                {memberInfo?.memberLevel === 1 ? "관리자" : msg.memberId} -{" "}
                {msg.sentAt}
              </div>
              <div className="chat-text">{msg.content}</div>
            </div>
            {memberInfo?.memberLevel === 1 && (
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
          onKeyUp={(e) => {
            if (e.key === "Enter" && chatMsg.message !== "") {
              sendMessage();
            }
          }}
          placeholder="메시지를 입력하세요."
        />
        <button type="button" onClick={sendMessage}>
          전송
        </button>
      </div>
    </>
  );
};

export default AdminChat;
