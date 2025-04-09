import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import "./chat.css";
import { useRecoilState, useRecoilValue } from "recoil";
import { memberState, wsState } from "../utils/RecoilData";
import CatchingPokemonIcon from "@mui/icons-material/CatchingPokemon";
import ElderlyWomanIcon from "@mui/icons-material/ElderlyWoman";
import axios from "axios";

const ChatMain = (props) => {
  const { senderNo, receiverNo } = useParams();
  const loginMember = useRecoilValue(memberState); //채팅 식별자로 아이디 사용
  const [chatList, setChatList] = useState([]); //채팅메세지가 저장될 배열
  const navigate = useNavigate();
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
        if (res.data) {
          setChatList(res.data);
        }
      })
      .catch((err) => {});
  }, []);

  useEffect(() => {
    const socket = new WebSocket(
      `${socketServer}/dm?memberNo=${loginMember.memberNo}&receiverNo=${receiverNo}`
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
  };

  //메세지 받는 함수
  const receiveMsg = (receiveData) => {
    console.log("서버에서 데이터를 받으면 실행되는 함수");
    const data = JSON.parse(receiveData.data); //문자열을 javascript 객체형식으로 전환
    console.log(data);
    if (data.isRead === "isReadOk") {
      const newArr = chatList.map((item) => {
        if (item.senderNo == loginMember.memberNo) {
          item.isRead = "Y";
        }
        return item;
      });
      setChatList([...newArr]);
    } else {
      if (
        data.senderNo === Number(senderNo) ||
        data.senderNo === Number(receiverNo)
      ) {
        setChatList([...chatList, data]);
      }
    }
  };

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
      <div className="page-title">
        <div>
          <span
            onClick={() => {
              navigate(`/myfit/activity/${receiverNo}`);
            }}
          >
            {actMember?.memberName}님과의 채팅
          </span>
        </div>
        <div>
          <span
            onClick={() => {
              navigate(`/myfit/dm/${senderNo}`);
            }}
          >
            목록으로
          </span>
        </div>
      </div>
      {loginMember ? (
        <div className="chat-content-wrap">
          <div className="chat-message-area" ref={chatDiv}>
            {chatList.map((chat, index) => {
              return (
                <div key={"chat-" + index} className="one-chat">
                  <p
                    className={
                      chat.senderNo === loginMember.memberNo
                        ? "chat right"
                        : "chat left"
                    }
                  >
                    <div
                      className="user"
                      onClick={() => {
                        navigate(`/myfit/activity/${chat.senderNo}`);
                      }}
                    >
                      <div className="img-wrap">
                        {chat.senderNo === loginMember.memberNo ? (
                          <img
                            src={
                              loginMember.memberThumb
                                ? `${process.env.REACT_APP_BACK_SERVER}/member/profileimg/${loginMember.memberThumb}`
                                : "/image/default_img.png"
                            }
                          />
                        ) : (
                          <img
                            src={
                              actMember.memberThumb
                                ? `${process.env.REACT_APP_BACK_SERVER}/member/profileimg/${actMember.memberThumb}`
                                : "/image/default_img.png"
                            }
                          />
                        )}
                      </div>
                      <span className="chat-id">
                        {chat.senderNo == loginMember.memberNo
                          ? loginMember.memberId
                          : actMember.memberId}
                      </span>
                    </div>
                    <div className="chat-content-box">
                      {chat.senderNo === Number(senderNo) && (
                        <div className="is-read">
                          {chat.isRead === "N" ? 1 : ""}
                        </div>
                      )}
                      <div className="chat-time">
                        {chat.sentAt.substring(11, 16)}
                      </div>
                      <div className="chat-message">{chat.dmContent}</div>
                    </div>
                  </p>
                </div>
              );
            })}
          </div>
          <div className="message-input-box">
            <div className="input-item">
              <div className="write-box">
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
                  autoComplete="off"
                ></input>
                <button className="btn-primary" onClick={sendMessage}>
                  전송
                </button>
              </div>
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
