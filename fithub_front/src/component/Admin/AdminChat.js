import { useState, useEffect, useRef } from "react";
import CircleIcon from "@mui/icons-material/Circle";
import { useRecoilState, useRecoilValue } from "recoil";
import { isLoginState, memberState } from "../utils/RecoilData";
import { useNavigate } from "react-router-dom"; // 관리자만 접근 제한을 위해 추가
import axios from "axios";

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
            <img src="/image/default_img.png" alt="프로필" />
          </div>
          <div className="chat-room-main">
            <div className="member-chat-id">
              <div>{room.memberId}</div>
            </div>
            <div className="member-chat-content">
              <div>{room.lastMessage}</div>
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
  const [chatMsg, setChatMsg] = useState({
    type: "enter",
    memberId: loginId,
    message: "",
  });
  const backServer = process.env.REACT_APP_BACK_SERVER; //http://192.168.10.34:9999
  const socketServer = backServer.replace("http://", "ws://"); //ws://192.168.10.34:9999

  useEffect(() => {
    const socket = new WebSocket(`${socketServer}/allChat`); //ws://192.168.10.34:9999/allChat
    setWs(socket);
    //useEffect() 함수 내부의 return 함수는 컴포넌트가 언마운트될 때 동작해야할 코드를 작성하는 영역 -> 해당 페이지를 벗어날 때 초기화해야 하는게 있으면 여기서
    return () => {
      console.log("채팅페이지에서 벗어나면");
      socket.close();
    };
  }, []);

  const chatDiv = useRef(null);
  useEffect(() => {
    if (chatDiv.current) {
      chatDiv.current.scrollTop = chatDiv.current.scrollHeight;
    }
  }, [chatList]);

  const startChat = () => {
    console.log("웹소켓 연결이 되면 실행되는 함수");
    //데이터를 주고 받을 때는 문자열 밖에 안됨
    const data = JSON.stringify(chatMsg); //전송할 데이터 객체를 문자열로 변환
    ws.send(data); //매개변수로 전달한 문자열을 연결된 웹소켓 서버로 전송
    setChatMsg({ ...chatMsg, type: "chat" }); //최초 접속 이후에는 채팅만 보낸 예정이므로 미리 작업
  };
  const receiveMsg = (receiveData) => {
    console.log("서버에서 데이터를 받으면 실행되는 함수");
    const data = JSON.parse(receiveData.data); //문자열을 javascript 객체형식으로 전환
    console.log(data);
    setChatList([...chatList, data]);
  };
  const endChat = () => {
    console.log("웹소켓 연결이 끊어지면 실행되는 함수");
  };
  ws.onopen = startChat;
  ws.onmessage = receiveMsg;
  ws.onclose = endChat;
  const sendMessage = () => {
    const data = JSON.stringify(chatMsg);
    ws.send(data);
    setChatMsg({ ...chatMsg, message: "" });
  };

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
