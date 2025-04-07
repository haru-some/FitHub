import { Link, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import "./chat.css";
import { useRecoilState, useRecoilValue } from "recoil";
import { memberState, wsState } from "../utils/RecoilData";
import CatchingPokemonIcon from "@mui/icons-material/CatchingPokemon";
import ElderlyWomanIcon from "@mui/icons-material/ElderlyWoman";
import axios from "axios";

const ChatMain = () => {
  const { senderNo, receiverNo } = useParams();
  const loginMember = useRecoilValue(memberState); //채팅 식별자로 아이디 사용
  const [chatList, setChatList] = useState([]); //채팅메세지가 저장될 배열

  const [chatMsg, setChatMsg] = useState({
    type: "chat",
    senderNo: senderNo,
    receiverNo: receiverNo,
    message: "",
  });

  const [actMember, setActMember] = useState({});
  const backServer = process.env.REACT_APP_BACK_SERVER; //http://192.168.10.3:8888
  const socketServer = backServer.replace("http://", "ws://"); //ws://192.168.10.3:8888
  const [ws, setWs] = useState({});
  //회원 정보 불러오는 함수
  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_BACK_SERVER}/myfit/activity/${receiverNo}?loginMemberNo=${loginMember.memberNo}`
      )
      .then((res) => {
        console.log(res.data);
        setActMember(res.data);
      })
      .catch((err) => {});
  }, []);

  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_BACK_SERVER}/myfit/dm?senderNo=${senderNo}&receiverNo=${receiverNo}`
      )
      .then((res) => {
        setChatList(res.data);
      })
      .catch((err) => {});
  }, []);

  useEffect(() => {
    const socket = new WebSocket(
      `${socketServer}/dm?memberNo=${loginMember.memberNo}`
    );
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
    ws.onmessage = receiveMsg;
  }, [chatList]);

  //소켓 연결시 최초 실행되는 함수
  const startChat = () => {
    console.log("웹소켓 연결이 되면 실행되는 함수");
    //데이터를 주고 받을 때는 문자열 밖에 안됨
    // const data = JSON.stringify(chatMsg); //전송할 데이터 객체를 문자열로 변환
    // ws.send(data); //매개변수로 전달한 문자열을 연결된 웹소켓 서버로 전송
    // setChatMsg({ ...chatMsg, type: "chat" }); //최초 접속 이후에는 채팅만 보낸 예정이므로 미리 작업
  };
  console.log(chatMsg.type);

  //메세지 받는 함수
  const receiveMsg = (receiveData) => {
    console.log("서버에서 데이터를 받으면 실행되는 함수");
    const data = JSON.parse(receiveData.data); //문자열을 javascript 객체형식으로 전환

    setChatList([...chatList, data]);
  };
  console.log(chatList);

  //챗 끝나면 돌아가는 함수
  const endChat = () => {
    console.log("웹소켓 연결이 끊어지면 실행되는 함수");
  };
  useEffect(() => {
    if (ws) {
      ws.onopen = startChat;
      ws.onmessage = receiveMsg;
      ws.onclose = endChat;
    }
  }, [ws]);

  //메세지 보내는 함수
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
              return (
                <div key={"chat-" + index}>
                  <p
                    className={
                      chat.senderNo === loginMember.memberNo
                        ? "chat right"
                        : "chat left"
                    }
                  >
                    <div class="user">
                      <ElderlyWomanIcon />
                      <span class="chat-id">
                        {chat.senderNo == loginMember.memberNo
                          ? loginMember.memberId
                          : actMember.memberId}
                      </span>
                    </div>
                    <div class="chat-message">{chat.dmContent}</div>
                  </p>
                </div>

                // <div key={"chat-" + index}>
                //   {chat.type === "enter" ? (
                //     <p className="info">
                //       <span>{chat.memberId}</span>님이 입장하셨습니다.
                //     </p>
                //   ) : chat.type === "out" ? (
                //     <p className="info">
                //       <span>{chat.memberId}</span>님이 퇴장하셨습니다.
                //     </p>
                //   ) : chat.memberId === "grandmother" ? (
                //     <p
                //       className={
                //         chat.senderNo === loginMember.memberNo
                //           ? "chat right"
                //           : "chat left"
                //       }
                //     >
                //       <div className="user">
                //         <ElderlyWomanIcon />
                //         <span className="chat-id">{chat.senderNo}</span>
                //       </div>
                //       <div className="chat-message">{chat.message}</div>
                //     </p>
                //   ) : (
                //     <p
                //       className={
                //         chat.senderNo === loginMember.memberNo
                //           ? "chat right"
                //           : "chat left"
                //       }
                //     >
                //       <div className="user">
                //         <CatchingPokemonIcon />
                //         <span className="chat-id">{chat.senderNo}</span>
                //       </div>
                //       <div className="chat-message">{chat.message}</div>
                //     </p>
                //   )}
                // </div>
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
