import { useState, useEffect, useRef } from "react";
import CircleIcon from "@mui/icons-material/Circle";
import { useRecoilState, useRecoilValue } from "recoil";
import { isLoginState, memberState } from "../utils/RecoilData";

const MemberChat = () => {
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const ws = useRef(null);
  const member = useRecoilValue(memberState);
  const backServer = process.env.REACT_APP_BACK_SERVER; //http://192.168.10.34:9999
  const socketServer = backServer.replace("http://", "ws://"); //ws://192.168.10.34:9999

  useEffect(() => {
    ws.current = new WebSocket(
      `${socketServer}/allChat?chatRoomNo=${member.chatRoomNo}`
    );
    ws.current.onmessage = (event) => {
      const newMessage = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    };
    return () => ws.current.close();
  }, [member.chatRoomNo]);

  const sendMessage = () => {
    if (chatInput.trim() === "") return;
    const message = {
      type: "message",
      chatRoomNo: member.chatRoomNo,
      memberId: member.memberId,
      content: chatInput,
    };
    ws.current.send(JSON.stringify(message));
    setChatInput("");
  };

  return (
    <section className="member-chat-section">
      <div className="page-title">고객센터 문의</div>
      <div className="chat-box">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={
              msg.memberId === member.memberId
                ? "member-chat-line"
                : "admin-chat-line"
            }
          >
            {msg.memberId !== member.memberId && (
              <div className="admin-chat-profile">
                <img src="/image/default_img.png" alt="관리자" />
              </div>
            )}
            <div className="chat-content">
              <div className="chat-id">
                {msg.memberId} - {msg.sentAt}
              </div>
              <div className="chat-text">{msg.content}</div>
            </div>
            {msg.memberId === member.memberId && (
              <div className="member-chat-profile">
                <img src="/image/default_img.png" alt="프로필" />
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
        <button type="button" onClick={sendMessage}>
          전송
        </button>
      </div>
    </section>
  );
};

export default MemberChat;
