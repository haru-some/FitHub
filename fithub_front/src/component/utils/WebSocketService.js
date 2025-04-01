import { Client } from "@stomp/stompjs";

const backServer = process.env.REACT_APP_BACK_SERVER;
const socketServer = backServer.replace("http://", "ws://");
/*
const socket = new WebSocket("ws://192.168.10.38:8888/chat");
socket.onopen = () => console.log("WebSocket 연결 성공!");
socket.onerror = (error) => console.log("WebSocket 오류 발생:", error);
*/
class WebSocketService {
  constructor() {
    this.client = null;
    this.callbacks = {};
  }
  connect(chatRoomId) {
    this.client = new Client({
      brokerURL: `${socketServer}/chat`,
      onConnect: () => {
        console.log("WebSocket 연결됨!");

        // 특정 채팅방 구독
        this.client.subscribe(`/topic/chat/${chatRoomId}`, (message) => {
          const data = JSON.parse(message.body);
          if (this.callbacks["message"]) {
            this.callbacks["message"](data);
          }
        });
      },
      onDisconnect: () => {
        console.log("WebSocket 연결 해제됨.");
      },
    });

    this.client.activate();
  }

  sendMessage(message) {
    if (this.client && this.client.connected) {
      this.client.publish({
        destination: "/app/chat.sendMessage",
        body: JSON.stringify(message),
      });
    }
  }

  on(event, callback) {
    this.callbacks[event] = callback;
  }

  disconnect() {
    if (this.client) {
      this.client.deactivate();
    }
  }
}

export default new WebSocketService();
