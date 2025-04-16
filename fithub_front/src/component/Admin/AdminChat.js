import { useState, useEffect, useRef } from "react";
import CircleIcon from "@mui/icons-material/Circle";
import { useRecoilValue } from "recoil";
import { memberState } from "../utils/RecoilData";
import axios from "axios";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const AdminChat = () => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const socket = new SockJS(`${backServer}/inMessage`);
  const [selectedChatRoom, setSelectedChatRoom] = useState(null);
  const [chatRooms, setChatRooms] = useState([]);
  const [alarm, setAlarm] = useState(0);
  const [messages, setMessages] = useState([]);
  const [stompClient, setStompClient] = useState(null);
  const memberInfo = useRecoilValue(memberState); // 현재 로그인한 회원 정보 가져오기
  const [visitRead, setVisitRead] = useState(false);

  useEffect(() => {
    axios
      .get(`${backServer}/chat/rooms`)
      .then((res) => {
        setChatRooms(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [alarm, backServer]);

  useEffect(() => {
    axios
      .patch(
        `${backServer}/chat/view?roomNo=${selectedChatRoom}&chatMemberId=${memberInfo?.memberId}`
      )
      .then(() => {
        axios.get(`${backServer}/chat/rooms`).then((res) => {
          setChatRooms(res.data);
        });
      })
      .catch((err) => {
        console.error("읽음 처리 실패", err);
      });
  }, [selectedChatRoom]);

  useEffect(() => {
    // WebSocket 연결
    const client = new Client({
      // brokerURL: `${socketServer}/inMessage`, // Spring Boot WebSocket 서버 주소
      webSocketFactory: () => socket,
      reconnectDelay: 10000,

      // connectHeaders: {
      //   Authorization: memberInfo?.memberNo,
      //   memberId: memberInfo?.memberId,
      //   roomId: selectedChatRoom,
      // },

      onConnect: () => {
        console.log("Connected to WebSocket");

        // 채팅 메시지 구독
        client.subscribe(
          `/topic/chat/messages/${selectedChatRoom}`,
          (message) => {
            const receivedMessage = JSON.parse(message.body);
            setMessages((prevMessages) => [...prevMessages, receivedMessage]);

            if (selectedChatRoom !== null) {
              // ✅ 일단 즉시 UI 반영
              setChatRooms((prevRooms) =>
                prevRooms.map((room) =>
                  room.chatRoomNo === selectedChatRoom
                    ? { ...room, unreadCount: 0 }
                    : room
                )
              );
            }
            if (selectedChatRoom !== null) {
              axios
                .patch(
                  `${backServer}/chat/view?roomNo=${selectedChatRoom}&chatMemberId=${memberInfo?.memberId}`
                )
                .then(() => {
                  // ✅ 읽음 처리 끝나면 다시 채팅방 목록 갱신
                  return axios.get(`${backServer}/chat/rooms`);
                })
                .then((res) => {
                  setChatRooms(res.data); // ✅ UI 갱신 핵심
                })
                .catch((err) => {
                  console.error("읽음 처리 후 갱신 실패", err);
                });
            }
          }
        );

        client.subscribe("/queue/notifications", (message) => {
          const receivedMessage = parseInt(message.body, 10);
          if (receivedMessage === 1) {
            console.log("New message in another room!");
            setAlarm((prev) => prev + 1);
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
            setVisitRead={setVisitRead}
            setChatRooms={setChatRooms}
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
                  alt=""
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
            {room.chatRoomNo !== selectedChatRoom && room.unreadCount > 0 && (
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
      .get(
        `${backServer}/chat/room/admin/message?chatRoomNo=${selectedChatRoom}`
      )
      .then((res) => {
        setMessages(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [selectedChatRoom, backServer]);

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
                msg.memberLevel === 2 ? "right-chat-line" : "left-chat-line"
              }
            >
              {msg.memberLevel === 2 ? (
                <>
                  <div className="right-chat-profile">
                    <img
                      src={`${process.env.REACT_APP_BACK_SERVER}/member/profileimg/${msg.memberThumb}`}
                      alt=""
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
                    <div className="chat-text-box">
                      <div className="chat-text">{msg.messageContent}</div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="chat-content">
                    <div className="chat-id">
                      {/* {msg.isRead === 1 ? <VisibilityOffIcon /> : ""} */}
                      {msg.messageDate
                        ?.split(" ")[1]
                        ?.split(":")
                        .slice(0, 2)
                        .join(":")}{" "}
                      - {msg.chatMemberId}
                    </div>
                    <div className="chat-text-box">
                      <div className="chat-text">{msg.messageContent}</div>
                    </div>
                  </div>
                  <div className="left-chat-profile">
                    <img
                      src={`${process.env.REACT_APP_BACK_SERVER}/member/profileimg/${msg.memberThumb}`}
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
