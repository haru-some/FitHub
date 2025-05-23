import { useState, useEffect, useRef } from "react";
import { useRecoilState } from "recoil";
import { logoutState, memberState } from "../utils/RecoilData";
import "./chat.css";
import axios from "axios";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const MemberChat = () => {
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [logoutST, setLogoutST] = useRecoilState(logoutState);
  const [memberInfo, setMemberInfo] = useRecoilState(memberState);
  const navigate = useNavigate();

  const [stompClient, setStompClient] = useState(null);
  const backServer = process.env.REACT_APP_BACK_SERVER; //http://192.168.10.34:9999
  const socket = new SockJS(`${backServer}/inMessage`);
  const [roomNo, setRoomNo] = useState(null);
  const [newRoom, setNewRoom] = useState(false);

  if (logoutST) {
    navigate("/");
    setLogoutST(false);
  } else {
    if (!memberInfo) {
      Swal.fire({
        title: "로그인 필요",
        text: "로그인이 필요한 서비스입니다.",
        icon: "warning",
        confirmButtonColor: "#589c5f",
        confirmButtonText: "확인",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login");
        }
      });
    }
  }
  useEffect(() => {
    // 기존 채팅 기록 불러오기
    axios
      .get(`${backServer}/chat/check/room?memberId=${memberInfo.memberId}`)
      .then((res) => {
        if (res.data.chatRoomNo) {
          //있으면 시작하기
          setRoomNo(res.data.chatRoomNo);
          axios
            .get(
              `${backServer}/chat/room/member/message?memberId=${memberInfo.memberId}`
            )
            .then((res) => {
              setMessages(res.data);
            })
            .catch((err) => {
              console.log(err);
            });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [newRoom, roomNo]);

  useEffect(() => {
    axios
      .patch(
        `${backServer}/chat/view?roomNo=${roomNo}&chatMemberId=${memberInfo.memberId}`
      )
      .then((res) => {})
      .catch((err) => {
        console.log(err);
      });
  }, [roomNo]);

  useEffect(() => {
    // WebSocket 연결
    const client = new Client({
      // brokerURL: `${socketServer}/inMessage`, // Spring Boot WebSocket 서버 주소
      webSocketFactory: () => socket,
      reconnectDelay: 10000,

      // connectHeaders: {
      //   // 기존 Authorization 외에 memberId, roomId를 추가
      //   Authorization: memberInfo.memberNo,
      //   memberId: memberInfo.memberId, // 유저의 ID (예: kingjoji)
      //   roomId: roomNo, // 현재 입장한 채팅방 ID
      // },

      onConnect: () => {
        // 채팅 메시지 구독
        client.subscribe(`/topic/chat/messages/${roomNo}`, (message) => {
          const receivedMessage = JSON.parse(message.body);
          setMessages((prevMessages) => [...prevMessages, receivedMessage]);
        });
      },
      onDisconnect: () => {},
    });

    client.activate();
    setStompClient(client);

    return () => {
      client.deactivate();
    };
  }, [roomNo, newRoom]);

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
  //채팅 시 스크롤 이벤트
  const chatBoxRef = useRef(null);
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  const adminChatStart = () => {
    axios
      .post(`${backServer}/chat/room?memberId=${memberInfo.memberId}`)
      .then((res) => {
        setNewRoom((prev) => !prev);
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
          {roomNo !== null &&
            messages.map((msg, index) => (
              <div
                key={index}
                className={
                  memberInfo && msg.chatMemberId !== memberInfo.memberId
                    ? "right-chat-line"
                    : "left-chat-line"
                }
              >
                {memberInfo && memberInfo.memberId !== msg.chatMemberId ? (
                  <>
                    <div className="right-chat-profile">
                      {msg.memberThumb !== null ? (
                        <img
                          src={`${process.env.REACT_APP_BACK_SERVER}/member/profileimg/${msg.memberThumb}`}
                        />
                      ) : (
                        <img src="/image/default_img.png" alt="프로필" />
                      )}
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
                      {msg.memberThumb !== null ? (
                        <img
                          src={`${process.env.REACT_APP_BACK_SERVER}/member/profileimg/${msg.memberThumb}`}
                        />
                      ) : (
                        <img src="/image/default_img.png" alt="프로필" />
                      )}
                    </div>
                  </>
                )}
              </div>
            ))}
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
