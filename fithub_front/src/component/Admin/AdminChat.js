import { useState, useEffect, useRef } from "react";
import CircleIcon from "@mui/icons-material/Circle";
import { useRecoilState, useRecoilValue } from "recoil";
import { isLoginState, memberState } from "../utils/RecoilData";
import { useNavigate } from "react-router-dom"; // 관리자만 접근 제한을 위해 추가
import axios from "axios";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

const AdminChat = () => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const socketServer = backServer.replace("http://", "ws://"); //ws://192.168.10.34:9999
  const socket = new SockJS(`${backServer}/inMessage`);
  const [selectedChatRoom, setSelectedChatRoom] = useState(null);
  const [chatRooms, setChatRooms] = useState([]);
  const [alarm, setAlarm] = useState(0);
  const [messages, setMessages] = useState([]);
  const [stompClient, setStompClient] = useState(null);
  const memberInfo = useRecoilValue(memberState); // 현재 로그인한 회원 정보 가져오기

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
  }, [alarm]);

  useEffect(() => {
    // WebSocket 연결
    const client = new Client({
      // brokerURL: `${socketServer}/inMessage`, // Spring Boot WebSocket 서버 주소
      webSocketFactory: () => socket,
      reconnectDelay: 10000,
      connectHeaders: {
        Authorization: memberInfo.memberNo,
      },
      onConnect: () => {
        console.log("Connected to WebSocket");

        // 채팅 메시지 구독
        client.subscribe(
          `/topic/chat/messages/${selectedChatRoom}`,
          (message) => {
            const receivedMessage = JSON.parse(message.body);
            setMessages((prevMessages) => [...prevMessages, receivedMessage]);
          }
        );

        client.subscribe("/queue/notifications", (message) => {
          // 받은 메시지가 "1"일 경우 알림을 처리
          const receivedMessage = parseInt(message.body, 10);
          if (receivedMessage === 1) {
            console.log("New message in another room!");
            setAlarm((prev) => prev + 1); // 알림 숫자 증가 (예시로 알림 숫자 카운트)
          }
        });
      },
      onDisconnect: () => {
        console.log("Disconnected from WebSocket");
      },
    });

    client.activate();
    setStompClient(client);

    return () => {
      client.deactivate();
    };
  }, [selectedChatRoom]);

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
      <div className="admin-chat-box">
        <div className="chat-list-box">
          <AdminChatList
            chatRooms={chatRooms}
            handleSelectChatRoom={handleSelectChatRoom}
            selectedChatRoom={selectedChatRoom}
          />
        </div>
        <div className="chat-box-view">
          {selectedChatRoom ? (
            <AdminChatView
              selectedChatRoom={selectedChatRoom}
              messages={messages}
              setMessages={setMessages}
              memberInfo={memberInfo}
              stompClient={stompClient}
            />
          ) : (
            <div className="empty-chat-view">채팅방을 선택하세요</div>
          )}
        </div>
      </div>
    </section>
  );
};
/*---------- 채팅 리스트 ----------*/
const AdminChatList = ({
  chatRooms,
  handleSelectChatRoom,
  selectedChatRoom,
}) => {
  return (
    <div className="chat-list">
      {chatRooms.map((room) => {
        const isActive = room.chatRoomNo === selectedChatRoom;
        return (
          <div
            key={room.chatRoomNo}
            className={`chat-room ${isActive ? "active-room" : ""}`}
            onClick={() => handleSelectChatRoom(room.chatRoomNo)}
          >
            <div className="member-chat-profile">
              {room.memberThumb ? (
                <img
                  src={`${process.env.REACT_APP_BACK_SERVER}/member/profileimg/${room.memberThumb}`}
                />
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
                  {room.lastMessage
                    ? room.lastMessage
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
        );
      })}
    </div>
  );
};

/*---------- 채팅방 ----------*/
const AdminChatView = ({
  selectedChatRoom,
  messages,
  setMessages,
  memberInfo,
  stompClient,
}) => {
  const [chatInput, setChatInput] = useState("");
  const backServer = process.env.REACT_APP_BACK_SERVER; //http://192.168.10.34:9999

  useEffect(() => {
    // 기존 채팅 기록 불러오기
    axios
      .get(`${backServer}/chat/loadChatMessage?chatRoomNo=${selectedChatRoom}`)
      .then((res) => {
        // const newArr = res.data.map((item) => {
        //   item.isRead = 2;
        //   return item;
        // });
        // setMessages([...newArr]);
        setMessages(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
    if (selectedChatRoom !== null) {
      axios
        .patch(
          `${backServer}/chat/viewOk?roomNo=${selectedChatRoom}&chatMemberId=${memberInfo.memberId}`
        )
        .then((res) => {})
        .catch((err) => {
          console.log(err);
        });
    }
  }, [selectedChatRoom]);

  const sendMessage = () => {
    const date = new Date();
    const pad = (n) => (n < 10 ? "0" + n : n);
    const today =
      date.getFullYear() +
      "-" +
      pad(date.getMonth() + 1) +
      "-" +
      pad(date.getDate()) +
      " " +
      pad(date.getHours()) +
      ":" +
      pad(date.getMinutes()) +
      ":" +
      pad(date.getSeconds());
    console.log(today);
    if (stompClient && chatInput.trim() !== "") {
      const chatMessage = {
        chatMemberId: memberInfo.memberId,
        messageContent: chatInput,
        memberLevel: memberInfo.memberLevel,
        messageDate: today,
        isRead: 1,
        memberThumb: memberInfo.memberThumb,
      };
      stompClient.publish({
        destination: `/app/chat/sendMessage/${selectedChatRoom}`,
        body: JSON.stringify(chatMessage),
      });
      setChatInput("");
    }
  };
  console.log(messages);
  const chatBoxRef = useRef(null);
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <>
      <div className="chat-box" ref={chatBoxRef}>
        {messages &&
          messages.map((msg, index) => (
            <div
              key={index}
              className={
                msg.memberLevel === 1 // 관리자 여부를 member_level로 판단
                  ? "left-chat-line"
                  : "right-chat-line"
              }
            >
              {memberInfo.memberId !== msg.chatMemberId ? (
                <>
                  <div className="right-chat-profile">
                    <img
                      src={`${process.env.REACT_APP_BACK_SERVER}/member/profileimg/${msg.memberThumb}`}
                    />
                  </div>
                  <div className="chat-content">
                    <div className="chat-id">
                      {msg.chatMemberId} -{" "}
                      {msg.messageDate
                        ?.split(" ")[1]
                        ?.split(":")
                        .slice(0, 2)
                        .join(":")}
                    </div>
                    <div className="chat-text">{msg.messageContent}</div>
                  </div>
                </>
              ) : (
                <>
                  <div className="chat-content">
                    <div className="chat-id">
                      {msg.isRead === 1 ? <VisibilityOffIcon /> : ""}
                      {msg.messageDate
                        ?.split(" ")[1]
                        ?.split(":")
                        .slice(0, 2)
                        .join(":")}{" "}
                      - {memberInfo.memberId}
                    </div>
                    <div className="chat-text">{msg.messageContent}</div>
                  </div>
                  <div className="left-chat-profile">
                    <img
                      src={`${process.env.REACT_APP_BACK_SERVER}/member/profileimg/${memberInfo.memberThumb}`}
                      alt="관리자"
                    />
                  </div>
                </>
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
            if (e.key === "Enter" && chatInput !== "") {
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
