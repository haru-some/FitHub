package kr.co.fithub.chat.controller;

import java.time.LocalDateTime;

import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import kr.co.fithub.chat.model.dto.ChatDTO;

@Controller
public class ChatController {
	
	private final SimpMessagingTemplate messagingTemplate;

    public ChatController(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    // 클라이언트가 "/app/chat.sendMessage"로 보낸 메시지를 처리
    @MessageMapping("/chat.sendMessage")
    @SendTo("/topic/chat")
    public ChatDTO sendMessage(ChatDTO message) {
        // 메시지에 현재 시간 추가
        message.setMessageDate(LocalDateTime.now().toString());
        return message; // 이 메시지는 "/topic/chat"을 구독한 클라이언트에게 전달됨
    }

 // 특정 방에 메시지 보내기
    @MessageMapping("/chat/{chatRoomId}")
    public void sendToRoom(@DestinationVariable String chatRoomId, ChatDTO message) {
        message.setMessageDate(LocalDateTime.now().toString());
        messagingTemplate.convertAndSend("/topic/chat/" + chatRoomId, message);
    }
    
    @MessageMapping("/chat.addUser")
    @SendTo("/topic/public")
    public ResponseEntity<ChatDTO> addUser(ChatDTO chatMessage) {
        chatMessage.setMessageContent(chatMessage.getMemberId() + "님이 입장하셨습니다.");
        return ResponseEntity.ok(chatMessage);
    }
}
