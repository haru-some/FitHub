package kr.co.fithub.chat.model.service;

import org.springframework.stereotype.Service;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.web.socket.*;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import com.fasterxml.jackson.databind.ObjectMapper;

import kr.co.fithub.chat.model.dao.ChatDao;
import kr.co.fithub.chat.model.dto.ChatDTO;

@Service
public class ChatService extends TextWebSocketHandler {
    private ConcurrentHashMap<WebSocketSession, String> members = new ConcurrentHashMap<>();
    private ObjectMapper objectMapper = new ObjectMapper();
    private ChatDao chatDao;

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        System.out.println("클라이언트 접속 : " + session);
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        ObjectMapper om = new ObjectMapper();
        ChatDTO chat = om.readValue(message.getPayload(), ChatDTO.class);

        if (chat.getType().equals("enter")) {
            members.put(session, chat.getMemberId());
        } else if (chat.getType().equals("message")) {
            // 메시지 저장 (기본적으로 is_read = 'N'으로 저장됨)
            chat.setIsRead("N");
            chatDao.insertChatMessage(chat); // DB 저장

            // 상대방이 접속 중이면 읽음 처리
            if (members.containsValue(chat.getChatRoomNo())) {
                chatDao.markMessagesAsRead(chat.getChatRoomNo()); // 메서드명 수정
            }

            // 채팅방의 is_read 상태를 확인해서 message_alarm 업데이트
            String messageAlarm = chatDao.checkUnreadMessages(chat.getChatRoomNo()); // 메서드명 수정
            chatDao.updateMessageAlarm(chat.getChatRoomNo(), messageAlarm); // 새 메서드 추가 필요
        }

        // 모든 접속자에게 메시지 전송
        String data = om.writeValueAsString(chat);
        TextMessage sendData = new TextMessage(data);
        for (WebSocketSession s : members.keySet()) {
            s.sendMessage(sendData);
        }
    }

    @Override 
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        String memberId = members.remove(session);

        if (memberId != null) {
            ChatDTO chat = new ChatDTO("out", memberId, "나갔습니다.", null, null, "N"); // isRead 추가

            String data = objectMapper.writeValueAsString(chat);
            TextMessage sendMessage = new TextMessage(data);

            for (WebSocketSession s : members.keySet()) {
                if (s.isOpen()) {
                    s.sendMessage(sendMessage);
                }
            }
        }
    }

}
