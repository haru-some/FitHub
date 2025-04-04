import { Link, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import "./chat.css";
import { useRecoilState, useRecoilValue } from "recoil";
import { memberState, wsState } from "../utils/RecoilData";
import CatchingPokemonIcon from "@mui/icons-material/CatchingPokemon";
import ElderlyWomanIcon from "@mui/icons-material/ElderlyWoman";
import axios from "axios";

const ChatMain = () => {
  const { senderNo, reciverNo } = useParams();
  const loginMember = useRecoilValue(memberState); //채팅 식별자로 아이디 사용
  const [chatList, setChatList] = useState([]); //채팅메세지가 저장될 배열

  const [chatMsg, setChatMsg] = useState({
    type: "enter",
    memberId: loginMember.memberId,
    message: "",
  });

  const [actMember, setActMember] = useState(null);
  const backServer = process.env.REACT_APP_BACK_SERVER; //http://192.168.10.3:8888
  const socketServer = backServer.replace("http://", "ws://"); //ws://192.168.10.3:8888
  const [ws, setWs] = useRecoilState(wsState);
  //회원 정보 불러오는 함수
  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_BACK_SERVER}/myfit/activity/${reciverNo}?loginMemberNo=${loginMember.memberNo}`
      )
      .then((res) => {
        console.log(res.data);
        setActMember(res.data);
      })
      .catch((err) => {});
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
    <section className="section chat-wrap">
      <div className="page-title">{actMember?.memberName}님과의 채팅</div>
      {loginMember ? (
        <div className="chat-content-wrap">
          <div className="chat-message-area" ref={chatDiv}>
            {chatList.map((chat, index) => {
              console.log(chat.memberId);
              console.log(loginMember.memberId);
              return (
                <div key={"chat-" + index}>
                  {chat.type === "enter" ? (
                    <p className="info">
                      <span>{chat.memberId}</span>님이 입장하셨습니다.
                    </p>
                  ) : chat.type === "out" ? (
                    <p className="info">
                      <span>{chat.memberId}</span>님이 퇴장하셨습니다.
                    </p>
                  ) : chat.memberId === "grandmother" ? (
                    <p
                      className={
                        chat.memberId === loginMember.memberId
                          ? "chat right"
                          : "chat left"
                      }
                    >
                      <div className="user">
                        <ElderlyWomanIcon />
                        <span className="chat-id">{chat.memberId}</span>
                      </div>
                      <div className="chat-message">{chat.message}</div>
                    </p>
                  ) : (
                    <p
                      className={
                        chat.memberId === loginMember.memberId
                          ? "chat right"
                          : "chat left"
                      }
                    >
                      <div className="user">
                        <CatchingPokemonIcon />
                        <span className="chat-id">{chat.memberId}</span>
                      </div>
                      <div className="chat-message">{chat.message}</div>
                    </p>
                  )}
                </div>
              );
            })}
          </div>
          <div className="message-input-box">
            <div className="input-item">
              <div className="user">
                <span className="chat-id">{loginMember.memberId}</span>
              </div>
              <input
                id="chat-message"
                value={chatMsg.message}
                onChange={(e) => {
                  setChatMsg({ ...chatMsg, message: e.target.value });
                }}
                onKeyUp={(e) => {
                  if (e.key === "Enter" && chatMsg.message !== "") {
                    sendMessage();
                  }
                }}
              ></input>
              <button className="btn-primary" onClick={sendMessage}>
                전송
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="login=info-box">
          <h3>로그인 후 이용 가능합니다.</h3>
          <Link to="/login">로그인 페이지로 이동</Link>
        </div>
      )}
    </section>
  );
};

export default ChatMain;
