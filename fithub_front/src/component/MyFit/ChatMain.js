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
  const startChat = () => {};

  //메세지 받는 함수
  const receiveMsg = (receiveData) => {
    const data = JSON.parse(receiveData.data); //문자열을 javascript 객체형식으로 전환

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
  const endChat = () => {};
  useEffect(() => {
    if (ws) {
      ws.onopen = startChat;
      ws.onmessage = receiveMsg;
      ws.onclose = endChat;
    }
  }, [ws]);

  function convertNewlinesToBr(input) {
    if (!input) return "";
    return input.replace(/(\r\n|\n|\r)/g, "<br/>");
  }

  //메세지 보내는 함수
  const sendMessage = () => {
    const obj = { ...chatMsg, message: convertNewlinesToBr(chatMsg.message) };
    const data = JSON.stringify(obj);

    ws.send(data);
    setChatMsg({ ...chatMsg, message: "" });
  };

  const areaRef = useRef(null);

  useEffect(() => {
    if (areaRef.current) {
      areaRef.current.style.height = 32 + "px";
    }
  }, []);

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
              const isLastOfGroup = (() => {
                const next = chatList[index + 1];
                if (!next) return true;

                const sameSender = next.senderNo === chat.senderNo;
                const sameMinute =
                  next.sentAt.substring(0, 16) === chat.sentAt.substring(0, 16);

                return !(sameSender && sameMinute);
              })();

              const isFirstOfGroup = (() => {
                const prev = chatList[index - 1];
                if (!prev) return true;

                return prev.senderNo !== chat.senderNo;
              })();

              return (
                <div key={"chat-" + index} className="one-chat">
                  <p
                    className={
                      chat.senderNo === loginMember.memberNo
                        ? "chat right"
                        : "chat left"
                    }
                  >
                    {isFirstOfGroup && (
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
                                  : "/image/profile.png"
                              }
                            />
                          ) : (
                            <img
                              src={
                                actMember.delStatus === "N" &&
                                actMember.memberThumb
                                  ? `${process.env.REACT_APP_BACK_SERVER}/member/profileimg/${actMember.memberThumb}`
                                  : "/image/profile.png"
                              }
                            />
                          )}
                        </div>
                        <span className="chat-id">
                          {chat.senderNo == loginMember.memberNo
                            ? loginMember.memberId
                            : actMember.delStatus === "N"
                            ? actMember.memberId
                            : "탈퇴한 회원"}
                        </span>
                      </div>
                    )}

                    <div className="chat-content-box">
                      <div
                        className="chat-message"
                        dangerouslySetInnerHTML={{ __html: chat.dmContent }}
                      ></div>
                      {isLastOfGroup && (
                        <div className="chat-time">
                          {chat.sentAt.substring(11, 16)}
                        </div>
                      )}
                      {chat.senderNo === Number(senderNo) && (
                        <div className="is-read">
                          {chat.isRead === "N" ? 1 : ""}
                        </div>
                      )}
                    </div>
                  </p>
                </div>
              );
            })}
          </div>
          <div className="message-input-box">
            <div className="input-item">
              <div className="write-box">
                <textarea
                  id="chat-message"
                  ref={areaRef}
                  value={chatMsg.message}
                  onChange={(e) => {
                    const textarea = e.target;
                    setChatMsg({ ...chatMsg, message: textarea.value });

                    // 높이 초기화 후 스크롤 높이만큼 다시 설정
                    textarea.style.height = "20px";
                    textarea.style.height =
                      Math.min(textarea.scrollHeight, 100) + "px";

                    if (textarea.scrollHeight > 100) {
                      textarea.scrollTop = textarea.scrollHeight;
                    }
                  }}
                  onKeyDown={(e) => {
                    const textarea = e.target;
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      if (chatMsg.message.trim() !== "") {
                        sendMessage();
                        textarea.style.height = "32px";
                      }
                    }
                  }}
                  autoComplete="off"
                />
                <button
                  className="btn-primary"
                  onClick={() => {
                    sendMessage();
                    areaRef.current.style.height = "32px";
                  }}
                >
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
