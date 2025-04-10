import { useState, useEffect, useRef } from "react";
import { useRecoilValue } from "recoil";
import { memberState } from "../utils/RecoilData";
import "./chat.css";
import axios from "axios";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import AddCommentIcon from "@mui/icons-material/AddComment";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

const MemberChat = () => {
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const memberInfo = useRecoilValue(memberState); // 현재 로그인한 회원 정보 가져오기
  const [stompClient, setStompClient] = useState(null);
  const backServer = process.env.REACT_APP_BACK_SERVER; //http://192.168.10.34:9999
  const socketServer = backServer.replace("http://", "ws://"); //ws://192.168.10.34:9999
  const socket = new SockJS(`${backServer}/inMessage`);
  const [roomNo, setRoomNo] = useState(null);
  const [newRoom, setNewRoom] = useState(null);

  useEffect(() => {
    // 기존 채팅 기록 불러오기
    console.log(memberInfo.memberId);
    axios
      .get(`${backServer}/chat/getRoomId?memberId=${memberInfo.memberId}`)
      .then((res) => {
        console.log(res.data.chatRoomNo);
        if (res.data.chatRoomNo !== null) {
          setRoomNo(res.data.chatRoomNo);
        }
        axios
          .get(
            `${backServer}/chat/loadChatMember?memberId=${memberInfo.memberId}`
          )
          .then((res) => {
            console.log(res);
            setMessages(res.data);
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });

    if (roomNo !== null) {
      axios
        .patch(
          `${backServer}/chat/viewOk?roomNo=${roomNo}&chatMemberId=${memberInfo.memberId}`
        )
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

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
        client.subscribe(`/topic/chat/messages/${roomNo}`, (message) => {
          const receivedMessage = JSON.parse(message.body);
          setMessages((prevMessages) => [...prevMessages, receivedMessage]);
        });
      },
      onDisconnect: () => console.log("Disconnected from WebSocket"),
    });

    client.activate();
    setStompClient(client);
    return () => {
      client.deactivate();
    };
  }, [roomNo]);

  const sendMessage = () => {
    const date = new Date();
    const today =
      date.getFullYear() +
      "-" +
      date.getMonth() +
      "-" +
      date.getDate() +
      "-" +
      date.getHours() +
      "-" +
      date.getMinutes() +
      "-" +
      date.getSeconds();
    if (stompClient && chatInput.trim() !== "") {
      const chatMessage = {
        chatMemberId: memberInfo.memberId,
        messageContent: chatInput,
        memberLevel: memberInfo.memberLevel,
        messageDate: today,
        isRead: 2,
        memberThumb: memberInfo.memberThumb,
      };
      stompClient.publish({
        destination: `/app/chat/sendMessage/${roomNo}`,
        body: JSON.stringify(chatMessage),
      });
      const notificationMessage = 1;

      // 알림 메시지를 `queue`로 전송 (모든 사용자가 받을 수 있도록)
      stompClient.publish({
        destination: `/app/chat/alarm`, // 알림을 전송할 목적지 설정
        body: notificationMessage, // 알림 메시지 전송
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

  const adminChatStart = () => {
    axios
      .put(`${backServer}/chat/create?memberId=${memberInfo.memberId}`)
      .then((res) => {
        console.log(res);
        axios
          .get(`${backServer}/chat/getRoomId?memberId=${memberInfo.memberId}`)
          .then((res) => {
            console.log(res);
            setNewRoom(res.data);
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <section className="member-chat-section">
      <div className="page-title">고객센터 문의</div>
      <div className="member-chat-box">
        <div className="chat-box" ref={chatBoxRef}>
          {roomNo !== null ? (
            messages.map((msg, index) => (
              <div
                key={index}
                className={
                  msg.chatMemberId !== memberInfo.memberId // 관리자 여부를 member_level로 판단
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
                          .join(":")}{" "}
                        -{" "}
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
            ))
          ) : (
            <div className="member-chat-none">
              <div className="chat-add-icon">
                <AddCommentIcon />
              </div>
              <div className="chat-notice">관리자 문의 시작하기</div>
            </div>
          )}
        </div>
        <div className="chat-input-box">
          {roomNo !== null ? (
            <>
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
            </>
          ) : (
            <>
              <input
                type="text"
                className="chat-input"
                placeholder="관리자 문의를 먼저 활성화 시켜주세요."
                disabled
              />
              <button type="button" onClick={adminChatStart}>
                시작하기
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default MemberChat;
